import {
  DashboardDeleteReq,
  DashboardCreateReq,
  DashboardUpdateReq,
  ReadPaginationFilter,
  DashboardsReadRes,
  DashboardGroupAuthCreateReq,
  DashboardGroupAuthCreateRes,
  DashboardGroupAuth,
} from '../typescript/api';
import { FetchData, fetchContainer, fetchData } from '../cosmos-utils';
import { NotFoundError } from '../generated/api';
import { ItemResponse } from '@azure/cosmos';

const DASHBOARDS = 'dashboards';

export const upsertDashboard = async (
  data: DashboardCreateReq | DashboardUpdateReq,
) => {
  try {
    const dashboardContainer = await fetchContainer(DASHBOARDS);

    const res = await dashboardContainer.items.upsert(data);
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

  const authPermsArr = [];

  for (const prop in data.authGroups) {
    authPermsArr.push(prop);
  }

  const query = `select ${authPermsArr
    .map((el) => `c.authGroups.${el}`)
    .join(', ')}  from c where c.id=@dashboardId`;

  const querySpec = {
    query,
    parameters: [
      {
        name: '@dashboardId',
        value: dashboardId,
      },
    ],
  };

  const res2 = await dashboardContainer.items.query(querySpec).fetchNext();

  const authGroups = res2.resources[0];

  let isAuthGroupEmpty = true;

  for (const prop in data.authGroups) {
    if (authGroups[prop]) {
      isAuthGroupEmpty = false;
    }
  }

  if (isAuthGroupEmpty) {
    const res = await dashboardContainer.item(dashboardId, dashboardId).patch([
      {
        op: 'add',
        path: '/authGroups',
        value: data.authGroups,
      },
    ]);

    return {
      authGroups: res.resource.authGroups,
      dashboardId,
      dashboardName: res.resource.name,
    };
  } else {
    for (const prop in data.authGroups) {
      if (!authGroups[prop] || !Array.isArray(authGroups[prop])) {
        const res = await dashboardContainer
          .item(dashboardId, dashboardId)
          .patch([
            {
              op: 'add',
              path: `/authGroups/${prop}`,
              value: data.authGroups[prop],
            },
          ]);
        return {
          authGroups: res.resource.authGroups,
          dashboardId,
          dashboardName: res.resource.name,
        };
      } else {
        for (const [index, el] of data.authGroups[prop].entries()) {
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
    }
  }
};
