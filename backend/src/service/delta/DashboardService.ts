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
  Dashboard,
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
import * as db from './../../../delta-table/node/index-jdbc';
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
  const state = data?.state || {};
  const sql = await updateSql(
    DASHBOARDS,
    { ...data, state: JSON.stringify(state) },
    `WHERE id = '${data.id}'`,
  );

  return {
    id: sql[0]['id'],
    name: sql[0]['name'],
    folder: sql[0]?.['folder'],
    state: JSON.parse(sql[0]?.['state']),
    owner: sql[0]?.['owner'],
  };
};

export const readDashboardById = async (dashboardId: string) => {
  const sql = await db.executeQuery(
    `SELECT * FROM ${DASHBOARDS} WHERE id = '${dashboardId}'`,
    conn,
  );

  if (sql.length === 0) {
    throw new NotFoundError('Dashboard not found at id ' + dashboardId);
  }

  return { ...sql[0], state: JSON.parse(sql[0]['state']) };
};

export const deleteDashboard = async (data: DashboardDeleteReq) => {
  const sql = await db.executeQuery(
    `DELETE FROM ${DASHBOARDS} WHERE id = '${data.id}'`,
    conn,
  );

  const affectedRows = +sql[0]['num_affected_rows'];

  if (affectedRows === 0) {
    throw new NotFoundError(`No dashboard found at id: ${data.id}`);
  }

  return 'Dashboard deleted!';
};

export const readDashboards = async (
  body: ReadPaginationFilter,
): Promise<DashboardsReadRes> => {
  const whereClause = filterToQuery(body);
  const whereClause2 = filterToQuery({ filters: body.filters });
  const sql = await db.executeQuery(
    `SELECT * FROM ${DASHBOARDS} ${whereClause}`,
    conn,
  );
  const sqlCount = await db.executeQuery(
    `SELECT COUNT(*) FROM ${DASHBOARDS} ${whereClause2}`,
    conn,
  );
  const count = +sqlCount[0]['count(1)'];
  if (count === 0) {
    throw new NotFoundError('No dashboards found');
  }

  return {
    dashboards: sql.map((dash) => {
      return {
        ...dash,
        state: JSON.parse(dash['state']),
      };
    }) as Dashboard[],
    totalDashboards: count,
  };
};

export const createDashboardAuthGroup = async (
  data: DashboardGroupAuthCreateReq,
): Promise<DashboardGroupAuthCreateRes> => {
  const sql = await db.executeQuery(
    `SELECT name FROM ${DASHBOARDS} WHERE id = '${data.id}'`,
    conn,
  );

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
          name: sql[0]['name'],
          create: group.create,
          read: group.read,
          update: group.update,
          delete: group.delete,
        };
      }),
    },
  })) as any;

  return {
    authGroups: res.map((el) => {
      return {
        id: el['table_from__id'],
        name: el['table_from__name'],

        create: el['table_to__create'],
        read: el['table_to__read'],
        update: el['table_to__update'],
        delete: el['table_to__delete'],
      };
    }) as DashboardAuthGroups[],
    id: data.id,
    name: res[0]['table_to__name'],
  };
};

export const readDashboardGroupAuth = async (
  data: DashboardGroupAuthReadReq,
): Promise<DashboardGroupAuthReadRes> => {
  const filtersAdapted = {};

  for (const prop in data.filters) {
    if (prop === 'name') {
      filtersAdapted['table_from__name'] = data.filters[prop];
    }
    if (prop === 'id') {
      filtersAdapted['table_from__id'] = data.filters[prop];
    }
  }

  const res = (await readTableDataEdge({
    edge: {
      direction: 'from',
      edgeLabel: GROUPS_DASHBOARDS,
      tableName: AUTH_GROUPS,
    },
    rowId: data.id,
    tableName: DASHBOARDS,
    filters: filtersAdapted,
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
        ['table_to__read']: group.read,
        ['table_to__create']: group.create,
        ['table_to__update']: group.update,
        ['table_to__delete']: group.delete,
        ['table_from__id']: group.id,
        ['table_from__name']: group.id,
      };
    }),
    `WHERE table_to__id = '${data.id}'`,
  );

  return {
    authGroups: sql.map((el) => {
      return {
        id: el['table_from__id'],
        name: el['table_from__name'],

        create: el['table_to__create'] === 'true',
        read: el['table_to__read'] === 'true',
        update: el['table_to__update'] === 'true',
        delete: el['table_to__delete'] === 'true',
      };
    }) as DashboardAuthGroups[],
    id: data.id,
    name: '',
  };
};
