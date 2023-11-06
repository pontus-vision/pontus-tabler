import { CosmosClient } from '@azure/cosmos';
import {
  DashboardDeleteReq,
  DashboardCreateReq,
  DashboardUpdateReq,
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
      id: 'tables',
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
    } else {
      throw new Error('There is more than 1 dashboard');
    }
  } catch (error) {
    throw error;
  }
};

export const deleteDashboard = async (data: DashboardDeleteReq) => {
  try {
    const dashboardContainer = await fetchDashboardContainer();

    const res = await dashboardContainer.item(data.id, data.id).delete();

    return res.item;
  } catch (error) {
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
