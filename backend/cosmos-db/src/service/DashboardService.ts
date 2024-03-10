import {
  DashboardDeleteReq,
  DashboardCreateReq,
  DashboardUpdateReq,
  ReadPaginationFilter,
  DashboardsReadRes,
  DashboardGroupAuthCreateReq,
  DashboardGroupAuthCreateRes,
  DashboardGroupAuth,
  DashboardGroupAuthReadReq,
  DashboardGroupAuthReadRes,
  DashboardGroupAuthUpdateReq,
  DashboardGroupAuthUpdateRes,
} from '../typescript/api';
import { FetchData, fetchContainer, fetchData } from '../cosmos-utils';
import {
  NotFoundError,
  ConflictEntityError,
  BadRequestError,
} from '../generated/api';
import { ItemResponse } from '@azure/cosmos';

const DASHBOARDS = 'dashboards';

export const upsertDashboard = async (
  data: DashboardCreateReq | DashboardUpdateReq,
) => {
  try {
    const dashboardContainer = await fetchContainer(DASHBOARDS);

    const res = await dashboardContainer.items.upsert({
      ...data,
      authGroups: {},
    });
    const { _rid, _self, _etag, _attachments, _ts, ...rest } =
      res.resource as any;

    return rest;
  } catch (error) {
    throw error;
  }
};

export const readDashboardById = async (dashboardId: string) => {
  const querySpec = {
    query: 'select * from dashboards p where p.id=@dashboardId',
    parameters: [
      {
        name: '@dashboardId',
        value: dashboardId,
      },
    ],
  };
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const { resources } = await dashboardContainer.items
    .query(querySpec)
    .fetchAll();
  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw new NotFoundError('No dashboard found.');
  }
};

export const deleteDashboard = async (data: DashboardDeleteReq) => {
  try {
    const dashboardContainer = await fetchContainer(DASHBOARDS);
    const res = await dashboardContainer.item(data.id, data.id).delete();

    return 'Dashboard deleted!';
  } catch (error) {
    throw error;
  }
};

export const readDashboards = async (
  body: ReadPaginationFilter,
): Promise<DashboardsReadRes> => {
  const res = await fetchData(body, DASHBOARDS);

  return { dashboards: res.values, totalDashboards: res.count };
};

export const createDashboardAuthGroup = async (
  data: DashboardGroupAuthCreateReq,
): Promise<DashboardGroupAuthCreateRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);
  const dashboardId = data.dashboardId;

  const res2 = await dashboardContainer.item(dashboardId, dashboardId).read();

  const authGroups = res2.resource.authGroups;

  const wrongFieldsArr = [];

  for (const prop in data.authGroups) {
    if (!authGroups[prop]) {
      const res = await dashboardContainer
        .item(dashboardId, dashboardId)
        .patch([
          {
            op: 'add',
            path: `/authGroups/${prop}`,
            value: [],
          },
        ]);
    }

    if (!data.authGroups[prop]) {
      wrongFieldsArr.push(prop);
    }
  }

  if (wrongFieldsArr.length > 0) {
    throw new BadRequestError(
      `${wrongFieldsArr.length > 1 ? 'fields' : 'field'} ${wrongFieldsArr
        .map((el) => `'${el?.toUpperCase()}'`)
        .join(', ')} cannot be null or undefined.`,
    );
  }

  for (const prop in data.authGroups) {
    for (const [index, el] of data.authGroups[prop]?.entries()) {
      const res = await dashboardContainer
        .item(dashboardId, dashboardId)
        .patch([
          {
            op: 'add',
            path: `/authGroups/${prop}/-`,
            value: el,
          },
        ]);
      if (data.authGroups[prop].length - 1 === index) {
        return {
          authGroups: res.resource.authGroups,
          dashboardId,
          dashboardName: res.resource.name,
        };
      }
    }
  }
};

export const readDashboardGroupAuth = async (
  data: DashboardGroupAuthReadReq,
): Promise<DashboardGroupAuthReadRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const res3 = await dashboardContainer
    .item(data.dashboardId, data.dashboardId)
    .read();

  return {
    authGroups: res3.resource?.authGroups,
    dashboardId: res3.resource?.id,
    dashboardName: res3.resource?.name,
  };
};

export const deleteDashboardGroupAuth = async (
  data: DashboardGroupAuthUpdateReq,
): Promise<DashboardGroupAuthUpdateRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const dashboardId = data.dashboardId;

  const res3 = await dashboardContainer.item(dashboardId, dashboardId).read();

  const resAuthGroups = res3.resource.authGroups;

  for (const prop in data.authGroups) {
    for (const [index, el] of data.authGroups[prop]) {
      const indexUpdate = resAuthGroups[prop].findIndex((el2) => el2 === el);

      const res = await dashboardContainer
        .item(dashboardId, dashboardId)
        .patch([
          {
            op: 'remove',
            path: `authGroups/${prop}/${indexUpdate}`,
          },
        ]);

      if (data.authGroups[prop].length - 1 === index) {
        return {
          authGroups: res.resource.authGroups,
          dashboardId: res.resource.id,
          dashboardName: res.resource.name,
        };
      }
    }
  }
};

export const updateDashboardGroupAuth = async (
  data: DashboardGroupAuthUpdateReq,
): Promise<DashboardGroupAuthUpdateRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);
  const dashboardId = data.dashboardId;

  const res3 = await dashboardContainer.item(dashboardId, dashboardId).read();
  const resAuthGroups = res3.resource.authGroups;

  // Prepare patch operations
  const patchOperations = [];

  for (const prop in data.authGroups) {
    for (const [index, el] of data.authGroups[prop].entries()) {
      const indexUpdate = resAuthGroups[prop].findIndex((el2) => el2 !== el);
      if (indexUpdate !== -1) {
        // Add patch operation for each element that needs to be updated
        patchOperations.push({
          op: 'set',
          path: `/authGroups/${prop}/${indexUpdate}`,
          value: el,
        });
      }
    }
  }

  // Perform a single patch operation with all updates
  const res = await dashboardContainer
    .item(dashboardId, dashboardId)
    .patch(patchOperations);

  return {
    authGroups: res.resource.authGroups,
    dashboardId: res.resource.id,
    dashboardName: res.resource.name,
  };
};
