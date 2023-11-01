import {
  DashboardDeleteReq,
  DashboardCreateReq,
  DashboardUpdateReq,
  ReadPaginationFilter,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { DataRoot } from 'pontus-tabler/src/types';
import {
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
    console.log(resources);

    throw { code: 404, message: 'No dashboard found.' };
  } else {
    throw { code: 409, message: 'There is more than 1 dashboard' };
  }
};

export const deleteDashboard = async (data: DashboardDeleteReq) => {
  try {
    const dashboardContainer = await fetchDashboardsContainer();
    const res = await dashboardContainer.item(data.id, data.id).delete();
    console.log(res, data.id);

    return 'Dashboard deleted!';
  } catch (error) {
    console.log(error, data.id);
    throw error;
  }
};

export const readDashboards = async (body: ReadPaginationFilter) => {
  // let query = 'select * from dashboards d';

  const query = filterToQuery(body);

  const querySpec = {
    query,
    parameters: [],
  };

  const dashboardContainer = await fetchDashboardsContainer();
  console.log({ query: querySpec.query });
  const { resources } = await dashboardContainer.items
    .query(querySpec)
    .fetchAll();

  console.log({});
  console.log({ resources });
  if (resources.length === 0) {
    throw { code: 404, message: 'No dashboard has been found.' };
  }

  return resources;
};

export const countDashboardsRecords = async (): Promise<number> => {
  const dashboardContainer = await fetchDashboardsContainer();
  const { resources } = await dashboardContainer.items
    .query({ query: 'SELECT VALUE COUNT(1) FROM dashboards', parameters: [] })
    .fetchAll();

  return resources[0];
};
