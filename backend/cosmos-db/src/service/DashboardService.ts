import { CosmosClient } from '@azure/cosmos';
import {
  DashboardDeleteReq,
  DashboardCreateReq,
  DashboardUpdateReq,
  ReadPaginationFilter,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { DataRoot } from 'pontus-tabler/src/types';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const cosmosClient = new CosmosClient({
  endpoint: process.env.PH_COSMOS_ENDPOINT || 'https://localhost:8081/',
  key:
    process.env.PH_COSMOS_KEY ||
    'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==',
});

const fetchDatabase = async () => {
  try {
    const { database } = await cosmosClient.databases.createIfNotExists({
      id: 'cosmicworks',
      throughput: 400,
    });
    return database;
  } catch (error) {
    console.error(error);
  }
};

const fetchDashboardContainer = async () => {
  const database = await fetchDatabase();

  const { container: dashboardsContainer } =
    await database.containers.createIfNotExists({
      id: 'dashboards',
      partitionKey: {
        paths: ['/id'],
      },
    });

  return dashboardsContainer;
};

export const upsertDashboard = async (
  data: DashboardCreateReq | DashboardUpdateReq,
) => {
  try {
    const dashboardContainer = await fetchDashboardContainer();

    const res = await dashboardContainer.items.upsert(data);
    const { _rid, _self, _etag, _attachments, _ts, ...rest } =
      res.resource as any;

    return rest;
  } catch (error) {
    throw error;
  }
};

export const readDashboardById = async (dashboardId: string) => {
  try {
    const querySpec = {
      query: 'select * from dashboards p where p.id=@dashboardId',
      parameters: [
        {
          name: '@dashboardId',
          value: dashboardId,
        },
      ],
    };
    const dashboardContainer = await fetchDashboardContainer();

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
  } catch (error) {
    throw error;
  }
};

export const deleteDashboard = async (data: DashboardDeleteReq) => {
  try {
    const dashboardContainer = await fetchDashboardContainer();
    const res = await dashboardContainer.item(data.id, data.id).delete();
    console.log(res, data.id);

    return 'Dashboard deleted!';
  } catch (error) {
    console.log(error, data.id);
    throw error;
  }
};

// Get items

// for (const item of resources) {
//   console.log(`${item.id}: ${item.name}, ${item.sku}`);
// }

export function camelCaseString(inputString) {
  // Split the string by spaces
  const words = inputString.split(' ');

  // Capitalize the first letter of each word (except the first word)
  for (let i = 0; i < words.length; i++) {
    if (i === 0) {
      words[i] = words[i][0].toLowerCase() + words[i].substring(1);
    } else {
      words[i] = words[i][0].toUpperCase() + words[i].substring(1);
    }
  }

  // Join the words together without spaces
  return words.join('');
}

export const readDashboards = async (body: ReadPaginationFilter) => {
  try {
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

        if (condition1Filter && type1 === 'contains') {
          query.push(` WHERE CONTAINS(d.${colId}, "${condition1Filter}")`);
        }

        if (condition2Filter && type2 === 'contains') {
          query.push(` AND CONTAINS(d.${colId}, "${condition2Filter}")`);
        }

        if (condition1Filter && type1 === 'not contains') {
          query.push(` WHERE NOT CONTAINS(d.${colId}, "${condition1Filter}")`);
        }

        if (condition2Filter && type2 === 'not contains') {
          query.push(` AND NOT CONTAINS(d.${colId}, "${condition2Filter}")`);
        }

        if (condition1Filter && type1 === 'starts with') {
          query.push(` WHERE STARTSWITH(d.${colId}, "${condition1Filter}")`);
        }

        if (condition2Filter && type2 === 'starts with') {
          query.push(` AND STARTSWITH(d.${colId}, "${condition2Filter}")`);
        }

        if (condition1Filter && type1 === 'ends with') {
          query.push(` WHERE ENDSWITH(d.${colId}, "${condition1Filter}")`);
        }

        if (condition2Filter && type2 === 'ends with') {
          query.push(` AND ENDSWITH(d.${colId}, "${condition2Filter}")`);
        }

        if (condition1Filter && type1 === 'equals') {
          query.push(` WHERE d.${colId} = "${condition1Filter}"`);
        }

        if (condition2Filter && type2 === 'equals') {
          query.push(` AND WHERE d.${colId} = "${condition2Filter}")`);
        }

        if (condition1Filter && type1 === 'not equals') {
          query.push(` WHERE NOT d.${colId} = "${condition1Filter}"`);
        }

        if (condition2Filter && type2 === 'not equals') {
          query.push(` AND WHERE NOT d.${colId} = "${condition2Filter}")`);
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

    const dashboardContainer = await fetchDashboardContainer();
    console.log({ dashboardContainer });
    const { resources } = await dashboardContainer.items
      .query(querySpec)
      .fetchAll();

    console.log({ resources });
    if (resources.length === 0) {
      throw { code: 404, message: 'No dashboard has been found.' };
    }

    return resources;
  } catch (error) {
    throw error;
  }
};
