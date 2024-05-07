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
  DashboardGroupAuthCreateReq,
  DashboardAuthGroups,
  AuthGroupUsersReadReq,
  AuthGroupUsersReadRes,
  AuthGroupUsersUpdateReq,
  AuthGroupUsersUpdateRes,
  AuthGroupUsersDeleteReq,
  AuthGroupUsersDeleteRes,
  AuthGroupUsersCreateReq,
  AuthGroupUsersCreateRes,
} from '../typescript/api';
import {
  ConflictEntityError,
  NotFoundError,
  BadRequestError,
} from '../generated/api';

import { Container, ItemResponse, PatchOperation } from '@azure/cosmos';
import {
  DASHBOARDS,
  createDashboardAuthGroup,
  deleteDashboardGroupAuth,
  readDashboardGroupAuth,
  readDashboards,
  updateDashboardGroupAuth,
} from './DashboardService';
import { BadRequest } from 'express-openapi-validator/dist/openapi.validator';
import { AUTH_USERS } from './AuthUserService';
export const AUTH_GROUPS = 'auth_groups';

export const createAuthGroup = async (
  data: AuthGroupCreateReq,
): Promise<AuthGroupCreateRes> => {
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  try {
    const res = (await authGroupContainer.items.create({
      ...data,
      dashboards: [],
      authUsers: [],
    })) as ItemResponse<AuthGroupRef>;

    const { name, id } = res.resource;
    return { name, id };
  } catch (error) {
    if (error?.code === 409) {
      throw new ConflictEntityError(`id: ${data.id} already taken.`);
    }
  }
};

export const updateAuthGroup = async (
  data: AuthGroupUpdateReq,
): Promise<AuthGroupUpdateRes> => {
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

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
    const res = await authGroupContainer.item(data.id, data.id).patch(patchArr);

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
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  const res = (await authGroupContainer
    .item(data.id, data.id)
    .read()) as ItemResponse<AuthGroupRef>;

  if (res.statusCode === 404) {
    throw new NotFoundError(`No Auth Group found at id: ${data.id}`);
  }

  return res.resource;
};

export const deleteAuthGroup = async (
  data: AuthGroupDeleteReq,
): Promise<AuthGroupDeleteRes> => {
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  const res = await authGroupContainer.item(data.id, data.id).read();

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
      const res2 = await authUsersContainer.item(user.id, user.id).read();

      const authGroups = res2.resource?.authGroups;

      const index = authGroups?.findIndex((el) => el.id === data.id);

      const resPatch = await authUsersContainer
        .item(user.id, user.id)
        .patch([{ op: 'remove', path: `/authGroups/${index}` }]);
    }
  }

  const res3 = (await authGroupContainer
    .item(data.id, data.id)
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
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const res = await createSubdoc({
    id: data.id,
    values: data.dashboards,
    container1: { container: authGroupContainer, name: 'authGroups' },
    container2: { container: dashboardContainer, name: 'dashboards' },
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
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  const authGroupId = data.id;

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

  const response = await authGroupContainer
    .item(authGroupId, authGroupId)
    .read();

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
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const authGroupId = data.id;

  const res = await authGroupContainer.item(authGroupId, authGroupId).read();

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
      .item(authGroupId, authGroupId)
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
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const res = await deleteSubdoc({
    id: data.id,
    subIds: data.dashboardIds,
    container1: { container: authGroupContainer, name: 'authGroups' },
    container2: { container: dashboardContainer, name: 'dashboards' },
  });

  return res;
};

export const createAuthUserGroup = async (
  data: AuthGroupUsersCreateReq,
): Promise<AuthGroupUsersCreateRes> => {
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);
  const authUsersContainer = await fetchContainer(AUTH_USERS);

  const res = await createSubdoc({
    id: data.id,
    values: data.authUsers.map((user) => {
      return { name: user.name, id: user.id };
    }),
    container1: { container: authGroupContainer, name: 'authGroups' },
    container2: { container: authUsersContainer, name: 'authUsers' },
  });

  return {
    authUsers: res.values.map((value) => {
      return {
        id: value.id as string,
        name: value.name as string,
      };
    }),
    id: res.id,
    name: res.name,
  };
};

export const readAuthGroupUsers = async (
  data: AuthGroupUsersReadReq,
): Promise<AuthGroupUsersReadRes> => {
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

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

  const query = `SELECT p["name"], p["id"] FROM c JOIN p IN c["authUsers"] ${str2}`;

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
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);
  const authUsersContainer = await fetchContainer(AUTH_USERS);

  const authGroupId = data.id;

  const res = (await authGroupContainer
    .item(authGroupId, authGroupId)
    .read()) as ItemResponse<AuthGroupRef>;

  if (res.statusCode === 404) {
    throw new NotFoundError(`No group auth found at id: ${data.id})`);
  }

  for (const [index, authUser] of data.authUsers.entries()) {
    const res2 = await authUsersContainer.item(authUser.id, authUser.id).read();

    if (res2.statusCode === 404) {
      throw new NotFoundError(`No dashboard found at id: ${authUser.id}`);
    }

    const index = res2.resource.authGroups.findIndex(
      (i) => i.id === authGroupId,
    );

    const res3 = await authUsersContainer
      .item(authUser.id, authUser.id)
      .patch([
        { op: 'set', path: `/authGroups/${index}/name`, value: authUser.name },
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
      .item(authGroupId, authGroupId)
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

  const authGroupContainer = await fetchContainer(AUTH_GROUPS);
  const authUsersContainer = await fetchContainer(AUTH_USERS);

  const res = await deleteSubdoc({
    id: data.id,
    subIds: data.authUsersIds,
    container1: { container: authGroupContainer, name: 'authGroups' },
    container2: { container: authUsersContainer, name: 'authUsers' },
  });

  return res;
};

export const deleteSubdoc = async (data: {
  id: string;
  subIds: string[];
  container1: { container: Container; name: string };
  container2: { container: Container; name: string };
}): Promise<string> => {
  if (data?.subIds?.length === 0) {
    throw new BadRequestError(`${data.container1.name} Ids array empty`);
  }

  const container1 = data.container1;
  const container2 = data.container2;

  const docId = data.id;

  const res = await data.container1.container.item(docId, docId).read();

  for (const [index, subId] of data.subIds.entries()) {
    const res3 = await container2.container.item(subId, subId).read();

    if (res3.statusCode === 404) {
      throw new NotFoundError(`Dashboard not found at id: ${subId}`);
    }

    const indexUpdate = res3.resource[container1.name].findIndex(
      (el2) => el2.id === docId,
    );

    const res2 = await container2.container.item(subId, subId).patch([
      {
        op: 'remove',
        path: `/${container1.name}/${indexUpdate}`,
      },
    ]);
  }

  const batchPatchArr: PatchOperation[][] = [];

  while (data.subIds.length > 0) {
    batchPatchArr.push(
      data.subIds.splice(0, 10).map((subDoc2Id) => {
        const index = res.resource[container2.name].findIndex(
          (i) => i.id === subDoc2Id,
        );

        return {
          op: 'remove',
          path: `/${container2.name}/${index}`,
        };
      }),
    );
  }

  for (const [index, batch] of batchPatchArr.entries()) {
    const res2 = await container1.container.item(docId, docId).patch(batch);

    if (index === batchPatchArr.length - 1) {
      const resource = res2.resource;

      return `${container1.name} references deleted.`;
    }
  }
};

export const createSubdoc = async (data: {
  id: string;
  values: { [key: string]: any }[];
  container1: { container: Container; name: string };
  container2: { container: Container; name: string };
}): Promise<{
  id: string;
  name: string;
  values: Record<string, any>[];
}> => {
  const container1 = data.container1;
  const container2 = data.container2;

  const id = data.id;

  const batchPatchArr: PatchOperation[][] = [];

  const valuesCopy = JSON.parse(JSON.stringify(data.values));

  while (valuesCopy.length > 0) {
    batchPatchArr.push(
      valuesCopy.splice(0, 10).map((value) => {
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
      const res2 = await container1.container.item(id, id).patch(batch);
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

  for (const [index, value] of data.values.entries()) {
    try {
      const res = await container2.container.item(value.id, value.id).patch([
        {
          op: 'add',
          path: `/${container1.name}/-`,
          value: {
            ...value,
            name: doc1Name,
            id: data.id,
          },
        },
      ]);
    } catch (error) {
      if (error?.code === 404) {
        throw new NotFoundError(
          `${container2.name} not found at id: ${value.id}`,
        );
      }
    }
  }

  return retValue;
};
