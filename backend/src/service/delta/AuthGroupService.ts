import { filterToQuery, generateUUIDv6, runQuery, updateSql } from '../../db-utils';
import { AuthGroupsReadReq } from '../../generated/api';
import {
  AuthGroupCreateReq,
  AuthGroupDashboardCreateReq,
  AuthGroupDashboardDeleteReq,
  AuthGroupDashboardDeleteRes,
  AuthGroupDeleteReq,
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
  AuthGroupTablesReadReq,
  AuthGroupTablesReadRes,
  CrudDocumentRef,
  UsernameAndIdRef,
  AuthUserGroupsReadReq,
  AuthUserGroupsReadRes,
} from '../../typescript/api';
import {
  ConflictEntityError,
  NotFoundError,
  BadRequestError,
} from '../../generated/api';


import {
  Container,
  PatchOperation,
} from '@azure/cosmos';
import {
  createTableDataEdge,
  readTableDataEdge,
  updateTableDataEdge,
} from './EdgeService';
import { ADMIN_GROUP_NAME, AUTH_GROUPS, AUTH_USERS, DASHBOARDS, GROUPS_DASHBOARDS, GROUPS_TABLES, GROUPS_USERS, TABLES } from '../../consts';

 const authUserGroupsRead = async (
  data: AuthUserGroupsReadReq,
): Promise<AuthUserGroupsReadRes> => {
  const filtersRefactor = {};

  for (const prop in data.filters) {
    if (prop === 'name') {
      filtersRefactor['table_from__name'] = {
        ...data.filters[prop],
      };
    }
  }

  const res = (await readTableDataEdge({
    edge: {
      direction: 'from',
      // edgeLabel: AUTH_GROUPS,
      tableName: GROUPS_USERS,
    },
    jointTableName: GROUPS_USERS,
    tableName: AUTH_USERS,
    rowId: data.id,
    filters: filtersRefactor,
    from: data.from,
    to: data.to,
  })) as any;

  if (res.count === 0) {
    throw new NotFoundError('No group auth found.');
  }
  return {
    count: res.count,
    authGroups: res.edges.map((edge) => {
      return { ...edge.to, id: edge.from.id, name: edge.from.name };
    }) as NameAndIdRef[],
  };
};


export const createAuthGroup = async (data: AuthGroupCreateReq) => {
  let id;
  if (!data.id) {
    id = generateUUIDv6();
  } else {
    id = data.id;
  }

  const res = await runQuery(
    `CREATE TABLE IF NOT EXISTS ${AUTH_GROUPS} (id STRING, name STRING, create_table BOOLEAN , read_table BOOLEAN , update_table BOOLEAN , delete_table BOOLEAN ) USING DELTA LOCATION '/data/pv/${AUTH_GROUPS}';`,
    
  );
  const res4 = await runQuery(
    `SELECT COUNT(*) FROM ${AUTH_GROUPS} WHERE name = '${data.name}'`,
    
  );
  if (+res4[0]['count(1)'] > 0) {
    throw new ConflictEntityError(`group name: ${data.name} already taken.`);
  }

  const res2 = await runQuery(
    `INSERT INTO ${AUTH_GROUPS} (id, name, create_table , read_table , update_table , delete_table ) VALUES ("${id}", "${data.name}", false, false, false, false)`,
    
  );

  const res3 = await runQuery(
    `SELECT * FROM ${AUTH_GROUPS} WHERE id = ${
      typeof id === 'string' ? `'${id}'` : id
    }`,
    
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

  const res = (await runQuery(
    `SELECT * FROM ${AUTH_GROUPS} WHERE id = ${
      typeof id === 'string' ? `'${id}'` : id
    }`,
    
  )) as AuthGroupRef[];

  if (res.length === 0) {
    throw new NotFoundError(`No Auth Group found at id: ${data.id}`);
  }

  return res[0];
};

export const deleteAuthGroup = async (data: AuthGroupDeleteReq) => {
  const deleteQuery = await runQuery(
    `DELETE FROM ${AUTH_GROUPS} WHERE id = '${data.id}'`,
    
  );
  const affectedRows = +deleteQuery[0]['num_affected_rows'];
  const deleteGroupUsersQuery = await runQuery(
    `DELETE FROM ${GROUPS_USERS} WHERE table_from__id = '${data.id}'`,
    
  );
  const deleteGroupDashQuery = await runQuery(
    `DELETE FROM ${GROUPS_DASHBOARDS} WHERE table_from__id = '${data.id}'`,
    
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

  const selectGroups = (await runQuery(
    `SELECT * FROM auth_groups
      ${whereClause};`,
  )) as AuthGroupRef[];

  const whereClause2 = filterToQuery({ filters: data.filters }, 'c');

  const countGroups = await runQuery(
    `SELECT COUNT(*) FROM auth_groups
      ${whereClause2};`,
    
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
      id: el['to']['table_to__id'],
      name: el['to']['table_to__name'],
      create: el['from']['table_from__create'] === 'true',
      delete: el['from']['table_from__delete'] === 'true',
      read: el['from']['table_from__read'] === 'true',
      update: el['from']['table_from__update'] === 'true',
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
  const filtersAdapted = {};

  for (const prop in data.filters) {
    if (prop === 'name') {
      filtersAdapted['table_to__name'] = data.filters[prop];
    }
    if (prop === 'id') {
      filtersAdapted['table_to__id'] = data.filters[prop];
    }
  }
  const res = (await readTableDataEdge({
    edge: {
      direction: 'to',
      tableName: DASHBOARDS,
    },
    jointTableName: GROUPS_DASHBOARDS,
    rowId: data.id,
    tableName: AUTH_GROUPS,
    filters: filtersAdapted,
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
  const sql = await runQuery(
    `DELETE FROM ${GROUPS_DASHBOARDS} WHERE table_from__id = '${
      data.id
    }' AND ${data.dashboardIds
      .map((dashboardId) => `table_to__id = '${dashboardId}'`)
      .join(' OR ')}`,
    
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
    edge: '',
    jointTableName: GROUPS_USERS,
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
      username: el['to']['table_to__username'],
      id: el['to']['table_to__id'],
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
  const filtersAdapted = {};

  for (const prop in data.filters) {
    if (prop === 'name') {
      filtersAdapted['table_to__name'] = data.filters[prop];
    }
    if (prop === 'id') {
      filtersAdapted['table_to__id'] = data.filters[prop];
    }
  }
  const res = (await readTableDataEdge({
    edge: {
      direction: 'to',
      tableName: TABLES,
    },
    rowId: data.id,
    jointTableName: GROUPS_TABLES,
    tableName: AUTH_GROUPS,
    filters: filtersAdapted,
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
  const filtersAdapted = {};

  for (const prop in data.filters) {
    if (prop === 'name') {
      filtersAdapted['table_to__username'] = data.filters[prop];
    }
    if (prop === 'id') {
      filtersAdapted['table_to__id'] = data.filters[prop];
    }
  }
  const res = (await readTableDataEdge({
    edge: {
      direction: 'to',
      tableName: AUTH_USERS,
    },
    jointTableName: GROUPS_USERS,
    rowId: data.id,
    tableName: AUTH_GROUPS,
    filters: filtersAdapted,
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
  const sql = await runQuery(
    `DELETE FROM ${GROUPS_USERS} WHERE ${data.authUsers
      .map((user) => `table_to__id = '${user.id}'`)
      .join(' AND ')} AND table_from__id = '${data.id}'`,
  );

  return '';
};

export const createAuthGroupTables = async (
  data: AuthGroupTablesCreateReq,
): Promise<AuthGroupTablesCreateRes> => {
  const res = await createTableDataEdge({
    edge: GROUPS_TABLES,
    edgeType: 'oneToMany',
    jointTableName: GROUPS_TABLES,
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
        id: el['to']['table_to__id'] as string,
        name: el['to']['table_to__name'] as string,
      };
    }),
  };
};

export const deleteAuthGroupTables = async (
  data: AuthGroupTablesDeleteReq,
): Promise<AuthGroupTablesDeleteRes> => {
  const sql = await runQuery(
    `DELETE FROM ${GROUPS_TABLES} WHERE table_from__id = '${data.id}'`,
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


export const checkTableMetadataPermissions = async (
  userId: string,
): Promise<CrudDocumentRef> => {
  const res = await authUserGroupsRead({ id: userId, filters: {} });

  let create = false;
  let read = false;
  let update = false;
  let del = false;

  if (res['authGroups'].some((group) => group['name'] === ADMIN_GROUP_NAME)) {
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
