import { fetchContainer, fetchData, filterToQuery } from '../cosmos-utils';
import { AuthGroupsReadReq, AuthUserIdAndUsername } from '../generated/api';
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
} from '../typescript/api';
import {
  ConflictEntityError,
  NotFoundError,
  BadRequestError,
} from '../generated/api';

import {
  Container,
  ItemResponse,
  PartitionKeyDefinition,
  PatchOperation,
  UniqueKeyPolicy,
} from '@azure/cosmos';
import { DASHBOARDS } from './DashboardService';
import { AUTH_USERS } from './AuthUserService';
import { TABLES } from './TableService';
import {
  createConnection,
  createTableDataEdge,
  deleteTableDataEdge,
  readTableDataEdge,
  updateConnection,
  updateTableDataEdge,
} from './EdgeService';
import { readTableData } from './TableDataService';
export const AUTH_GROUPS = 'auth_groups';
export const ADMIN = 'Admin';

const partitionKey: string | PartitionKeyDefinition = {
  paths: ['/name'],
};

const uniqueKeyPolicy: UniqueKeyPolicy = {
  uniqueKeys: [{ paths: ['/name'] }],
};

const initialDocs: AuthGroupCreateReq[] = [
  {
    name: ADMIN,
  },
  {
    name: 'USER',
  },
];

<<<<<<< HEAD
export const authGroupContainerProps = {
  AUTH_GROUPS,
  partitionKey,
  uniqueKeyPolicy,
  initialDocs,
};

=======
>>>>>>> main
export const initiateAuthGroupContainer = async (): Promise<Container> => {
  const authGroupContainer = await fetchContainer(
    AUTH_GROUPS,
    partitionKey,
    uniqueKeyPolicy,
    initialDocs,
  );

  return authGroupContainer;
};

export const createAuthGroup = async (
  data: AuthGroupCreateReq,
): Promise<AuthGroupCreateRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();

  try {
    const res = (await authGroupContainer.items.create({
      ...data,
<<<<<<< HEAD
      tableMetadata: {
        create: false,
        read: true,
        update: false,
        delete: false,
      },
    })) as ItemResponse<AuthGroupRef>;

    const { name, id, tableMetadata } = res.resource;
    return { name, id, tableMetadata };
=======
      auth: {
        table: {
          create: false,
          read: true,
          update: false,
          delete: false,
        },
        tableData: {
          create: false,
          read: true,
          update: false,
          delete: false,
        },
        dashboard: {
          create: false,
          read: true,
          update: false,
          delete: false,
        },
      },
    })) as ItemResponse<AuthGroupRef>;

    const { name, id, auth } = res.resource;
    return { name, id, auth };
>>>>>>> main
  } catch (error) {
    if (error?.code === 409) {
      throw new ConflictEntityError(`id: ${data.id} already taken.`);
    }
  }
};

export const updateAuthGroup = async (
  data: AuthGroupUpdateReq,
): Promise<AuthGroupUpdateRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();

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
      default:
        break;
    }
  }

  try {
    const res = await authGroupContainer
      .item(data.id, data.name)
      .patch(patchArr);

    const edges = res.resource.edges;

    const dashboards = res?.resource?.dashboards as AuthGroupDashboardRef[];
    const authUsers = res?.resource?.authUsers;
    if (dashboards?.length > 0) {
      const dashboardContainer = await fetchContainer(DASHBOARDS);

      for (const dashboard of dashboards) {
        const res2 = await dashboardContainer
          .item(dashboard.id, dashboard.id)
          .read();
        const index = res2?.resource?.authGroups.findIndex(
          (el) => el?.id === data?.id,
        );

        const res3 = await dashboardContainer
          .item(dashboard.id, dashboard.id)
          .patch([
            {
              op: 'set',
              path: `/authGroups/${index}/name`,
              value: data?.name,
            },
          ]);
      }
    }

    if (authUsers.length > 0) {
      const authUsersContainer = await fetchContainer(AUTH_USERS);

      for (const dashboard of dashboards) {
        const res2 = await authUsersContainer
          .item(dashboard.id, dashboard.id)
          .read();
        const index = res2?.resource?.authGroups.findIndex(
          (el) => el?.id === data?.id,
        );

        const res3 = await authUsersContainer
          .item(dashboard.id, dashboard.id)
          .patch([
            {
              op: 'set',
              path: `/authGroups/${index}/name`,
              value: data?.name,
            },
          ]);
      }
    }
    return res.resource;
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError(`No Auth Group found at id: ${data.id}`);
    }
  }
};

export const readAuthGroup = async (
  data: AuthGroupReadReq,
): Promise<AuthGroupReadRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();

  const res = (await authGroupContainer
    .item(data.id, data.name)
    .read()) as ItemResponse<AuthGroupRef>;

  if (res.statusCode === 404) {
    throw new NotFoundError(`No Auth Group found at id: ${data.id}`);
  }

  return res.resource;
};

export const deleteAuthGroup = async (
  data: AuthGroupDeleteReq,
): Promise<AuthGroupDeleteRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();

  const res = await authGroupContainer.item(data.id, data.name).read();

  if (res?.statusCode === 404) {
    throw new NotFoundError(`Auth Group not found at id: ${data.id}`);
  }

  const edges = res.resource.edges;
  const arr = [];

  if (Object.values(edges).length > 0) {
    for (const prop in edges) {
      const tableName = prop;
      for (const prop2 in edges[prop]) {
        const edgeLabel = prop2;
        for (const prop3 in edges[prop][prop2]) {
          const direction = prop3;
          for (const value of edges[prop][prop2][prop3]) {
            console.log({ value });
            const res2 = await deleteTableDataEdge({
              edge: {
                direction: direction as EdgeDirectionEnum,
                edgeLabel,
                tableName,
                rows: [value],
                partitionKeyProp:
                  tableName === AUTH_GROUPS || tableName === TABLES
                    ? value.name
                    : tableName === AUTH_USERS
                    ? value.username
                    : '',
              },
              rowId: data.id,
              tableName: AUTH_GROUPS,
              rowPartitionKey: data.name,
            });
          }
        }
      }
    }
  }

  const res3 = (await authGroupContainer
    .item(data.id, data.name)
    .delete()) as ItemResponse<AuthGroupRef>;

  return `AuthGroup deleted.`;
};

export const readAuthGroups = async (
  data: AuthGroupsReadReq,
): Promise<AuthGroupsReadRes> => {
  try {
    const res = await fetchData(data, AUTH_GROUPS);

    return { authGroups: res.values, totalGroups: res.count };
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError(`Auth Group not found.`);
    }
  }
};

export const createAuthGroupDashboards = async (
  data: AuthGroupDashboardCreateReq,
): Promise<AuthGroupDashboardCreateRes> => {
  const res = await createTableDataEdge({
    tableFrom: {
      tableName: 'auth_groups',

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
    edge: 'groups-dashboards',
    edgeType: 'oneToMany',
    tableTo: { rows: data.dashboards, tableName: 'dashboards' },
  });

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

  return {
    id: data.id,
    name: data.name,
    dashboards: res.map((el) => el.to) as AuthGroupDashboardRef[],
  };
};

export const readAuthGroupDashboards = async (
  data: AuthGroupDashboardsReadReq,
): Promise<AuthGroupDashboardsReadRes> => {
  const res = await readTableDataEdge({
    edge: {
      direction: 'to',
      edgeLabel: 'groups-dashboards',
      tableName: DASHBOARDS,
    },
    rowId: data.id,
    tableName: AUTH_GROUPS,
    filters: data.filters,
    from: data.from,
    to: data.to,
  });

  if (res.count === 0) {
    throw new NotFoundError('No group auth found.');
  }
  return {
    count: res.count,
    dashboards: res.edges as AuthGroupDashboardRef[],
  };
};

export const updateAuthGroupDashboards = async (
  data: AuthGroupDashboardUpdateReq,
): Promise<AuthGroupDashboardUpdateRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const res2 = await authGroupContainer.item(data.id, data.name).read();

  if (res2.statusCode === 404) {
    throw new NotFoundError(
      `Did not find any group at id "${data.id}" and name:"${data.name}"`,
    );
  }
  const edges = res2.resource.edges;
  const updateVals = [];

  const res = await updateTableDataEdge({
    tableFrom: {
      rows: data.dashboards.map((dash) => {
        return { ...dash, id: data.id, name: data.name };
      }),
      tableName: AUTH_GROUPS,
      partitionKeyProp: 'name',
    },
    edge: 'groups-dashboards',
    edgeType: 'oneToMany',
    tableTo: {
      tableName: DASHBOARDS,
      rows: data.dashboards,
    },
  });

  return {
    dashboards: res.map((el) => el.to) as AuthGroupDashboardRef[],
    id: data.id,
    name: data.name,
  };
};

export const deleteAuthGroupDashboards = async (
  data: AuthGroupDashboardDeleteReq,
): Promise<AuthGroupDashboardDeleteRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();
  const dashboardContainer = await fetchContainer(DASHBOARDS);
  if (data.dashboardIds.length === 0) {
    throw new BadRequestError('No dashboardId mentioned.');
  }

  const res = await deleteTableDataEdge({
    edge: {
      edgeLabel: 'groups-dashboards',
      direction: 'to',
      rows: data.dashboardIds.map((dash) => {
        return { id: dash };
      }),
      tableName: DASHBOARDS,
    },
    rowId: data.id,
    rowPartitionKey: data.name,
    tableName: AUTH_GROUPS,
  });

  return '';
};

export const createAuthUserGroup = async (
  data: AuthGroupUsersCreateReq,
): Promise<AuthGroupUsersCreateRes> => {
  const res = await createTableDataEdge({
    edge: 'groups-users',
    edgeType: 'oneToMany',
    tableFrom: {
      tableName: AUTH_GROUPS,
      rows: [{ id: data.id, name: data.name }],
      partitionKeyProp: 'name',
    },
    tableTo: {
      tableName: AUTH_USERS,
      rows: data.authUsers,
      partitionKeyProp: 'username',
    },
  });

  return {
    id: data.id,
    name: data.name,
    authUsers: res.map((el) => el.to) as UsernameAndIdRef[],
  };
};

export const readAuthGroupTables = async (
  data: AuthGroupTablesReadReq,
): Promise<AuthGroupTablesReadRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();

  const res = await readTableDataEdge({
    edge: {
      direction: 'to',
      edgeLabel: 'groups-tables',
      tableName: TABLES,
    },
    rowId: data.id,
    tableName: AUTH_GROUPS,
    filters: data.filters,
    from: data.from,
    to: data.to,
  });

  if (res.count === 0) {
    throw new NotFoundError(
      `No table was found in the group edge object at id "${data.id}" and name "${data.name}"`,
    );
  }

  return {
    tables: res.edges as NameAndIdRef[],
    count: res.count,
  };
};

export const readAuthGroupUsers = async (
  data: AuthGroupUsersReadReq,
): Promise<AuthGroupUsersReadRes> => {
  const res = await readTableDataEdge({
    edge: {
      direction: 'to',
      edgeLabel: 'groups-users',
      tableName: AUTH_USERS,
    },
    rowId: data.id,
    tableName: AUTH_GROUPS,
    filters: data.filters,
    from: data.from,
    to: data.to,
  });

<<<<<<< HEAD
=======
  const res2 = await initiateAuthGroupContainer();
  const res3 = await res2.items
    .query({ query: 'select * from c', parameters: [] })
    .fetchAll();

>>>>>>> main
  if (res.count === 0) {
    throw new NotFoundError('No group auth found.');
  }

  return {
    count: res.count,
    authUsers: res.edges as AuthUserIdAndUsername[],
  };
};

export const updateAuthGroupUsers = async (
  data: AuthGroupUsersUpdateReq,
): Promise<AuthGroupUsersUpdateRes> => {
  const res = await updateTableDataEdge({
    tableFrom: {
      rows: [{ id: data.id, name: data.name }],
      tableName: AUTH_GROUPS,
      partitionKeyProp: 'name',
    },
    edge: 'groups-users',
    edgeType: 'oneToMany',
    tableTo: {
      tableName: AUTH_USERS,
      rows: data.authUsers,
      partitionKeyProp: 'username',
    },
  });

<<<<<<< HEAD
=======


>>>>>>> main
  return {
    id: data.id,
    name: data.name,
    authUsers: res.map((el) => el.to) as UsernameAndIdRef[],
  };
};

export const deleteAuthGroupUsers = async (
  data: AuthGroupUsersDeleteReq,
): Promise<AuthGroupUsersDeleteRes> => {
  const res = await deleteTableDataEdge({
    rowId: data.id,
    tableName: AUTH_GROUPS,
    edge: {
      direction: 'from',
      edgeLabel: 'groups-users',
      tableName: AUTH_USERS,
      rows: data.authUsers,
      partitionKeyProp: 'username',
    },

    rowPartitionKey: data.name,
  });

  return '';
};

export const createAuthGroupTables = async (
  data: AuthGroupTablesCreateReq,
): Promise<AuthGroupTablesCreateRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();
  const tablesContainer = await fetchContainer(TABLES);

  const res = await createTableDataEdge({
    edge: 'groups-tables',
    edgeType: 'oneToMany',
    tableFrom: {
      rows: [{ id: data.id, name: data.name }],
      tableName: AUTH_GROUPS,
      partitionKeyProp: 'name',
    },
    tableTo: {
      rows: data.tables,
      tableName: TABLES,
      partitionKeyProp: 'name',
    },
  });

  console.log({ res });

  return {
    name: data.name,
    id: data.id,
    tables: [],
  };
};

export const deleteAuthGroupTables = async (
  data: AuthGroupTablesDeleteReq,
): Promise<AuthGroupTablesDeleteRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();
  const tablesContainer = await fetchContainer(TABLES);

  const res = await deleteTableDataEdge({
    edge: {
      direction: 'to',
      edgeLabel: 'groups-tables',
      rows: data.tables,
      tableName: TABLES,
      partitionKeyProp: 'name',
    },
    rowId: data.id,
    tableName: AUTH_GROUPS,
    rowPartitionKey: data.name,
  });

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

<<<<<<< HEAD
  const table = res.resource.tableMetadata;
=======
  const table = res.resource.auth.table;
>>>>>>> main

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
<<<<<<< HEAD
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
=======
        patchArr.push({ op: 'set', path: `/auth/table/create`, value });
        break;
      case 'read':
        patchArr.push({ op: 'set', path: `/auth/table/read`, value });
        break;
      case 'update':
        patchArr.push({ op: 'set', path: `/auth/table/update`, value });
        break;
      case 'delete':
        patchArr.push({ op: 'set', path: `/auth/table/delete`, value });
>>>>>>> main
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
<<<<<<< HEAD
      table: res.resource.tableMetadata,
=======
      table: res.resource.auth.table,
>>>>>>> main
    };
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError(
        `Group not found at id "${data.name}" and name: ${data.name}`,
      );
    }
  }
};
