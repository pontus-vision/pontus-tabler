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
  DashboardsReadReq,
  DashboardReadReq,
  DashboardReadRes
} from '../../typescript/api';
import { createSql, filterToQuery, generateUUIDv6, isJSONParsable, runQuery, updateSql } from '../../db-utils';
import { NotFoundError } from '../../generated/api';
import {
  createTableDataEdge,
  deleteTableDataEdge,
  readTableDataEdge,
} from './EdgeService';

import * as db from './../../../delta-table/node/index-jdbc';
import { AUTH_GROUPS, DASHBOARDS, GROUPS_DASHBOARDS } from '../../consts';


export const createDashboard = async (
  data: DashboardCreateReq,
): Promise<DashboardCreateRes> => {

  console.log({ data })
  const sql = (await createSql(
    DASHBOARDS,
    'name STRING, owner STRING, state STRING, folder STRING',
    {
      ...data,
      state: JSON.stringify(data.state),
    },
  )) as any;

  await runQuery(
    `CREATE OR REPLACE TEMP VIEW source_table AS
     SELECT '${data?.id ? data.id : generateUUIDv6()}' AS id, 
     ${data.name} AS name,
     ${data.owner} AS owner, 
     ${data.state} AS state, 
     ${data.folder} AS folder`
  )


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

export const readDashboardById = async (dashboardId: string, userId: string) => {
  if (userId) {
    const isAdminCheck = await runQuery(`
SELECT EXISTS (
    SELECT 1
    FROM groups_users
    WHERE table_to__id = '${userId}' and table_from__name = 'Admin'
) AS record_exists;
`)
    console.log({ RECORD_EXISTS: typeof isAdminCheck[0]['record_exists'], isAdminCheck: isAdminCheck[0] })
    if (isAdminCheck[0]['record_exists'] === false) {
      return readDashboardById2(dashboardId, userId)

    }
  }
  const sql = await runQuery(
    `SELECT * FROM ${DASHBOARDS} WHERE id = '${dashboardId}'`,
  );

  console.log({ sqlQuery: `SELECT * FROM ${DASHBOARDS} WHERE id = '${dashboardId}'` })
  if (sql.length === 0) {
    throw new NotFoundError('Dashboard not found at id ' + dashboardId);
  }

  return { ...sql[0], state: JSON.parse(sql[0]['state']) };
};

const readDashboardById2 = async (
  dashboardId: string,
  userId: string
): Promise<DashboardReadRes> => {
  const selectQuery = `SELECT A.* FROM dashboards A JOIN groups_dashboards B ON A.id = B.table_to__id JOIN groups_users GU ON B.table_from__id = GU.table_from__id WHERE GU.table_to__id = '${userId}' AND B.table_from__read = TRUE `

  const query1 = `${selectQuery}`

  console.log({ query1 })
  const sql = await runQuery(
    query1,
  );
  if (sql.length === 0) {
    throw new NotFoundError('Dashboard not found at id ' + dashboardId);
  }

  return {
    id: sql[0]?.id,
    name: sql[0]?.name,
    owner: sql[0]?.owner,
    folder: sql[0]?.folder,
    state: JSON.parse(sql[0]['state'])
  };
};
export const deleteDashboard = async (data: DashboardDeleteReq) => {
  const sql = await runQuery(
    `DELETE FROM ${DASHBOARDS} WHERE id = '${data.id}'`,
  );

  const affectedRows = +sql[0]['num_affected_rows'];

  if (affectedRows === 0) {
    throw new NotFoundError(`No dashboard found at id: ${data.id}`);
  }

  return 'Dashboard deleted!';
};

export const readDashboards = async (
  body: DashboardsReadReq,
  userId?: string
): Promise<DashboardsReadRes> => {

  console.log('READ DASHBOARDS', { body, userId })

  if (userId) {
    const isAdminCheck = await runQuery(`
SELECT EXISTS (
    SELECT 1
    FROM groups_users
    WHERE table_to__id = '${userId}' and table_from__name = 'Admin'
) AS record_exists;
`)
    console.log({ RECORD_EXISTS: typeof isAdminCheck[0]['record_exists'], isAdminCheck: isAdminCheck[0] })
    if (isAdminCheck[0]['record_exists'] === false) {
      return readDashboards2(body, userId)

    }
  }

  const whereClause = filterToQuery(body, "");
  const whereClause2 = filterToQuery({ filters: body.filters }, "");
  const sql = await runQuery(
    `SELECT * FROM ${DASHBOARDS} ${whereClause}`,
  );
  const sqlCount = await runQuery(
    `SELECT COUNT(*) FROM ${DASHBOARDS} ${whereClause2}`,
  );
  const count = +sqlCount[0]['count(1)'];
  console.log({ sql, sqlCount, sqlQuery: `SELECT * FROM ${DASHBOARDS} ${whereClause}`, sqlCountQuery: `SELECT COUNT(*) FROM ${DASHBOARDS} ${whereClause2}` })
  if (count === 0) {
    throw new NotFoundError('No dashboards found');
  }
  console.log({ sql, sqlCount, sqlQuery: `SELECT * FROM ${DASHBOARDS} ${whereClause}`, sqlCountQuery: `SELECT COUNT(*) FROM ${DASHBOARDS} ${whereClause2}` })

  return {
    dashboards: sql.map((dash) => {
      console.log({ dash })
      return {
        ...dash,
        state: isJSONParsable(dash['state']) ? JSON.parse(dash['state']) : "",
      };
    }) as Dashboard[],
    totalDashboards: count,
  };
};

const readDashboards2 = async (
  body: DashboardsReadReq,
  userId: string
): Promise<DashboardsReadRes> => {
  const whereClause = filterToQuery(body, "A", undefined, true);
  const whereClause2 = filterToQuery({ filters: body.filters }, "A", undefined, true);
  console.log({ whereClause, whereClause2 })
  const selectQuery = `SELECT A.* FROM dashboards A JOIN groups_dashboards B ON A.id = B.table_to__id JOIN groups_users GU ON B.table_from__id = GU.table_from__id WHERE GU.table_to__id = '${userId}' AND B.table_from__read = TRUE ${Object.keys(body.filters).length > 0 ? `AND ${whereClause}` : whereClause}`
  const countQuery = `SELECT COUNT(*) AS total_count FROM dashboards A JOIN groups_dashboards B ON A.id = B.table_to__id JOIN groups_users GU ON B.table_from__id = GU.table_from__id WHERE  GU.table_to__id = '${userId}' AND B.table_from__read = TRUE ${whereClause2 ? `AND ${whereClause2}` : ''}`

  const query1 = `${selectQuery}`

  const query2 = `${countQuery}`

  const sql = await runQuery(
    query1,
  );
  const sqlCount = await runQuery(
    `${query2}`,
  );

  console.log({ query1, sql, query2, sqlCount })


  const count = +sqlCount[0]['count(1)'];
  if (count === 0) {
    throw new NotFoundError('No dashboards found');
  }

  return {
    dashboards: sql.map((dash) => {
      console.log({ dash })
      return {
        ...dash,
        state: isJSONParsable(dash['state']) ? JSON.parse(dash['state']) : "",
      };
    }) as Dashboard[],
    totalDashboards: count,
  };
};

export const createDashboardAuthGroup = async (
  data: DashboardGroupAuthCreateReq,
): Promise<DashboardGroupAuthCreateRes> => {
  const sql = await runQuery(
    `SELECT name FROM ${DASHBOARDS} WHERE id = '${data.id}'`,
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
        id: el['from']['table_from__id'],
        name: el['from']['table_from__name'],

        create: el['to']['table_to__create'] === 'true',
        read: el['to']['table_to__read'] === 'true',
        update: el['to']['table_to__update'] === 'true',
        delete: el['to']['table_to__delete'] === 'true',
      };
    }) as DashboardAuthGroups[],
    id: data.id,
    name: res[0]['to']['table_to__name'],
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
      tableName: AUTH_GROUPS,
    },
    jointTableName: GROUPS_DASHBOARDS,
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
