import {
  DashboardDeleteReq,
  DashboardCreateReq,
  DashboardUpdateReq,
  ReadPaginationFilter,
  DashboardsReadRes,
} from '../typescript/api';
import { FetchData, fetchContainer, fetchData } from '../cosmos-utils';
import { NotFoundError } from '../generated/api';

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
  } else {
    throw { code: 409, message: 'There is more than 1 dashboard' };
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

//   return resources[0];
// };
