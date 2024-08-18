import { fetchContainer, fetchData, filterToQuery } from '../../cosmos-utils';
import { AuthGroupsReadReq, AuthUserIdAndUsername } from '../../generated/api';
import {
  AuthGroupCreateReq,
  AuthGroupCreateRes,
  AuthGroupDashboardCreateReq,
  AuthGroupDashboardDeleteReq,
  AuthGroupDashboardDeleteRes,
  AuthGroupDeleteReq,
  AuthGroupDeleteRes,
  AuthGroupReadReq,
  AuthGroupReadRes,
  AuthGroupRef,
  AuthGroupUpdateReq,
  AuthGroupUpdateRes,
  AuthGroupsReadRes,
  AuthGroupDashboardCreateRes,
  AuthGroupDashboardRef,
  AuthGroupDashboardsReadRes,
  AuthGroupDashboardUpdateReq,
  AuthGroupDashboardUpdateRes,
  AuthGroupDashboardsReadReq,
  DashboardAuthGroups,
  AuthGroupUsersReadReq,
  AuthGroupUsersReadRes,
  AuthGroupUsersUpdateReq,
  AuthGroupUsersUpdateRes,
  AuthGroupUsersDeleteReq,
  AuthGroupUsersDeleteRes,
  AuthGroupUsersCreateReq,
  AuthGroupUsersCreateRes,
  AuthGroupTablesCreateReq,
  AuthGroupTablesCreateRes,
  AuthGroupTablesDeleteReq,
  AuthGroupTablesDeleteRes,
  NameAndIdRef,
  ReadPaginationFilterFilters,
  ReadPaginationFilter,
  AuthGroupTablesReadReq,
  AuthGroupTablesReadRes,
  AuthGroupTableCreateReq,
  AuthGroupTableCreateRes,
  CrudDocumentRef,
  AuthGroupTableReadReq,
  AuthGroupTableReadRes,
  AuthGroupTableUpdateReq,
  AuthGroupTableUpdateRes,
  EdgeDirectionEnum,
  AuthGroupUsersRef,
  UsernameAndIdRef,
  TableDataEdgeRef,
  TableDataEdgeCreateRef,
  TableEdgeRef,
} from '../../typescript/api';
import {
  ConflictEntityError,
  NotFoundError,
  BadRequestError,
} from '../../generated/api';
import { v4 as uuidv4 } from 'uuid';

import * as db from '../../../../delta-table/node/index-jdbc';

import {
  Container,
  ItemResponse,
  PartitionKeyDefinition,
  PatchOperation,
  UniqueKeyPolicy,
} from '@azure/cosmos';
import { DASHBOARDS } from './DashboardService';
import {
  ADMIN_USER_USERNAME,
  AUTH_USERS,
  authUserGroupsRead,
  getRowCount,
} from './AuthUserService';
import { TABLES } from './TableService';
import {
  createConnection,
  createTableDataEdge,
  deleteTableDataEdge,
  readEdge,
  readTableDataEdge,
  updateConnection,
  updateTableDataEdge,
} from './EdgeService';
import { readTableData } from './TableDataService';
import { snakeCase } from 'lodash';
import { NODATA } from 'dns';
import { GROUPS_DASHBOARDS } from '../EdgeService';
import { GROUPS_TABLES, GROUPS_USERS } from '../AuthGroupService';
export const AUTH_GROUPS = 'auth_groups';
export const ADMIN_GROUP_NAME = 'Admin';
export const AUTH_GROUPS_USER_TABLE = 'auth_groups_users';
const conn: db.Connection = db.createConnection();

export const generateUUIDv6 = () => {
  const uuid = uuidv4().replace(/-/g, '');
  const timestamp = new Date().getTime();

  let timestampHex = timestamp.toString(16).padStart(12, '0');
  let uuidV6 = timestampHex + uuid.slice(12);

  return uuidV6;
};
const partitionKey: string | PartitionKeyDefinition = {
  paths: ['/name'],
};

const uniqueKeyPolicy: UniqueKeyPolicy = {
  uniqueKeys: [{ paths: ['/name'] }],
};

const initialDocs: AuthGroupCreateReq[] = [
  {
    name: ADMIN_GROUP_NAME,
  },
  {
    name: 'USER',
  },
];

export const authGroupContainerProps = {
  AUTH_GROUPS,
  partitionKey,
  uniqueKeyPolicy,
};

export const initiateAuthGroupContainer = async (): Promise<Container> => {
  const authGroupContainer = await fetchContainer(
    AUTH_GROUPS,
    partitionKey,
    uniqueKeyPolicy,
  );
  //  const userContainer = await fetchContainer(AUTH_USERS)

  //    const res2 = await userContainer.items
  //      .query({
  //        query: 'Select id, username from c WHERE c.username=@name',
  //        parameters: [{ name: '@name', value: ADMIN_USER }],
  //      })
  //      .fetchAll();

  //    const user = res2.resources[0];
  //    const res = await createTableDataEdge({
  //      edge: 'groups-users',
  //      edgeType: 'oneToMany',
  //      tableFrom: {
  //        tableName: AUTH_GROUPS,
  //        rows: [{ id: adminGroup.id, name: adminGroup.name }],
  //        partitionKeyProp: 'name',
  //      },
  //      tableTo: {
  //        tableName: AUTH_USERS,
  //        rows: [{ id: user.id, username: user.username }],
  //        partitionKeyProp: 'username',
  //      },
  //    });

  return authGroupContainer;
};

export const objEntriesToStr = (
  data: Record<string, any>,
): { keysStr: string; valuesStr: string } => {
  const keys = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    // keys.push(key);
    // values.push(value)

    const valType = typeof value;
    const keyType = typeof key;
    if (valType === 'boolean') {
      keys.push(`${snakeCase(key)} BOOLEAN`);
      values.push(value);
    } else if (valType === 'number') {
      keys.push(`${snakeCase(key)} INT`);
      values.push(value);
    } else {
      keys.push(`${snakeCase(key)} STRING`);
      values.push(`'${value}'`);
    }
  }

  const keysStr = keys.join(', ');
  const valuesStr = values.join(', ');
  return { keysStr, valuesStr };
};

export const convertToSqlFields = (data: any[]): string => {
  const fields = [];

  for (const value of data) {
    const valType = typeof value;
    if (valType === 'boolean') {
      fields.push(`${value} BOOLEAN`);
    } else if (valType === 'number') {
      fields.push(`${value} INT`);
    } else {
      fields.push(`${value} STRING`);
    }
  }

  return fields.join(', ');
};

export const createSql = async (
  table: string,
  fields: string,
  data: Record<string, any>,
): Promise<Record<string, any>[]> => {
  const uuid = generateUUIDv6();

  const entries = objEntriesToStr(data);

  const keys = entries.keysStr;
  const values = entries.valuesStr;
  // const resss = await db.executeQuery(
  //   `DROP TABLE  ${table} `,
  //   conn,
  // );

  const res = await db.executeQuery(
    `CREATE TABLE IF NOT EXISTS ${table} (${
      data?.id ? '' : 'id STRING, '
    } ${fields}) USING DELTA LOCATION '/data/pv/${table}';`,
    conn,
  );

  const insertFields = Array.isArray(data)
    ? Object.keys(data[0]).join(', ')
    : Object.keys(data).join(', ');

  const insertValues = [];
  if (Array.isArray(data)) {
    for (const el of data) {
      const entries = objEntriesToStr(el);
      insertValues.push(`${entries.valuesStr}`);
    }
  }

  const insert = `INSERT INTO ${table} (${
    data?.id ? '' : 'id, '
  } ${insertFields}) VALUES ('${uuid}', ${
    Array.isArray(data) ? insertValues.join(', ') : values
  })`;

  const res2 = await db.executeQuery(insert, conn);

  const res3 = await db.executeQuery(
    `SELECT * FROM delta.\`/data/pv/${table}\` WHERE id = ${
      typeof uuid === 'string' ? `'${uuid}'` : uuid
    }`,
    conn,
  );

  return res3.map((el) => {
    const obj = {};
    for (const prop in el) {
      if (el[prop] === 'true') {
        obj[prop] = true;
      } else if (el[prop] === 'false') {
        obj[prop] = false;
      } else {
        obj[prop] = el[prop];
      }
    }
    return obj;
  });
};
export const updateSql = async (
  table: string,
  data: Record<string, any>,
  whereClause: string,
): Promise<Record<string, any>[]> => {
  const insertValues = [];

  if (Array.isArray(data)) {
    for (const el of data) {
      for (const [key, value] of Object.entries(el)) {
        const val = typeof value === 'string' ? `'${value}'` : value;
        insertValues.push(`${key} = ${val}`);
      }
    }
  } else {
    for (const [key, value] of Object.entries(data)) {
      const val = typeof value === 'string' ? `'${value}'` : value;
      insertValues.push(`${key} = ${val}`);
    }
  }

  const insert = `UPDATE ${table} SET ${insertValues.join(
    ', ',
  )} ${whereClause}`;

  const res2 = await db.executeQuery(insert, conn);

  const res3 = await db.executeQuery(
    `SELECT * FROM delta.\`/data/pv/${table}\` ${whereClause}`,
    conn,
  );
  if (res3.length === 0) {
    throw new NotFoundError(
      `did not find any record at table '${table}' (${whereClause})`,
    );
  }

  return res3;
};
export const createAuthGroup = async (data: AuthGroupCreateReq) => {
  let id;
  if (!data.id) {
    id = generateUUIDv6();
  } else {
    id = data.id;
  }

  const res = await db.executeQuery(
    `CREATE TABLE IF NOT EXISTS ${AUTH_GROUPS} (id STRING, name STRING, create_table BOOLEAN , read_table BOOLEAN , update_table BOOLEAN , delete_table BOOLEAN ) USING DELTA LOCATION '/data/pv/${AUTH_GROUPS}';`,
    conn,
  );
  const res4 = await db.executeQuery(
    `SELECT COUNT(*) FROM ${AUTH_GROUPS} WHERE name = '${data.name}'`,
    conn,
  );
  if (+res4[0]['count(1)'] > 0) {
    throw new ConflictEntityError(`group name: ${data.name} already taken.`);
  }

  const res2 = await db.executeQuery(
    `INSERT INTO ${AUTH_GROUPS} (id, name, create_table , read_table , update_table , delete_table ) VALUES ("${id}", "${data.name}", false, false, false, false)`,
    conn,
  );

  const res3 = await db.executeQuery(
    `SELECT * FROM ${AUTH_GROUPS} WHERE id = ${
      typeof id === 'string' ? `'${id}'` : id
    }`,
    conn,
  );

  return {
    name: res3[0]['name'],
    id,
    tableMetadata: {
      create: res3[0]['create_table'],
      read: res3[0]['read_table'],
      update: res3[0]['update_table'],
      delete: res3[0]['delete_table'],
    },
  };
};

export const updateAuthGroup = async (
  data: AuthGroupUpdateReq,
): Promise<AuthGroupUpdateRes> => {
  const sql = (await updateSql(
    AUTH_GROUPS,
    { name: data.name },
    `WHERE id = '${data.id}'`,
  )) as AuthGroupUpdateRes[];
  const affectedRows = +sql[0]['num_affected_rows'];
  if (affectedRows === 0) {
    throw new NotFoundError(`No Auth Group found at id: ${data.id}`);
  }
  try {
    const sql2 = await updateSql(
      GROUPS_DASHBOARDS,
      { ['table_from__name']: data.name },
      `WHERE table_from__id = '${data.id}'`,
    );

    const sql3 = await updateSql(
      GROUPS_USERS,
      { ['table_from__name']: data.name },
      `WHERE table_from__id = '${data.id}'`,
    );
  } catch (error) {}

  return sql[0];
};

export const readAuthGroup = async (
  data: AuthGroupReadReq,
): Promise<AuthGroupReadRes> => {
  const id = data.id;

  const res = (await db.executeQuery(
    `SELECT * FROM ${AUTH_GROUPS} WHERE id = ${
      typeof id === 'string' ? `'${id}'` : id
    }`,
    conn,
  )) as AuthGroupRef[];

  if (res.length === 0) {
    throw new NotFoundError(`No Auth Group found at id: ${data.id}`);
  }

  return res[0];
};

export const deleteAuthGroup = async (data: AuthGroupDeleteReq) => {
  const deleteQuery = await db.executeQuery(
    `DELETE FROM ${AUTH_GROUPS} WHERE id = '${data.id}'`,
    conn,
  );
  const affectedRows = +deleteQuery[0]['num_affected_rows'];
  const deleteGroupUsersQuery = await db.executeQuery(
    `DELETE FROM ${GROUPS_USERS} WHERE table_from__id = '${data.id}'`,
    conn,
  );
  const deleteGroupDashQuery = await db.executeQuery(
    `DELETE FROM ${GROUPS_DASHBOARDS} WHERE table_from__id = '${data.id}'`,
    conn,
  );

  if (affectedRows === 1) {
    return `AuthGroup deleted.`;
  } else if (!affectedRows) {
    throw new NotFoundError(`No group found at ${data.id}`);
  }
};

export const readAuthGroups = async (
  data: AuthGroupsReadReq,
): Promise<AuthGroupsReadRes> => {
  const whereClause = filterToQuery(data, 'c');

  const clauses = [];
  for (const prop in data.filters) {
    for (const prop2 in data.filters[prop]) {
      if (data.filters[prop][prop2]) {
        clauses.push(`\`${prop}\` LIKE '%${data.filters[prop][prop2]}%'`);
      }
    }
  }

  const selectGroups = (await db.executeQuery(
    `SELECT * FROM auth_groups
      ${whereClause};`,
    conn,
  )) as AuthGroupRef[];

  const whereClause2 = filterToQuery({ filters: data.filters }, 'c');

  const countGroups = await db.executeQuery(
    `SELECT COUNT(*) FROM auth_groups
      ${whereClause2};`,
    conn,
  );
  const groupCount = +countGroups[0]['count(1)'];
  if (groupCount === 0) {
    throw new NotFoundError(`No group found.`);
  }

  return {
    authGroups: selectGroups,
    totalGroups: +countGroups[0]['count(1)'],
  };
};

export const createAuthGroupDashboards = async (
  data: AuthGroupDashboardCreateReq,
): Promise<AuthGroupDashboardCreateRes> => {
  const res = (await createTableDataEdge({
    tableFrom: {
      tableName: AUTH_GROUPS,

      rows: data.dashboards.map((dashboard) => {
        return {
          id: data.id,
          name: data.name,
          create: dashboard.create,
          read: dashboard.read,
          update: dashboard.update,
          delete: dashboard.delete,
        };
      }),
      partitionKeyProp: 'name',
    },
    edge: 'groups_dashboards',
    edgeType: 'oneToMany',
    tableTo: {
      rows: data.dashboards.map((dashboard) => {
        return {
          id: dashboard.id,
          name: dashboard.name,
          create: false,
          read: false,
          update: false,
          delete: false,
        };
      }) as Record<string, any>[],
      tableName: DASHBOARDS,
    },
  })) as any;

  // const res = await createSubdoc({
  //   id: data.id,
  //   docs: { docs1: data.dashboards },
  //   container1: {
  //     container: authGroupContainer,
  //     name: 'authGroups',
  //   },
  //   container2: { container: dashboardContainer, name: 'dashboards' },
  //   partitionKey: data.name,
  // });

  const dashboards: AuthGroupDashboardRef[] = res.map((el) => {
    return {
      create: el['table_from__create'],
      delete: el['table_from__delete'],
      id: el['table_to__id'],
      name: el['table_to__name'],
      read: el['table_from__read'],
      update: el['table_from__update'],
    };
  });

  return {
    id: data.id,
    name: data.name,
    dashboards,
  };
};

export const readAuthGroupDashboards = async (
  data: AuthGroupDashboardsReadReq,
): Promise<AuthGroupDashboardsReadRes> => {
  const res = (await readTableDataEdge({
    edge: {
      direction: 'to',
      edgeLabel: GROUPS_DASHBOARDS,
      tableName: DASHBOARDS,
    },
    rowId: data.id,
    tableName: AUTH_GROUPS,
    filters: data.filters,
    from: data.from,
    to: data.to,
  })) as any;

  if (res.count === 0) {
    throw new NotFoundError('No group auth found.');
  }

  return {
    count: res.count,
    dashboards: res.edges.map((el) => {
      return { ...el.from, name: el.to['name'], id: el.to['id'] };
    }) as AuthGroupDashboardRef[],
  };
};

export const updateAuthGroupDashboards = async (
  data: AuthGroupDashboardUpdateReq,
): Promise<AuthGroupDashboardUpdateRes> => {
  const sql = await updateSql(
    GROUPS_DASHBOARDS,
    data.dashboards.map((dash) => {
      return {
        table_from__create: dash.create,
        table_from__read: dash.read,
        table_from__update: dash.update,
        table_from__delete: dash.delete,
        table_to__id: dash.id,
        table_to__name: dash.name,
      };
    }),
    `WHERE table_from__id = '${data.id}'`,
  );

  const dashboards: AuthGroupDashboardRef[] = sql.map((el) => {
    return {
      name: el['table_to__name'],
      id: el['table_to__id'],
      create: el['table_from__create'] === 'true' ? true : false,
      read: el['table_from__read'] === 'true' ? true : false,
      update: el['table_from__update'] === 'true' ? true : false,
      delete: el['table_from__delete'] === 'true' ? true : false,
    };
  });

  return {
    dashboards,
    id: data.id,
    name: data.name,
  };
};

export const deleteAuthGroupDashboards = async (
  data: AuthGroupDashboardDeleteReq,
): Promise<AuthGroupDashboardDeleteRes> => {
  if (data.dashboardIds.length === 0) {
    throw new BadRequestError('No dashboardId mentioned.');
  }
  const sql = await db.executeQuery(
    `DELETE FROM ${GROUPS_DASHBOARDS} WHERE table_from__id = ${
      data.id
    } AND ${data.dashboardIds
      .map((dashboardId) => `table_to__id = ${dashboardId}`)
      .join(' OR ')}`,
    conn,
  );
  

  if (+sql[0]['num_affected_rows'] === 0) {
    throw new NotFoundError('Could not found a group at id ' + data.id);
  }

  return '';
};

export const createAuthUserGroup = async (
  data: AuthGroupUsersCreateReq,
): Promise<AuthGroupUsersCreateRes> => {
  const { authUsers, id, name } = data;

  const res = (await createTableDataEdge({
    tableFrom: {
      tableName: AUTH_GROUPS,

      rows: data.authUsers.map(() => {
        return {
          id: data.id,
          name: data.name,
        };
      }),
      partitionKeyProp: 'name',
    },
    edge: GROUPS_USERS,
    edgeType: 'oneToMany',
    tableTo: {
      rows: data.authUsers.map((user) => {
        return {
          id: user.id,
          username: user.username,
        };
      }) as Record<string, any>[],
      tableName: AUTH_USERS,
    },
  })) as any;

  const authUsersRes = res.map((el) => {
    return {
      username: el['table_to__username'],
      id: el['table_to__id'],
    };
  });

  return {
    id: data.id,
    name: data.name,
    authUsers: authUsersRes,
    // authUsers: res.map((el) => el.to) as UsernameAndIdRef[],
  };
};

export const readAuthGroupTables = async (
  data: AuthGroupTablesReadReq,
): Promise<AuthGroupTablesReadRes> => {
  const res = (await readTableDataEdge({
    edge: {
      direction: 'to',
      edgeLabel: GROUPS_TABLES,
      tableName: TABLES,
    },
    rowId: data.id,
    tableName: AUTH_GROUPS,
    filters: data.filters,
    from: data.from,
    to: data.to,
  })) as any;

  if (res.count === 0) {
    throw new NotFoundError(
      `No table was found in the group edge object at id "${data.id}" and name "${data.name}"`,
    );
  }

  const tables = res.edges.map((edge) => {
    return { ...edge.from, name: edge['to']['name'], id: edge['to']['id'] };
  }) as NameAndIdRef[];

  return {
    tables,
    count: res.count,
  };
};

export const readAuthGroupUsers = async (
  data: AuthGroupUsersReadReq,
): Promise<AuthGroupUsersReadRes> => {
  const res = (await readTableDataEdge({
    edge: {
      direction: 'to',
      edgeLabel: GROUPS_USERS,
      tableName: AUTH_USERS,
    },
    rowId: data.id,
    tableName: AUTH_GROUPS,
    filters: data.filters,
    from: data.from,
    to: data.to,
  })) as { count: number; edges: any[] };

  if (res.count === 0) {
    throw new NotFoundError('No group auth found.');
  }
  const authUsers = res.edges.map((edge) => {
    const username = edge['to']['name'];
    delete edge['to']['name'];
    delete edge['to']['tableName'];
    return { ...edge['to'], username };
  });
  return {
    count: res.count,
    authUsers,
  };
};

export const updateAuthGroupUsers = async (
  data: AuthGroupUsersUpdateReq,
): Promise<AuthGroupUsersUpdateRes> => {
  const res = (await updateTableDataEdge({
    tableFrom: {
      rows: [{ id: data.id, name: data.name }],
      tableName: AUTH_GROUPS,
      partitionKeyProp: 'name',
    },
    edge: 'groups-users',
    edgeType: 'oneToMany',
    tableTo: {
      tableName: AUTH_USERS,
      rows: data.authUsers as any,
      partitionKeyProp: 'username',
    },
  })) as any;

  return {
    id: data.id,
    name: data.name,
    authUsers: res.map as UsernameAndIdRef[],
  };
};

export const deleteAuthGroupUsers = async (
  data: AuthGroupUsersDeleteReq,
): Promise<AuthGroupUsersDeleteRes> => {
  const sql = await db.executeQuery(
    `DELETE FROM ${GROUPS_USERS} WHERE ${data.authUsers
      .map((user) => `table_to__id = '${user.id}'`)
      .join(' AND ')} AND table_from__id = '${data.id}'`,
    conn,
  );

  return '';
};

export const createAuthGroupTables = async (
  data: AuthGroupTablesCreateReq,
): Promise<AuthGroupTablesCreateRes> => {
  const res = await createTableDataEdge({
    edge: GROUPS_TABLES,
    edgeType: 'oneToMany',
    tableFrom: {
      rows: [{ id: data.id, name: data.name }],
      tableName: AUTH_GROUPS,
      partitionKeyProp: 'name',
    },
    tableTo: {
      rows: data.tables as any,
      tableName: TABLES,
      partitionKeyProp: 'name',
    },
  });

  return {
    name: data.name,
    id: data.id,
    tables: res.map((el) => {
      return {
        id: el['table_to__id'],
        name: el['table_to__name'],
      };
    }),
  };
};

export const deleteAuthGroupTables = async (
  data: AuthGroupTablesDeleteReq,
): Promise<AuthGroupTablesDeleteRes> => {
  const sql = await db.executeQuery(
    `DELETE FROM ${GROUPS_TABLES} WHERE table_from__id = '${data.id}'`,
    conn,
  );

  if (+sql[0]['num_affected_rows'] === 0) {
    throw new NotFoundError('Could not found a group at id ' + data.id);
  }

  return '';
};

export const deleteSubdoc = async (data: {
  id: string;
  subDocs: { id: string; name?: string }[];
  container1: { container: Container; name: string };
  container2: {
    container: Container;
    name: string;
    partitionKeyDocProp?: string;
  };
  partitionKey?: string;
}): Promise<string> => {
  if (data?.subDocs?.length === 0) {
    throw new BadRequestError(`${data.container1.name} Ids array empty`);
  }

  const container1 = data.container1;
  const container2 = data.container2;

  const docId = data.id;

  const res = await data.container1.container
    .item(docId, data.partitionKey || docId)
    .read();

  for (const [index, subId] of data.subDocs.entries()) {
    const res3 = await container2.container
      .item(subId.id, subId?.[container2.partitionKeyDocProp] || subId.id)
      .read();

    if (res3.statusCode === 404) {
      throw new NotFoundError(`${container2.name} not found at id: ${subId}`);
    }

    const indexUpdate = res3.resource[container1.name].findIndex(
      (el2) => el2.id === docId,
    );

    const res2 = await container2.container
      .item(subId.id, subId?.[container2.partitionKeyDocProp] || subId.id)
      .patch([
        {
          op: 'remove',
          path: `/${container1.name}/${indexUpdate}`,
        },
      ]);
  }

  const batchPatchArr: PatchOperation[][] = [];

  while (data.subDocs.length > 0) {
    batchPatchArr.push(
      data.subDocs.splice(0, 10).map((subDoc) => {
        const index = res.resource[container2.name].findIndex(
          (i) => i.id === subDoc.id,
        );

        return {
          op: 'remove',
          path: `/${container2.name}/${index}`,
        };
      }),
    );
  }

  for (const [index, batch] of batchPatchArr.entries()) {
    try {
      const res2 = await container1.container
        .item(docId, data?.partitionKey || docId)
        .patch(batch);

      if (index === batchPatchArr.length - 1) {
        const resource = res2.resource;

        return `${container1.name} references deleted.`;
      }
    } catch (error) {
      if (error?.code === 400) {
        throw new BadRequestError(error);
      }
      if (error?.code === 404) {
        throw new NotFoundError(error);
      }
    }
  }
};

export const readAuthGroupTable = async (
  data: AuthGroupTableReadReq,
): Promise<AuthGroupTableReadRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();

  const res = (await authGroupContainer
    .item(data.id, data.name)
    .read()) as ItemResponse<AuthGroupRef>;

  if (res?.statusCode === 404) {
    throw new NotFoundError(
      `Group not found at id "${data.name}" and name: ${data.name}`,
    );
  }

  const table = res.resource.tableMetadata;

  const permissions: CrudDocumentRef = {
    create: table.create,
    read: table.read,
    update: table.update,
    delete: table.delete,
  };

  return {
    id: data.id,
    name: data.name,
    table: permissions,
  };
};

export const updateAuthGroupTable = async (
  data: AuthGroupTableUpdateReq,
): Promise<AuthGroupTableUpdateRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();

  const patchArr: PatchOperation[] = [];

  for (const perm in data.table) {
    const value = data.table[perm];

    switch (perm) {
      case 'create':
        patchArr.push({ op: 'set', path: `/tableMetadata/create`, value });
        break;
      case 'read':
        patchArr.push({ op: 'set', path: `/tableMetadata/read`, value });
        break;
      case 'update':
        patchArr.push({ op: 'set', path: `/tableMetadata/update`, value });
        break;
      case 'delete':
        patchArr.push({ op: 'set', path: `/tableMetadata/delete`, value });
        break;
    }
  }

  try {
    const res = (await authGroupContainer
      .item(data.id, data.name)
      .patch(patchArr)) as ItemResponse<AuthGroupRef>;
    return {
      id: res.resource.id,
      name: res.resource.name,
      table: res.resource.tableMetadata,
    };
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError(
        `Group not found at id "${data.name}" and name: ${data.name}`,
      );
    }
  }
};
export const checkPermissions = async (
  userId: string,
  targetId: string,
  containerId: 'auth_users' | 'dashboards' | 'tables',
): Promise<CrudDocumentRef> => {
  const res = (await readEdge(
    {
      direction: 'from',
      edgeTable: GROUPS_USERS,
      tableToName: AUTH_USERS,
      tableFromName: AUTH_GROUPS,
      filters: {},
      rowId: userId,
    },
    conn,
  )) as AuthGroupRef[];

  if (res.length === 0) {
    throw new NotFoundError('There is no group associated with user');
  }

  let create = false;
  let read = false;
  let update = false;
  let del = false;

  for (const group of res) {
    if (group['table_from__name'] === ADMIN_GROUP_NAME) {
      return {
        create: true,
        read: true,
        update: true,
        delete: true,
      };
    }
    const res = await readEdge(
      {
        direction: 'to',
        edgeTable:
          containerId === DASHBOARDS
            ? GROUPS_DASHBOARDS
            : containerId === TABLES
            ? GROUPS_TABLES
            : containerId === AUTH_USERS
            ? GROUPS_TABLES
            : '',
        tableToName: AUTH_GROUPS,
        tableFromName: containerId,
        filters: {
          filters: {
            table_to__id: {
              filter: targetId,
              filterType: 'text',
              type: 'equals',
            },
          },
        },
        rowId: group['table_from__id'],
      },
      conn,
    ) as any[]

    if (containerId === DASHBOARDS) {
      for (const dashboard of res) {
        if (dashboard?.['table_from__create']) {
          create = dashboard?.['table_from__create'] === 'true';
        }
        if (dashboard?.['table_from__read']) {
          read = dashboard?.['table_from__read'] === 'true';
        }
        if (dashboard?.['table_from__update']) {
          update = dashboard?.['table_from__update']=== 'true';
        }
        if (dashboard?.['table_from__delete']) {
          del = dashboard?.['table_from__delete']=== 'true';
        }
      }
    }
  }
  return {
    create,
    read,
    update,
    delete: del,
  };
};

export const checkTableMetadataPermissions = async (
  userId: string,
): Promise<CrudDocumentRef> => {
  const res = await authUserGroupsRead({ id: userId, filters: {} });

  let create = false;
  let read = false;
  let update = false;
  let del = false;

  if (
    res['authGroups'].some(
      (group) => group['from']['name'] === ADMIN_GROUP_NAME,
    )
  ) {
    return {
      create: true,
      read: true,
      update: true,
      delete: true,
    };
  }
  for (const group of res['authGroups']) {
    const res2 = await readAuthGroup(group['from']['id']);

    if (res2.tableMetadata?.create) {
      create = res2.tableMetadata?.create;
    }
    if (res2.tableMetadata?.read) {
      read = res2.tableMetadata?.read;
    }
    if (res2.tableMetadata?.update) {
      update = res2.tableMetadata?.update;
    }
    if (res2.tableMetadata?.delete) {
      del = res2.tableMetadata?.delete;
    }
  }

  return {
    create,
    read,
    update,
    delete: del,
  };
};
