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
} from '../typescript/api';
import { ConflictEntityError, NotFoundError } from '../generated/api';

import { ItemResponse, PatchOperation } from '@azure/cosmos';
import {
  DASHBOARDS,
  createDashboardAuthGroup,
  deleteDashboardGroupAuth,
  updateDashboardGroupAuth,
} from './DashboardService';
export const AUTH_GROUPS = 'auth_groups';

export const createAuthGroup = async (
  data: AuthGroupCreateReq,
): Promise<AuthGroupCreateRes> => {
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  try {
    const res = (await authGroupContainer.items.create({
      ...data,
      dashboards: [],
    })) as ItemResponse<AuthGroupRef>;

    return res.resource;
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
      case 'parents':
        patchArr.push({
          op: 'replace',
          path: '/parents',
          value: data[prop],
        });
        break;
      case 'symlinks':
        patchArr.push({
          op: 'replace',
          path: '/symlinks',
          value: data[prop],
        });
        break;
      default:
        break;
    }
  }
  try {
    const res = (await authGroupContainer
      .item(data.id, data.id)
      .patch(patchArr)) as ItemResponse<AuthGroupRef>;

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

  try {
    const res = (await authGroupContainer
      .item(data.id, data.id)
      .delete()) as ItemResponse<AuthGroupRef>;
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError(`Auth Group not found at id: ${data.id}`);
    }
  }

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

  const authGroupId = data.id;

  const batchPatchArr: PatchOperation[][] = [];

  for (const [index, dashboard] of data.dashboards.entries()) {
    // await createDashboardAuthGroup({
    //   authGroups: [
    //     {
    //       groupId: res.resource.id,
    //       create: dashboard.create,
    //       read: dashboard.read,
    //       delete: dashboard.delete,
    //       update: dashboard.update,
    //       groupName: res.resource.name,
    //     },
    //   ],
    //   dashboardId: dashboard.id,
    // });

    try {
      const res = await dashboardContainer
        .item(dashboard.id, dashboard.id)
        .patch([
          {
            op: 'add',
            path: '/authGroups/-',
            value: {
              groupId: authGroupId,
              create: dashboard.create,
              read: dashboard.read,
              delete: dashboard.delete,
              update: dashboard.update,
              groupName: data.name,
            },
          },
        ]);

      console.log(res);
    } catch (error) {
      if (error?.code === 404) {
        throw new NotFoundError(`Dashboard not found at id: ${dashboard.id}`);
      }
    }
  }

  while (data.dashboards.length > 0) {
    batchPatchArr.push(
      data.dashboards.splice(0, 10).map((dashboard) => {
        return {
          op: 'add',
          path: `/dashboards/-`,
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

  const json = JSON.stringify(response.resource);

  const query = `SELECT  p["name"], p["id"], p["create"], p["read"], p["update"], p["delete"] FROM c JOIN p IN c["dashboards"] ${str2}`;

  const res = await authGroupContainer.items
    .query({
      query,
      parameters: [],
    })
    .fetchAll();

  const res3 = await authGroupContainer.items
    .query({
      query:
        'SELECT p["name"],p["id"], p["create"], p["read"], p["update"], p["delete"] FROM c JOIN p IN c["dashboards"]',
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

  for (const [index, dashboard] of data.dashboards.entries()) {
    const res = await dashboardContainer
      .item(dashboard.id, dashboard.id)
      .read();

    if (res.statusCode === 404) {
      throw new NotFoundError(`No dashboard found at id: ${dashboard.id}`);
    }

    const index = res.resource.authGroups.findIndex(
      (i) => i.groupId === authGroupId,
    );
    if (index === -1) {
      throw new NotFoundError(`No group auth found at id: ${data.id})`);
    }

    const obj: DashboardAuthGroups = {
      groupId: dashboard.id,
      create: dashboard.create,
      read: dashboard.read,
      delete: dashboard.delete,
      update: dashboard.update,
      groupName: dashboard.name,
    };

    const res2 = await dashboardContainer
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
        if (index === -1) {
          throw new NotFoundError(
            `No group auth found at: (name: ${dashboard.name}, id: ${dashboard.id})`,
          );
        }

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

  const authGroupId = data.id;

  const res = await authGroupContainer.item(authGroupId, authGroupId).read();
  const patchArr: PatchOperation[] = [];

  for (const [index, dashboardId] of data.dashboardIds.entries()) {
    const res3 = await dashboardContainer.item(dashboardId, dashboardId).read();

    if (res3.statusCode === 404) {
      throw new NotFoundError(`Dashboard not found at id: ${dashboardId}`);
    }

    const indexUpdate = res3.resource.authGroups.findIndex(
      (el2) => el2.groupId === authGroupId,
    );

    const res2 = await dashboardContainer.item(dashboardId, dashboardId).patch([
      {
        op: 'remove',
        path: `/authGroups/${indexUpdate}`,
      },
    ]);
  }

  const batchPatchArr: PatchOperation[][] = [];

  while (data.dashboardIds.length > 0) {
    batchPatchArr.push(
      data.dashboardIds.splice(0, 10).map((dashboardId) => {
        const index = res.resource.dashboards.findIndex(
          (i) => i.id === dashboardId,
        );
        if (index === -1) {
          throw new NotFoundError(
            `No Dashboard found at:  id: ${dashboardId})`,
          );
        }

        return {
          op: 'remove',
          path: `/dashboards/${index}`,
          value: dashboardId,
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

      return 'Dashboard references deleted.';
    }
  }
};
