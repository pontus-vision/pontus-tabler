import {
  DashboardDeleteReq,
  DashboardCreateReq,
  DashboardUpdateReq,
  ReadPaginationFilter,
  DashboardsReadRes,
  DashboardGroupAuthCreateReq,
  DashboardGroupAuthCreateRes,
  DashboardGroupAuthReadReq,
  DashboardGroupAuthReadRes,
  DashboardGroupAuthUpdateReq,
  DashboardGroupAuthUpdateRes,
  DashboardGroupAuthDeleteReq,
  DashboardGroupAuthDeleteRes,
  DashboardUpdateRes,
  DashboardCreateRes,
} from '../typescript/api';
import { fetchContainer, fetchData, filterToQuery } from '../cosmos-utils';
import { NotFoundError } from '../generated/api';
import { ItemResponse, PatchOperation } from '@azure/cosmos';
import { CosmosClient } from '@azure/cosmos';
import { initiateMenuContainer } from './MenuService';
declare function getContext(): any;

export const DASHBOARDS = 'dashboards';

export const createDashboard = async (
  data: DashboardCreateReq,
): Promise<DashboardCreateRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);
  const menuContainer = await initiateMenuContainer();

  const res = await dashboardContainer.items.create({
    ...data,
    authGroups: [],
  });
  console.log({ res: JSON.stringify(res.resource) });

  const dashboardId = res.resource.id;

  if (data?.menuItem) {
    const menuItem = data.menuItem;
    const child = menuItem.children[0];

    const path = `${menuItem?.path}${menuItem?.path?.endsWith('/') ? '' : '/'}${
      child.name
    }`;
    console.log({ path, child, menuItem });

    const res = await menuContainer.items.create({
      ...child,
      path: path,
      id: dashboardId,
    });

    try {
      const res2 = await menuContainer
        .item(menuItem.id, menuItem.path)
        .patch([{ op: 'add', path: `/children/-`, value: res.resource }]);
    } catch (error) {
      if (error?.code === 404) {
        throw new NotFoundError(
          `Parent folder at path '${menuItem.path}, at id '${menuItem.id} not found.'`,
        );
      }
    }
  }
  const { _rid, _self, _etag, _attachments, _ts, ...rest } =
    res.resource as any;

  return rest;
};

export const updateDashboard = async (
  data: DashboardUpdateReq,
): Promise<DashboardUpdateRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  try {
    const patchArr: PatchOperation[] = [];
    for (const prop in data) {
      switch (prop) {
        case 'name':
          patchArr.push({
            op: 'replace',
            path: '/name',
            value: data[prop],
          });
          break;
        case 'state':
          patchArr.push({
            op: 'replace',
            path: '/state',
            value: data[prop],
          });
          break;
        case 'folder':
          patchArr.push({
            op: 'replace',
            path: '/folder',
            value: data[prop],
          });
        case 'owner':
          patchArr.push({
            op: 'replace',
            path: '/owner',
            value: data[prop],
          });
          break;

        default:
          break;
      }
    }

    const res3 = await dashboardContainer
      .item(data.id, data.id)
      .patch(patchArr);
    return res3.resource;
  } catch (error) {}
};

export const readDashboardById = async (dashboardId: string) => {
  const querySpec = {
    query: 'select * from dashboards p where p.id=@dashboardId',
    parameters: [
      {
        name: '@dashboardId',
        value: dashboardId,
      },
    ],
  };
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const { resources } = await dashboardContainer.items
    .query(querySpec)
    .fetchAll();
  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw new NotFoundError('No dashboard found.');
  }
};

export const deleteDashboard = async (data: DashboardDeleteReq) => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);
  const res = await dashboardContainer.item(data.id, data.id).delete();

  return 'Dashboard deleted!';
};

export const readDashboards = async (
  body: ReadPaginationFilter,
): Promise<DashboardsReadRes> => {
  try {
    const res = await fetchData(body, DASHBOARDS);
    console.log({ res });
    return { dashboards: res.values, totalDashboards: res.count };
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError('No dashboards found');
    }
  }
};

export const createDashboardAuthGroup = async (
  data: DashboardGroupAuthCreateReq,
): Promise<DashboardGroupAuthCreateRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);
  const dashboardId = data.dashboardId;

  const res = await dashboardContainer.item(dashboardId, dashboardId).read();

  const patchArr: PatchOperation[] = [];

  for (const [index, el] of data.authGroups?.entries()) {
    patchArr.push({
      op: 'add',
      path: `/authGroups/-`,
      value: el,
    });
  }

  const res2 = await dashboardContainer
    .item(dashboardId, dashboardId)
    .patch(patchArr);

  return {
    authGroups: res2.resource?.authGroups,
    dashboardId: res2.resource?.id,
    dashboardName: res2.resource?.name,
  };
};

export const readDashboardGroupAuth = async (
  data: DashboardGroupAuthReadReq,
): Promise<DashboardGroupAuthReadRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const str = filterToQuery(
    { filters: data.filters },
    'p',
    `c.id = "${data.dashboardId}"`,
  );
  const countStr = `SELECT VALUE COUNT(1) FROM c JOIN p IN c.authGroups ${str}`;

  const str2 = filterToQuery(
    { filters: data.filters, from: data.from, to: data.to },
    'p',
    `c.id = "${data.dashboardId}"`,
  );

  const query = `SELECT c.name, p["groupName"], p.create, p.read, p["update"], p.delete, p.groupId FROM c JOIN p IN c.authGroups ${str2}`;

  console.log({ countStr, query, str2 });

  const res = await dashboardContainer.items
    .query({
      query,
      parameters: [],
    })
    .fetchAll();

  const res2 = await dashboardContainer.items
    .query({
      query: countStr,
      parameters: [],
    })
    .fetchAll();

  if (res.resources?.length === 0) {
    throw new NotFoundError('No group auth found.');
  }

  console.log({ res: res.requestCharge, res2: res2.requestCharge });

  return {
    totalCount: res2?.resources[0], // Use the count obtained from the stored procedure
    authGroups: res.resources.map((el) => {
      const { name, ...rest } = el;
      return rest;
    }),
    dashboardId: data?.dashboardId,
    dashboardName: res?.resources[0]?.name,
  };
};

export const deleteDashboardGroupAuth = async (
  data: DashboardGroupAuthDeleteReq,
): Promise<DashboardGroupAuthDeleteRes> => {
  // checkFields(data.authGroups);

  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const dashboardId = data.dashboardId;

  const res3 = await dashboardContainer.item(dashboardId, dashboardId).read();

  const resource = res3.resource as DashboardGroupAuthReadRes;

  const resAuthGroups = resource?.authGroups;

  const patchArr: PatchOperation[] = [];

  for (const [index, el] of data.authGroups.entries()) {
    const indexUpdate = resAuthGroups.findIndex((el2) => el2.groupId === el);

    patchArr.push({
      op: 'remove',
      path: `/authGroups/${indexUpdate}`,
    });
  }

  const res = await dashboardContainer
    .item(dashboardId, dashboardId)
    .patch(patchArr);

  return {
    authGroups: res.resource?.authGroups,
    dashboardId: res.resource?.id,
    dashboardName: res.resource?.name,
  };
};

export const updateDashboardGroupAuth = async (
  data: DashboardGroupAuthUpdateReq,
): Promise<DashboardGroupAuthUpdateRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const dashboardId = data.dashboardId;

  const res = (await dashboardContainer
    .item(dashboardId, dashboardId)
    .read()) as ItemResponse<DashboardGroupAuthReadRes>;

  const batchPatchArr: PatchOperation[][] = [];

  while (data.authGroups.length > 0) {
    batchPatchArr.push(
      data.authGroups.splice(0, 10).map((authGroup) => {
        const index = res.resource?.authGroups.findIndex(
          (i) => i.groupId === authGroup.groupId,
        );
        if (index === -1) {
          throw new NotFoundError(
            `No group auth found at: (name: ${authGroup.groupName}, id: ${authGroup.groupId})`,
          );
        }

        return {
          op: 'set',
          path: `/authGroups/${index}`,
          value: authGroup,
        };
      }),
    );
  }

  for (const [index, batch] of batchPatchArr.entries()) {
    const res2 = await dashboardContainer
      .item(dashboardId, dashboardId)
      .patch(batch);

    if (index === batchPatchArr.length - 1) {
      const resource = res2.resource;

      return {
        authGroups: resource?.authGroups,
        dashboardId: resource?.id,
        dashboardName: resource?.name,
      };
    }
  }
};
