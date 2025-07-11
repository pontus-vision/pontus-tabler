import { generateUUIDv6, runQuery, updateSql } from '../../db-utils';
import { filterToQuery } from '../../utils';
import { AuthGroupsReadReq } from '../../generated/api/resources';
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
  AuthGroupCreateRes,
} from '../../typescript/api';
import {
  ConflictEntityError,
  NotFoundError,
  BadRequestError,
} from '../../generated/api/resources';



import {
  Container,
  PatchOperation,
} from '@azure/cosmos';
import {
  createTableDataEdge,
  readEdge,
  readTableDataEdge,
  updateTableDataEdge,
} from './EdgeService';
import { ADMIN_GROUP_NAME, AUTH_GROUPS, AUTH_USERS, DASHBOARDS, GROUPS_DASHBOARDS, GROUPS_TABLES, GROUPS_USERS, schema, schemaSql, TABLES } from '../../consts';
import { removeFalsyValues } from '../../utils';


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
}

// export const authUserGroupsUpdate = async (
//     data: AuthUserGroupsUpdateReq,
//   ): Promise<AuthUserGroupsUpdateRes> => {
//     const usersContainer = await fetchContainer(AUTH_USERS);

//     const res2 = await usersContainer.item(data.id, data.id).read();

//     if (res2.statusCode === 404) {
//       throw new NotFoundError(`Did not find any group at id "${data.id}"`);
//     }
//     const username = res2.resource.username;

//     const res = (await updateTableDataEdge({
//       tableFrom: {
//         rows: data.authGroups as any,
//         tableName: AUTH_GROUPS,
//         partitionKeyProp: 'name',
//       },
//       edge: 'groups-users',
//       edgeType: 'oneToMany',
//       tableTo: {
//         tableName: AUTH_USERS,
//         rows: [{ username, id: data.id }] as any,
//         partitionKeyProp: 'username',
//       },
//     })) as any;

//     return {
//       authGroups: res.map((el) => el.to) as AuthGroupDashboardRef[],
//       id: data.id,
//       username,
//     };
//   };


export const createAuthGroup = async (data: AuthGroupCreateReq): Promise<AuthGroupCreateRes> => {
  const id = data.id || generateUUIDv6();
  const tableMetadata = data.tableMetadataCrud;

  // Create table if not exists — still safe to inline (DDL)
  await runQuery(
    `CREATE TABLE IF NOT EXISTS ${schemaSql}${AUTH_GROUPS} (
      id STRING,
      name STRING,
      create_table BOOLEAN,
      read_table BOOLEAN,
      update_table BOOLEAN,
      delete_table BOOLEAN,
      create_dashboard BOOLEAN,
      read_dashboard BOOLEAN,
      update_dashboard BOOLEAN,
      delete_dashboard BOOLEAN
    ) USING DELTA LOCATION '/data/${schema}/${AUTH_GROUPS}';`
  );

  // Check if group name already exists
  const checkNameQuery = `SELECT COUNT(*) FROM ${schemaSql}${AUTH_GROUPS} WHERE name = ?`;
  const checkNameParams = [data.name];
  const existing = await runQuery(checkNameQuery, checkNameParams);

  if (+existing[0]['count(1)'] > 0) {
    throw new ConflictEntityError(`group name: ${data.name} already taken.`);
  }

  // Insert new group
  const insertQuery = `
    INSERT INTO ${schemaSql}${AUTH_GROUPS} (
      id, name,
      create_table, read_table, update_table, delete_table,
      create_dashboard, read_dashboard, update_dashboard, delete_dashboard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const insertParams = [
    id,
    data.name,
    !!tableMetadata?.create,
    !!tableMetadata?.read,
    !!tableMetadata?.update,
    !!tableMetadata?.delete,
    !!tableMetadata?.create,
    !!tableMetadata?.read,
    !!tableMetadata?.update,
    !!tableMetadata?.delete,
  ];

  await runQuery(insertQuery, insertParams);

  // Fetch the newly created group
  const selectQuery = `SELECT * FROM ${schemaSql}${AUTH_GROUPS} WHERE id = ?`;
  const selectParams = [id];
  const result = await runQuery(selectQuery, selectParams);

  return {
    name: result?.[0]['name'],
    id,
    tableMetadataCrud: {
      create: result?.[0]['create_table'],
      read: result?.[0]['read_table'],
      update: result?.[0]['update_table'],
      delete: result?.[0]['delete_table'],
    },
    dashboardCrud: {
      create: result?.[0]['create_dashboard'],
      read: result?.[0]['read_dashboard'],
      update: result?.[0]['update_dashboard'],
      delete: result?.[0]['delete_dashboard'],
    }
  };
};

export const updateAuthGroup = async (
  data: AuthGroupUpdateReq,
): Promise<AuthGroupUpdateRes> => {
  const objWithoutFalsyValues = removeFalsyValues(data);

  const sql = (await updateSql(
    AUTH_GROUPS,
    {
      name: data.name,
      ...objWithoutFalsyValues,
    },
    `WHERE id = ?`,
    [data.id]
  )) as AuthGroupUpdateRes[];

  const affectedRows = +sql[0]['num_affected_rows'];

  if (affectedRows === 0) {
    throw new NotFoundError(`No Auth Group found at id: ${data.id}`);
  }

  try {
    await updateSql(
      GROUPS_DASHBOARDS,
      { ['table_from__name']: data.name },
      `WHERE table_from__id = ?`,
      [data.id]
    );

    await updateSql(
      GROUPS_USERS,
      { ['table_from__name']: data.name },
      `WHERE table_from__id = ?`,
      [data.id]
    );
  } catch (error) {

  }

  return sql[0];
};


export const readAuthGroup = async (
  data: AuthGroupReadReq,
): Promise<AuthGroupReadRes> => {
  const id = data.id;

  const res = (await runQuery(
    `SELECT * FROM ${schemaSql}${AUTH_GROUPS} WHERE id = ?`,
    [id]
  )) as AuthGroupRef[];

  if (res.length === 0) {
    throw new NotFoundError(`No Auth Group found at id: ${data.id}`);
  }

  const result = res[0];

  return {
    id: result['id'],
    name: result['name'],
    dashboardCrud: {
      create: result['create_dashboard'],
      read: result['read_dashboard'],
      update: result['update_dashboard'],
      delete: result['delete_dashboard'],
    },
    tableMetadataCrud: {
      create: result['create_table'],
      read: result['read_table'],
      update: result['update_table'],
      delete: result['delete_table'],
    },
  };
};


export const deleteAuthGroup = async (data: AuthGroupDeleteReq) => {
  if (data.name === ADMIN_GROUP_NAME) {
    throw new BadRequestError('Cannot delete admin group');
  }

  const deleteQuery = await runQuery(
    `DELETE FROM ${schemaSql}${AUTH_GROUPS} WHERE id = ?`,
    [data.id]
  );

  const affectedRows = +deleteQuery[0]?.['num_affected_rows'] || 0;

  const checkGroupsUsers = await runQuery(
    `SHOW TABLES ${schema ? `FROM ${schema}` : ''} LIKE ?`,
    [GROUPS_USERS]
  );
  if (checkGroupsUsers.length > 0) {
    await runQuery(
      `DELETE FROM ${schemaSql}${GROUPS_USERS} WHERE table_from__id = ?`,
      [data.id]
    );
  }

  const checkGroupsDashboards = await runQuery(
    `SHOW TABLES ${schema ? `FROM ${schema}` : ''} LIKE ?`,
    [GROUPS_DASHBOARDS]
  );
  if (checkGroupsDashboards.length > 0) {
    await runQuery(
      `DELETE FROM ${schemaSql}${GROUPS_DASHBOARDS} WHERE table_from__id = ?`,
      [data.id]
    );
  }

    if(checkGroupsDashboards.length > 0) {
      const deleteGroupDashQuery = await runQuery(
        `DELETE FROM ${schemaSql}${GROUPS_DASHBOARDS} WHERE table_from__id = '${data.id}'`,
      );
    }
  if (affectedRows === 1) {
    return `AuthGroup deleted.`;
  } else {
    throw new NotFoundError(`No group found at ${data.id}`);
  }

};


export const readAuthGroups = async (
  data: AuthGroupsReadReq,
): Promise<AuthGroupsReadRes> => {
  const { queryStr, params } = filterToQuery(data, '');

  const selectGroupsQuery = `
    SELECT * FROM ${schemaSql}auth_groups
    ${queryStr};
  `;

  const selectGroups = await runQuery(
    selectGroupsQuery,
    params
  ) as AuthGroupRef[];

  const countQuery = `
    SELECT COUNT(*) FROM ${schemaSql}auth_groups
    ${queryStr};
  `;

  const countGroups = await runQuery(countQuery, params);

  const groupCount = +countGroups[0]['count(1)'];

  if (groupCount === 0) {
    throw new NotFoundError(`No group found.`);
  }

  return {
    authGroups: selectGroups,
    totalGroups: groupCount,
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
  const dashboards = [];

  for (const dashboard of data.dashboards) {
    const sql = await updateSql(
      GROUPS_DASHBOARDS,
      {
        table_from__create: dashboard.create,
        table_from__read: dashboard.read,
        table_from__update: dashboard.update,
        table_from__delete: dashboard.delete,
        table_from__id: data.id,
        table_from__name: data.name,
      },
      `WHERE table_to__id = ?`,
      [dashboard.id]
    );

    dashboards.push(sql.map((el) => ({
      name: el['table_to__name'],
      id: el['table_to__id'],
      create: el['table_from__create'] === 'true',
      read: el['table_from__read'] === 'true',
      update: el['table_from__update'] === 'true',
      delete: el['table_from__delete'] === 'true',
    })));
  }

  return {
    dashboards: dashboards[0],
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

  const conditions = data.dashboardIds.map(() => `table_to__id = ?`).join(' OR ');
  const queryStr = `
    DELETE FROM ${schemaSql}${GROUPS_DASHBOARDS}
    WHERE table_from__id = ?
    AND (${conditions})
  `.trim();

  const params = [data.id, ...data.dashboardIds];

  const sql = await runQuery(queryStr, params);

  if (+sql[0]['num_affected_rows'] === 0) {
    throw new NotFoundError('Could not found a group at id ' + data.id);
  }

  return 'Dashboard removed from group.';
};

export const createAuthGroupUsers = async () => {

}

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
  const conditions: string[] = [];
  const values: any[] = [];

  for (const user of data.authUsers) {
    conditions.push(`table_to__id = ?`);
    values.push(user.id);
  }

  // Append the group ID for `table_from__id`
  conditions.push(`table_from__id = ?`);
  values.push(data.id);

  const whereClause = conditions.join(' AND ');
  const query = `DELETE FROM ${schemaSql}${GROUPS_USERS} WHERE ${whereClause}`;

  await runQuery(query, values);

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

export const deleteAuthGroupTables = async (
  data: AuthGroupTablesDeleteReq,
): Promise<AuthGroupTablesDeleteRes> => {
  const sql = await runQuery(
    `DELETE FROM ${schemaSql}${GROUPS_TABLES} WHERE table_from__id = ?`,
    [data.id]
  );

  if (+sql[0]?.['num_affected_rows'] === 0) {
    throw new NotFoundError('Could not find a group at id ' + data.id);
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
    if (res2.tableMetadataCrud?.create) {
      create = res2.tableMetadataCrud?.create;
    }
    if (res2.tableMetadataCrud?.read) {
      read = res2.tableMetadataCrud?.read;
    }
    if (res2.tableMetadataCrud?.update) {
      update = res2.tableMetadataCrud?.update;
    }
    if (res2.tableMetadataCrud?.delete) {
      del = res2.tableMetadataCrud?.delete;
    }
  }

  return {
    create,
    read,
    update,
    delete: del,
  };
};


export const checkPermissions = async (
  userId: string,
  targetId: string,
  containerId: string,
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
  )) as AuthGroupRef[];

  if (res.length === 0) {
    throw { code: 404, message: 'There is no group associated with user' };
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
    const res = (await readEdge(
      {
        direction: 'to',
        edgeTable:
          containerId === DASHBOARDS
            ? GROUPS_DASHBOARDS
            : containerId === TABLES
              ? GROUPS_TABLES
              : containerId === AUTH_USERS
                ? GROUPS_TABLES
                : GROUPS_USERS,
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
    )) as any[];

    if (containerId === DASHBOARDS) {
      for (const dashboard of res) {
        if (dashboard?.['table_from__create']) {
          create = dashboard?.['table_from__create'] === 'true';
        }
        if (dashboard?.['table_from__read']) {
          read = dashboard?.['table_from__read'] === 'true';
        }
        if (dashboard?.['table_from__update']) {
          update = dashboard?.['table_from__update'] === 'true';
        }
        if (dashboard?.['table_from__delete']) {
          del = dashboard?.['table_from__delete'] === 'true';
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
