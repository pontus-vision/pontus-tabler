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
} from '../../typescript/api';
import { fetchContainer, fetchData } from '../../cosmos-utils';
import { filterToQuery } from '../../db-utils';
import { NotFoundError } from '../../generated/api';
import { ItemResponse, PatchOperation } from '@azure/cosmos';
import { CosmosClient } from '@azure/cosmos';
import { initiateMenuContainer } from './MenuService';
import {
  createConnection,
  createTableDataEdge,
  deleteTableDataEdge,
  readTableDataEdge,
  updateTableDataEdge,
} from './EdgeService';
import { AUTH_GROUPS, initiateAuthGroupContainer } from './AuthGroupService';
import { AUTH_USERS } from './AuthUserService';
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
  const res = (await createTableDataEdge({
    edge: 'groups-dashboards',
    edgeType: 'oneToMany',
    tableFrom: {
      tableName: AUTH_GROUPS,
      rows: data.authGroups as any,
      partitionKeyProp: 'name',
    },
    tableTo: {
      tableName: DASHBOARDS,
      rows: data.authGroups.map((group) => {
        return {
          id: data.id,

          create: group.create,
          read: group.read,
          update: group.update,
          delete: group.delete,
        };
      }),
    },
  })) as any;

  return {
    authGroups: res.map((el) => el.from) as DashboardAuthGroups[],
    id: data.id,
    name: res[0].docName,
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
    authGroups: res.edges as any[],
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
      rows: data.authGroups as any,
      partitionKeyProp: 'username',
    },
  });

  return 'Auth Groups disassociated from dashboard';
};

export const updateDashboardGroupAuth = async (
  data: DashboardGroupAuthUpdateReq,
): Promise<DashboardGroupAuthUpdateRes> => {
  const authGroupContainer = await fetchContainer(DASHBOARDS);
  const res = await authGroupContainer.item(data.id, data.id).read();

  if (res.statusCode === 404) {
    throw new NotFoundError(`Did not find any group at id "${data.id}" `);
  }

  const res2 = (await updateTableDataEdge({
    tableFrom: {
      rows: data.authGroups as any,
      tableName: AUTH_GROUPS,
      partitionKeyProp: 'name',
    },
    edge: 'groups-dashboards',
    edgeType: 'oneToMany',
    tableTo: {
      tableName: DASHBOARDS,
      rows: data.authGroups.map((group) => {
        return { ...group, id: data.id, name: res.resource.name };
      }) as any,
    },
  })) as any;

  return {
    authGroups: res2.map((el) => el.to) as DashboardAuthGroups[],
    id: data.id,
    name: res.resource.name,
  };
};
