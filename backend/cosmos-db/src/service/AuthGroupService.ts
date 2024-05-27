import { fetchContainer, fetchData, filterToQuery } from '../cosmos-utils';
import { AuthGroupsReadReq } from '../generated/api';
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
) => {
  const authGroupContainer = await initiateAuthGroupContainer();
  
  try {
    const res = await authGroupContainer.items.create({
      ...data,
      dashboards: [],
      authUsers: [],
      tables: [],

      tableMetadata: {},
    });

    const { name, id } = res.resource;
    return { name, id, };
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

  if (res.resource.dashboards.length > 0) {
    const dashboardContainer = await fetchContainer(DASHBOARDS);

    for (const dashboard of res.resource?.dashboards) {
      const res2 = await dashboardContainer
        .item(dashboard.id, dashboard.id)
        .read();

      const authGroups = res2.resource?.authGroups;

      const index = authGroups?.findIndex((el) => el.id === data.id);

      const resPatch = await dashboardContainer
        .item(dashboard.id, dashboard.id)
        .patch([{ op: 'remove', path: `/authGroups/${index}` }]);
    }
  }

  if (res.resource.authUsers.length > 0) {
    const authUsersContainer = await fetchContainer(AUTH_USERS);

    for (const user of res.resource?.authUsers) {
      const res2 = await authUsersContainer.item(user.id, user.username).read();

      const authGroups = res2.resource?.authGroups;

      const index = authGroups?.findIndex((el) => el.id === data.id);

      const resPatch = await authUsersContainer
        .item(user.id, user.username)
        .patch([{ op: 'remove', path: `/authGroups/${index}` }]);
    }
  }

  if (res.resource.tables.length > 0) {
    const authTablesContainer = await fetchContainer(TABLES);

    for (const user of res.resource?.authUsers) {
      const res2 = await authTablesContainer.item(user.id, user.name).read();

      const tables = res2.resource?.tables;

      const index = tables?.findIndex((el) => el.id === data.id);

      const resPatch = await authTablesContainer
        .item(user.id, user.name)
        .patch([{ op: 'remove', path: `/authGroups/${index}` }]);
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
  const authGroupContainer = await initiateAuthGroupContainer();
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const res = await createSubdoc({
    id: data.id,
    docs: { docs1: data.dashboards },
    container1: {
      container: authGroupContainer,
      name: 'authGroups',
    },
    container2: { container: dashboardContainer, name: 'dashboards' },
    partitionKey: data.name,
  });

  return {
    id: res.id,
    name: res.name,
    dashboards: res.values as AuthGroupDashboardRef[],
  };
};

export const readAuthGroupDashboards = async (
  data: AuthGroupDashboardsReadReq,
): Promise<AuthGroupDashboardsReadRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();

  const authGroupId = data.id;
  const authGroupName = data.name;

  const str = filterToQuery(
    { filters: data.filters },
    'p',
    `c.id = "${authGroupId}"`,
  );
  const countStr = `SELECT VALUE COUNT(1) FROM c JOIN p IN c.dashboards ${str}`;

  const str2 = filterToQuery(
    { filters: data.filters, from: data.from, to: data.to },
    'p',
    `c["id"] = "${authGroupId}"`,
  );

  const query = `SELECT  p["name"], p["id"], p["create"], p["read"], p["update"], p["delete"] FROM c JOIN p IN c["dashboards"] ${str2}`;

  const res = await authGroupContainer.items
    .query({
      query,
      parameters: [],
    })
    .fetchAll();

  const res2 = await authGroupContainer.items
    .query({
      query: countStr,
      parameters: [],
    })
    .fetchAll();

  if (res.resources.length === 0) {
    throw new NotFoundError('No group auth found.');
  }

  return {
    count: res2.resources[0],
    dashboards: res.resources,
  };
};

export const updateAuthGroupDashboards = async (
  data: AuthGroupDashboardUpdateReq,
): Promise<AuthGroupDashboardUpdateRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const authGroupId = data.id;
  const authGroupName = data.name;

  const res = await authGroupContainer.item(authGroupId, authGroupName).read();

  if (res.statusCode === 404) {
    throw new NotFoundError(`No group auth found at id: ${data.id})`);
  }

  for (const [index, dashboard] of data.dashboards.entries()) {
    const res2 = await dashboardContainer
      .item(dashboard.id, dashboard.id)
      .read();

    if (res2.statusCode === 404) {
      throw new NotFoundError(`No dashboard found at id: ${dashboard.id}`);
    }

    const index = res2.resource.authGroups.findIndex(
      (i) => i.id === authGroupId,
    );

    const obj: DashboardAuthGroups = {
      id: authGroupId,
      create: dashboard.create,
      read: dashboard.read,
      delete: dashboard.delete,
      update: dashboard.update,
      name: res.resource.name,
    };

    const res3 = await dashboardContainer
      .item(dashboard.id, dashboard.id)
      .patch([{ op: 'set', path: `/authGroups/${index}`, value: obj }]);
  }

  const batchPatchArr: PatchOperation[][] = [];

  while (data.dashboards.length > 0) {
    batchPatchArr.push(
      data.dashboards.splice(0, 10).map((dashboard) => {
        const index = res.resource.dashboards.findIndex(
          (i) => i.id === dashboard.id,
        );

        return {
          op: 'set',
          path: `/dashboards/${index}`,
          value: dashboard,
        };
      }),
    );
  }

  for (const [index, batch] of batchPatchArr.entries()) {
    const res2 = await authGroupContainer
      .item(authGroupId, authGroupName)
      .patch(batch);

    if (index === batchPatchArr.length - 1) {
      const resource = res2.resource;

      return {
        dashboards: resource.dashboards,
        id: resource.id,
        name: resource.name,
      };
    }
  }
};

export const deleteAuthGroupDashboards = async (
  data: AuthGroupDashboardDeleteReq,
): Promise<AuthGroupDashboardDeleteRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const res = await deleteSubdoc({
    id: data.id,
    subDocs: data.dashboardIds.map((el) => {
      return { id: el };
    }),
    container1: { container: authGroupContainer, name: 'authGroups' },
    container2: { container: dashboardContainer, name: 'dashboards' },
    partitionKey: data.name,
  });

  return res;
};

export const createAuthUserGroup = async (
  data: AuthGroupUsersCreateReq,
): Promise<AuthGroupUsersCreateRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();
  const authUsersContainer = await fetchContainer(AUTH_USERS);

  const res = await createSubdoc({
    id: data.id,
    docs: {
      docs1: data.authUsers.map((user) => {
        return { username: user.username, id: user.id };
      }),
      ommitPropsInContainer2: ['username'],
    },
    container1: {
      container: authGroupContainer,
      name: 'authGroups',
    },
    container2: {
      container: authUsersContainer,
      name: 'authUsers',
      partitionKey: 'username',
    },
    partitionKey: data.name,
  });

  return {
    authUsers: res.values.map((value) => {
      return {
        id: value.id as string,
        username: value.username as string,
      };
    }),
    id: res.id,
    name: res.name,
  };
};

export const readAuthGroupTables = async (
  data: AuthGroupTablesReadReq,
): Promise<AuthGroupTablesReadRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();

  const res = await readSubdocs({
    container: { instance: authGroupContainer, props: ['name', 'id'] },
    id: data.id,
    partitionKeyProp: data.name,
    subContainerName: 'tables',
    filters: { filters: data.filters, from: data.from, to: data.to },
  });

  return {
    tables: res.values.map((value) => {
      return { id: value.id, name: value.name };
    }),
    count: res.count,
  };
};

export const readAuthGroupUsers = async (
  data: AuthGroupUsersReadReq,
): Promise<AuthGroupUsersReadRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();

  const authGroupId = data.id;

  const str = filterToQuery(
    { filters: data.filters },
    'p',
    `c.id = "${authGroupId}"`,
  );
  const countStr = `SELECT VALUE COUNT(1) FROM c JOIN p IN c["authUsers"] ${str}`;

  const str2 = filterToQuery(
    { filters: data.filters, from: data.from, to: data.to },
    'p',
    `c["id"] = "${authGroupId}"`,
  );

  const response = await authGroupContainer
    .item(authGroupId, authGroupId)
    .read();

  const query = `SELECT p["username"], p["id"] FROM c JOIN p IN c["authUsers"] ${str2}`;

  const res = await authGroupContainer.items
    .query({
      query,
      parameters: [],
    })
    .fetchAll();

  const res2 = await authGroupContainer.items
    .query({
      query: countStr,
      parameters: [],
    })
    .fetchAll();

  if (res.resources.length === 0) {
    throw new NotFoundError('No group auth found.');
  }

  return {
    count: res2.resources[0],
    authUsers: res.resources,
  };
};

export const updateAuthGroupUsers = async (
  data: AuthGroupUsersUpdateReq,
): Promise<AuthGroupUsersUpdateRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();
  const authUsersContainer = await fetchContainer(AUTH_USERS);

  const authGroupId = data.id;

  const res = (await authGroupContainer
    .item(authGroupId, data.name)
    .read()) as ItemResponse<AuthGroupRef>;

  if (res.statusCode === 404) {
    throw new NotFoundError(`No group auth found at id: ${data.id})`);
  }

  for (const [index, authUser] of data.authUsers.entries()) {
    const res2 = await authUsersContainer
      .item(authUser.id, authUser.username)
      .read();

    if (res2.statusCode === 404) {
      throw new NotFoundError(`No dashboard found at id: ${authUser.id}`);
    }

    const index = res2.resource.authGroups.findIndex(
      (i) => i.id === authGroupId,
    );

    const res3 = await authUsersContainer
      .item(authUser.id, authUser.username)
      .patch([
        {
          op: 'set',
          path: `/authGroups/${index}/username`,
          value: authUser.username,
        },
      ]);
  }

  const batchPatchArr: PatchOperation[][] = [];

  while (data.authUsers.length > 0) {
    batchPatchArr.push(
      data.authUsers.splice(0, 10).map((authUser) => {
        const index = res.resource.authUsers.findIndex(
          (i) => i.id === authUser.id,
        );

        return {
          op: 'set',
          path: `/authUsers/${index}`,
          value: authUser,
        };
      }),
    );
  }

  for (const [index, batch] of batchPatchArr.entries()) {
    const res2 = await authGroupContainer
      .item(authGroupId, data.name)
      .patch(batch);

    if (index === batchPatchArr.length - 1) {
      const resource = res2.resource;

      return {
        authUsers: resource.authUsers,
        id: resource.id,
        name: resource.name,
      };
    }
  }
};

export const deleteAuthGroupUsers = async (
  data: AuthGroupUsersDeleteReq,
): Promise<AuthGroupUsersDeleteRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();
  const authUsersContainer = await fetchContainer(AUTH_USERS);

  const res = await deleteSubdoc({
    id: data.id,
    subDocs: data.authUsers.map((el) => {
      return { id: el.id, username: el.username };
    }),
    container1: { container: authGroupContainer, name: 'authGroups' },
    container2: {
      container: authUsersContainer,
      name: 'authUsers',
      partitionKeyDocProp: 'username',
    },
    partitionKey: data.name,
  });

  return res;
};

export const createAuthGroupTables = async (
  data: AuthGroupTablesCreateReq,
): Promise<AuthGroupTablesCreateRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();
  const tablesContainer = await fetchContainer(TABLES);

  const res = await createSubdoc({
    container1: { container: authGroupContainer, name: 'authGroups' },
    container2: {
      container: tablesContainer,
      name: 'tables',
      partitionKey: 'name',
    },
    id: data.id,
    docs: { docs1: data.tables },
    partitionKey: data.name,
  });

  return {
    name: data.name,
    id: data.id,
    tables: res.values as { id: string; name: string }[],
  };
};

export const deleteAuthGroupTables = async (
  data: AuthGroupTablesDeleteReq,
): Promise<AuthGroupTablesDeleteRes> => {
  const authGroupContainer = await initiateAuthGroupContainer();
  const tablesContainer = await fetchContainer(TABLES);

  const res = await deleteSubdoc({
    id: data.id,
    subDocs: data.tables,
    partitionKey: data.name,

    container1: { container: authGroupContainer, name: 'authGroups' },
    container2: {
      container: tablesContainer,
      name: 'tables',
      partitionKeyDocProp: 'name',
    },
  });

  return res;
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

export const createSubdoc = async (data: {
  id: string;
  docs: {
    docs1: Record<string, any>[];
    ommitPropsInContainer2?: string[];
  };
  container1: { container: Container; name: string };
  container2: { container: Container; name: string; partitionKey?: string };
  partitionKey?: string;
}): Promise<{
  id: string;
  name: string;
  values: Record<string, any>[];
}> => {
  const container1 = data.container1;
  const container2 = data.container2;

  const id = data.id;

  const batchPatchArr: PatchOperation[][] = [];

  const docsCopy = JSON.parse(JSON.stringify(data.docs.docs1));

  while (docsCopy.length > 0) {
    batchPatchArr.push(
      docsCopy.splice(0, 10).map((value) => {
        return {
          op: 'add',
          path: `/${container2.name}/-`,
          value: value,
        };
      }),
    );
  }
  let doc1Name;
  let retValue: {
    id: string;
    name: string;
    values: Record<string, any>[];
  };

  for (const [index, batch] of batchPatchArr.entries()) {
    try {
      const res2 = await container1.container
        .item(id, data.partitionKey || id)
        .patch(batch);
      doc1Name = res2.resource.name;
      if (index === batchPatchArr.length - 1) {
        const resource = res2.resource;

        retValue = {
          values: resource[container2.name],
          id: resource.id,
          name: resource.name,
        };
      }
    } catch (error) {
      if (error?.code === 404) {
        throw new NotFoundError(`${container1.name} not found at id: ${id}`);
      }
    }
  }

  // for (const [index, doc] of data.docs.docs1.entries()) {
  //   try {
  //     const obj = JSON.parse(JSON.stringify(doc));
  //     const excludeKey = data.docs?.ommitPropsInContainer2;

  //     excludeKey?.forEach((key) => delete obj[key]);

  //     const res = await container2.container
  //       .item(doc.id, doc?.[container2?.partitionKey] || doc.id)
  //       .patch([
  //         {
  //           op: 'add',
  //           path: `/${container1.name}/-`,
  //           value: { ...obj, name: doc1Name, id: data.id },
  //         },
  //       ]);
  //   } catch (error) {
  //     if (error?.code === 404) {
  //       throw new NotFoundError(
  //         `${container2.name} not found at id: ${doc.id}`,
  //       );
  //     }
  //   }
  // }

  return retValue;
};

export const readSubdocs = async (data: {
  id: string;

  filters: ReadPaginationFilter;

  container: { instance: Container; props?: string[] };
  subContainerName: string;
  partitionKeyProp?: string;
}): Promise<{ count: number; values: Record<string, any> }> => {
  const authGroupId = data.id;

  const str = filterToQuery(
    { filters: data.filters.filters },
    'p',
    `c.id = "${authGroupId}"`,
  );
  const countStr = `SELECT VALUE COUNT(1) FROM c JOIN p IN c["${data.subContainerName}"] ${str}`;

  const str2 = filterToQuery(
    {
      filters: data.filters.filters,
      from: data.filters.from,
      to: data.filters.to,
    },
    'p',
    `c["id"] = "${authGroupId}"`,
  );

  const props = data.container.props.map((prop) => `p["${prop}"]`).join(', ');

  const query = `SELECT ${props} FROM c JOIN p IN c["${data.subContainerName}"] ${str2}`;

  const res = await data.container.instance.items
    .query({
      query,
      parameters: [],
    })
    .fetchAll();

  const res2 = await data.container.instance.items
    .query({
      query: countStr,
      parameters: [],
    })
    .fetchAll();

  if (res.resources.length === 0) {
    throw new NotFoundError('No group auth found.');
  }

  return {
    count: res2.resources[0],
    values: res.resources,
  };
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

  const table = res.resource.auth.table;

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
      table: res.resource.auth.table,
    };
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError(
        `Group not found at id "${data.name}" and name: ${data.name}`,
      );
    }
  }
};
