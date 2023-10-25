import {
  DashboardDeleteReq,
  DashboardCreateReq,
  DashboardUpdateReq,
  ReadPaginationFilter,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { DataRoot } from 'pontus-tabler/src/types';
import { fetchDashboardsContainer, fetchDatabase } from '../utils/cosmos-utils';
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
  const query = [];

  const cols = body?.filters;

  for (const colId in cols) {
    console.log(colId);
    if (cols.hasOwnProperty(colId)) {
      const condition1Filter = cols[colId]?.condition1?.filter;
      const condition2Filter = cols[colId]?.condition2?.filter;

      const type1 = cols[colId]?.condition1?.type.toLowerCase();
      const type2 = cols[colId]?.condition2?.type.toLowerCase();

      const operator = cols[colId]?.operator;

      if (condition1Filter && type1 === 'contains') {
        query.push(` WHERE CONTAINS(d.${colId}, "${condition1Filter}")`);
      }

      if (condition2Filter && type2 === 'contains') {
        query.push(` ${operator} CONTAINS(d.${colId}, "${condition2Filter}")`);
      }

      if (condition1Filter && type1 === 'not contains') {
        query.push(` WHERE NOT CONTAINS(d.${colId}, "${condition1Filter}")`);
      }

      if (condition2Filter && type2 === 'not contains') {
        query.push(
          ` ${operator} NOT CONTAINS(d.${colId}, "${condition2Filter}")`,
        );
      }

      if (condition1Filter && type1 === 'starts with') {
        query.push(` WHERE STARTSWITH(d.${colId}, "${condition1Filter}")`);
      }

      if (condition2Filter && type2 === 'starts with') {
        query.push(
          ` ${operator} STARTSWITH(d.${colId}, "${condition2Filter}")`,
        );
      }

      if (condition1Filter && type1 === 'ends with') {
        query.push(` WHERE ENDSWITH(d.${colId}, "${condition1Filter}")`);
      }

      if (condition2Filter && type2 === 'ends with') {
        query.push(` ${operator} ENDSWITH(d.${colId}, "${condition2Filter}")`);
      }

      if (condition1Filter && type1 === 'equals') {
        query.push(` WHERE d.${colId} = "${condition1Filter}"`);
      }

      if (condition2Filter && type2 === 'equals') {
        query.push(` ${operator} d.${colId} = "${condition2Filter}"`);
      }

      if (condition1Filter && type1 === 'not equals') {
        query.push(` WHERE NOT d.${colId} = "${condition1Filter}"`);
      }

      if (condition2Filter && type2 === 'not equals') {
        query.push(` ${operator} NOT d.${colId} = "${condition2Filter}"`);
      }
    }
  }

  for (let i = 0; i < query.length; i++) {
    // Replace the first occurrence of "WHERE" with "AND" in each element
    if (i > 0) {
      query[i] = query[i].replace('WHERE', 'AND');
    }
  }

  const querySpec = {
    query: 'select * from dashboards d ' + query.join(''),
    parameters: [
      {
        name: '@colId',
        value: Object.keys(body?.filters)[0],
      },
      {
        name: '@offset',
        value: body.from - 1,
      },
      {
        name: '@limit',
        value: body.to - body.from + 1,
      },
    ],
  };

  const dashboardContainer = await fetchDashboardsContainer();

  const { resources } = await dashboardContainer.items
    .query(querySpec)
    .fetchAll();

  if (resources.length === 0) {
    throw { code: 404, message: 'No dashboard has been found.' };
  }

  return resources;
};
