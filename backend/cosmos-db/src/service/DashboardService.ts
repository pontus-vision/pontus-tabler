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
  DashboardAuthGroupsRef,
  DashboardAuthGroups,
} from '../typescript/api';
import { fetchContainer, fetchData, filterToQuery } from '../cosmos-utils';
import { NotFoundError } from '../generated/api';
import { ItemResponse, PatchOperation } from '@azure/cosmos';
import { CosmosClient } from '@azure/cosmos';
import { initiateMenuContainer } from './MenuService';
import { createConnection, deleteTableDataEdge, readTableDataEdge } from './EdgeService';
import { AUTH_GROUPS } from './AuthGroupService';
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

  if (data?.menuItem) {
    const menuItem = data.menuItem;
    const child = menuItem.children[0];

    const path = `${menuItem?.path}${menuItem?.path?.endsWith('/') ? '' : '/'}${
      child.name
    }`;

    const res = await menuContainer.items.create({
      ...child,
      path: path,
      id: menuItem.id,
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

  const res2 = await createConnection(
    {
      containerName: DASHBOARDS,
      values: [{ id: data.id }],
    },
    { rowIds: data.authGroups, tableName: 'authGroups' },
    'authGroups',
    'oneToMany',
  );

  return {
    authGroups: res2.map(el=> el.to) as DashboardAuthGroups[],
    id: data.id,
    name: res2[0].to.docName,
  };
};

export const readDashboardGroupAuth = async (
  data: DashboardGroupAuthReadReq,
): Promise<DashboardGroupAuthReadRes> => {
  const res = await readTableDataEdge({
    edge: {
      direction: 'from',
      edgeLabel: 'groups-dashboards',
      tableName: AUTH_GROUPS,
      
    },
    rowId: data.id,
    tableName: DASHBOARDS,
    filters: data.filters,
    from: data.from,
    to: data.to,
  });

  if (res.count === 0) {
    throw new NotFoundError('No group auth found.');
  }
  return {
    authGroups: res.edges as DashboardAuthGroups[],
    id: data.id,
    totalCount: res.count,

  };
};

export const deleteDashboardGroupAuth = async (
  data: DashboardGroupAuthDeleteReq,
): Promise<DashboardGroupAuthDeleteRes> => {
  // checkFields(data.authGroups);
  const res = await deleteTableDataEdge({
    rowId: data.id,
    tableName: DASHBOARDS,
    edge: {
      direction: 'to',
      edgeLabel: 'groups-users',
      tableName: AUTH_GROUPS,
      rows: data.authGroups,
      partitionKeyProp: 'username',
    },

  });
  
  return 'Auth Groups disassociated from dashboard'
};

export const updateDashboardGroupAuth = async (
  data: DashboardGroupAuthUpdateReq,
): Promise<DashboardGroupAuthUpdateRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const id = data.id;

  const res = (await dashboardContainer
    .item(id, id)
    .read()) as ItemResponse<DashboardGroupAuthReadRes>;

  const batchPatchArr: PatchOperation[][] = [];

  while (data.authGroups.length > 0) {
    batchPatchArr.push(
      data.authGroups.splice(0, 10).map((authGroup) => {
        const index = res.resource?.authGroups.findIndex(
          (i) => i.id === authGroup.id,
        );
        if (index === -1) {
          throw new NotFoundError(
            `No group auth found at: (name: ${authGroup.name}, id: ${authGroup.id})`,
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
    const res2 = await dashboardContainer.item(id, id).patch(batch);

    if (index === batchPatchArr.length - 1) {
      const resource = res2.resource;

      return {
        authGroups: resource?.authGroups,
        id: resource?.id,
        name: resource?.name,
      };
    }
  }
};
