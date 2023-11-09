import {
  DashboardDeleteReq,
  DashboardCreateReq,
  DashboardUpdateReq,
  ReadPaginationFilter,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { DataRoot } from 'pontus-tabler/src/types';
import {
  fetchDashboards,
  fetchDashboardsContainer,
  fetchDatabase,
  filterToQuery,
} from '../utils/cosmos-utils';
import { Container } from '@azure/cosmos';

export const upsertDashboard = async (
  data: DashboardCreateReq | DashboardUpdateReq,
) => {
  try {
    const dashboardContainer = await fetchDashboardsContainer();

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
  const dashboardContainer = await fetchDashboardsContainer();

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
    const dashboardContainer = await fetchDashboardsContainer();
    const res = await dashboardContainer.item(data.id, data.id).delete();

    return 'Dashboard deleted!';
  } catch (error) {
    throw error;
  }
};

export const readDashboards = async (body: ReadPaginationFilter) => {
  // let query = 'select * from dashboards d';

  const query = filterToQuery(body);

  const dashboards = await fetchDashboards(
    'select * from dashboards d' + ' ' + query,
  );

  const countStr = 'select VALUE COUNT(1) from dashboards d' + ' ' + query;

  const totalDashboards = await fetchDashboards(countStr);

  return { totalDashboards: totalDashboards[0] || 4343, dashboards };
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
