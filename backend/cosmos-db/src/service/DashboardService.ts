import {
  DashboardDeleteReq,
  DashboardCreateReq,
  DashboardUpdateReq,
  ReadPaginationFilter,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { DataRoot } from 'pontus-tabler/src/types';
import { FetchData, fetchContainer, fetchData } from '../utils/cosmos-utils';

export const upsertDashboard = async (
  data: DashboardCreateReq | DashboardUpdateReq,
) => {
  try {
    const dashboardContainer = await fetchContainer('pv_db', 'dashboards');

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
  const dashboardContainer = await fetchContainer('pv_db', 'dashboards');

  const { resources } = await dashboardContainer.items
    .query(querySpec)
    .fetchAll();
  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw { code: 404, message: 'No dashboard found.' };
  } else {
    throw { code: 409, message: 'There is more than 1 dashboard' };
  }
};

export const deleteDashboard = async (data: DashboardDeleteReq) => {
  try {
    const dashboardContainer = await fetchContainer('pv_db', 'dashboards');
    const res = await dashboardContainer.item(data.id, data.id).delete();

    return 'Dashboard deleted!';
  } catch (error) {
    throw error;
  }
};

export const readDashboards = async (
  body: ReadPaginationFilter,
): Promise<FetchData> => {
  return fetchData(body, 'dashboards');
};

// export const countDashboardsRecords = async (
//   query: string,
// ): Promise<number> => {
//   const dashboardContainer = await fetchDashboardsContainer(query);
//   const { resources } = await dashboardContainer.items
//     .query({ query, parameters: [] })
//     .fetchAll();

//   return resources[0];
// };
