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
import {
  ConflictEntityError,
  NotFoundError,
  BadRequestError,
} from '../generated/api';

import { ItemResponse, PatchOperation } from '@azure/cosmos';
import {
  DASHBOARDS,
  createDashboardAuthGroup,
  deleteDashboardGroupAuth,
  readDashboardGroupAuth,
  readDashboards,
  updateDashboardGroupAuth,
} from './DashboardService';
import { BadRequest } from 'express-openapi-validator/dist/openapi.validator';
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
      default:
        break;
    }
  }
  try {
    const res = await authGroupContainer.item(data.id, data.id).patch(patchArr);

    const dashboards = res?.resource?.dashboards as AuthGroupDashboardRef[];
    if (dashboards?.length > 0) {
      const dashboardContainer = await fetchContainer(DASHBOARDS);

      for (const dashboard of dashboards) {
        const res2 = await dashboardContainer
          .item(dashboard.id, dashboard.id)
          .read();
        const index = res2?.resource?.authGroups.findIndex(
          (el) => el?.groupId === data?.id,
        );

        const res3 = await dashboardContainer
          .item(dashboard.id, dashboard.id)
          .patch([
            {
              op: 'set',
              path: `/authGroups/${index}/groupName`,
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
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const res = await authGroupContainer.item(data.id, data.id).read();

  if (res?.statusCode === 404) {
    throw new NotFoundError(`Auth Group not found at id: ${data.id}`);
  }

  for (const dashboard of res.resource?.dashboards) {
    const res = await dashboardContainer
      .item(dashboard.id, dashboard.id)
      .read();

    const authGroups = res.resource?.authGroups;

    const index = authGroups?.findIndex((el) => el.groupId === data.id);

    const resPatch = await dashboardContainer
      .item(dashboard.id, dashboard.id)
      .patch([{ op: 'remove', path: `/authGroups/${index}` }]);
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

  const authGroupId = data.id;

  const batchPatchArr: PatchOperation[][] = [];

  for (const [index, dashboard] of data.dashboards.entries()) {
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
      (i) => i.groupId === authGroupId,
    );

    const obj: DashboardAuthGroups = {
      groupId: authGroupId,
      create: dashboard.create,
      read: dashboard.read,
      delete: dashboard.delete,
      update: dashboard.update,
      groupName: res.resource.name,
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
  if (data?.dashboardIds?.length === 0) {
    throw new BadRequestError('Dashboard Ids array empty');
  }

  const authGroupContainer = await fetchContainer(AUTH_GROUPS);
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const authGroupId = data.id;

  const res = await authGroupContainer.item(authGroupId, authGroupId).read();
  if (res.resource) {
  }

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
