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
} from '../typescript/api';
import { fetchContainer, fetchData, filterToQuery } from '../cosmos-utils';
import { NotFoundError } from '../generated/api';
import { ItemResponse, PatchOperation } from '@azure/cosmos';
import { CosmosClient } from '@azure/cosmos';
declare function getContext(): any;

const DASHBOARDS = 'dashboards';

export const upsertDashboard = async (
  data: DashboardCreateReq | DashboardUpdateReq,
) => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const res = await dashboardContainer.items.upsert({
    ...data,
    authGroups: [],
  });
  const { _rid, _self, _etag, _attachments, _ts, ...rest } =
    res.resource as any;

  return rest;
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
  const res = await fetchData(body, DASHBOARDS);

  return { dashboards: res.values, totalDashboards: res.count };
};

export const createDashboardAuthGroup = async (
  data: DashboardGroupAuthCreateReq,
): Promise<DashboardGroupAuthCreateRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);
  const dashboardId = data.dashboardId;

  const res = await dashboardContainer.item(dashboardId, dashboardId).read();
  const authGroups = res.resource.authGroups;

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
    authGroups: res2.resource.authGroups,
    dashboardId: res2.resource.id,
    dashboardName: res2.resource.name,
  };
};

export const readDashboardGroupAuth = async (
  data: DashboardGroupAuthReadReq,
): Promise<DashboardGroupAuthReadRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const str = filterToQuery(
    { filters: data.filters },
    'p',
    `c.id = '${data.dashboardId}'`,
  );
  const countStr = `SELECT VALUE COUNT(1) FROM c JOIN p IN c.authGroups ${str}`;

  const str2 = filterToQuery(
    { filters: data.filters, from: data.from, to: data.to },
    'p',
    `c.id = '${data.dashboardId}'`,
  );

  const query = `SELECT c.name, p.groupName, p.create, p.read, p["update"], p.delete, p.groupId FROM c JOIN p IN c.authGroups ${str2}`;

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

  if (res.resources.length === 0) {
    throw new NotFoundError('No group auth found.');
  }

  return {
    totalCount: res2.resources[0], // Use the count obtained from the stored procedure
    authGroups: res?.resources,
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

  const resAuthGroups = resource.authGroups;

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
    authGroups: res.resource.authGroups,
    dashboardId: res.resource.id,
    dashboardName: res.resource.name,
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
        const index = res.resource.authGroups.findIndex(
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
        authGroups: resource.authGroups,
        dashboardId: resource.id,
        dashboardName: resource.name,
      };
    }
  }
};
