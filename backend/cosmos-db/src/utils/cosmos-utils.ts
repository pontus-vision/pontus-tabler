import {
  Container,
  CosmosClient,
  Database,
  DatabaseResponse,
} from '@azure/cosmos';
import { ReadPaginationFilter } from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';

const cosmosClient = new CosmosClient({
  endpoint: process.env.PH_COSMOS_ENDPOINT || 'https://localhost:8081/',
  key:
    process.env.PH_COSMOS_KEY ||
    'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==',
});

export const fetchDatabase = async (
  db_name: string,
): Promise<Database | undefined> => {
  try {
    const { database } = await cosmosClient.databases.createIfNotExists({
      id: db_name,
      throughput: 400,
    });
    return database;
  } catch (error) {
    throw error;
  }
};
export const fetchContainer = async (
  databaseId: string,
  containerId: string,
  partitionKey?: string[],
): Promise<Container | undefined> => {
  try {
    const database = await fetchDatabase(databaseId);

    const { container } = await database.containers.createIfNotExists({
      id: containerId,
      partitionKey: {
        paths: partitionKey || ['/id'],
      },
    });
    return container;
  } catch (error) {
    throw error;
  }
};

export const fetchDashboardsContainer = async (): Promise<
  Container | undefined
> => {
  try {
    const dashboardContainer = await fetchContainer('pv_db', 'dashboards');

    return dashboardContainer;
  } catch (error) {
    throw error;
  }
};

export const filterToQuery = (body: ReadPaginationFilter) => {
  const query = [];

  const cols = body?.filters;

  const { from, to } = body;

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

  return (
    'select * from dashboards d ' +
    query.join('') +
    `${from ? 'OFFSET ' + (from - 1) : ''} ${to ? 'LIMIT ' + (from - to) : ''}`
  );
};
