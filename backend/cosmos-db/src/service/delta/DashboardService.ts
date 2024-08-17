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
import { fetchContainer, fetchData, filterToQuery } from '../../cosmos-utils';
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
import {
  AUTH_GROUPS,
  createSql,
  initiateAuthGroupContainer,
  updateSql,
} from './AuthGroupService';
import { AUTH_USERS } from './AuthUserService';
declare function getContext(): any;
import * as db from '../../../../delta-table/node/index-jdbc';
import { GROUPS_DASHBOARDS } from '../EdgeService';

const conn: db.Connection = db.createConnection();
export const DASHBOARDS_GROUPS = 'dashboards_groups';
export const DASHBOARDS = 'dashboards';

export const createDashboard = async (
  data: DashboardCreateReq,
): Promise<DashboardCreateRes> => {
  delete data.menuItem;
  const sql = (await createSql(
    DASHBOARDS,
    'name STRING, owner STRING, state STRING, folder STRING',
    {
      ...data,
      state: JSON.stringify(data.state),
    },
  )) as any;

  // const dashboardContainer = await fetchContainer(DASHBOARDS);
  // const menuContainer = await initiateMenuContainer();

  // const res = await dashboardContainer.items.create({
  //   ...data,
  //   authGroups: [],
  // });

  // if (data?.menuItem) {
  //   const menuItem = data.menuItem;
  //   const child = menuItem.children[0];

  //   const path = `${menuItem?.path}${menuItem?.path?.endsWith('/') ? '' : '/'}${
  //     child.name
  //   }`;

  //   const res = await menuContainer.items.create({
  //     ...child,
  //     path: path,
  //     id: menuItem.id,
  //   });

  //   try {
  //     const res2 = await menuContainer
  //       .item(menuItem.id, menuItem.path)
  //       .patch([{ op: 'add', path: `/children/-`, value: res.resource }]);
  //   } catch (error) {
  //     if (error?.code === 404) {
  //       throw new NotFoundError(
  //         `Parent folder at path '${menuItem.path}, at id '${menuItem.id} not found.'`,
  //       );
  //     }
  //   }
  // }
  // const { _rid, _self, _etag, _attachments, _ts, ...rest } =
  //   res.resource as any;

  return {
    ...sql[0],
    state: typeof sql[0]?.state === 'object' ? JSON.parse(sql[0]?.state) : {},
    menuItem: sql[0]?.menuItem || null,
  };
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
    edge: GROUPS_DASHBOARDS,
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
  const res = (await readTableDataEdge({
    edge: {
      direction: 'from',
      edgeLabel: GROUPS_DASHBOARDS,
      tableName: AUTH_GROUPS,
    },
    rowId: data.id,
    tableName: DASHBOARDS,
    filters: data.filters,
    from: data.from,
    to: data.to,
  })) as Record<string, any>;

  if (res.count === 0) {
    throw new NotFoundError('No group auth found.');
  }

  return {
    authGroups: res.edges.map((el) => {
      return { ...el.from };
    }),
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
  const sql = await updateSql(
    GROUPS_DASHBOARDS,
    data.authGroups.map((group) => {
      return {
        ['table_from__read']: group.read,
        ['table_from__create']: group.create,
        ['table_from__update']: group.update,
        ['table_from__delete']: group.delete,
        id: group.id,
      };
    }),
    `WHERE table_to__id = ${data.id}`,
  );

  return {
    authGroups: [],
    id: data.id,
    name: '',
  };
};
