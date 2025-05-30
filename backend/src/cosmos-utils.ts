import {
  Container,
  ContainerResponse,
  CosmosClient,
  Database,
  DatabaseResponse,
  PartitionKeyDefinition,
  UniqueKeyPolicy,
} from '@azure/cosmos';
import { ReadPaginationFilter } from './typescript/api';
import { authGroupContainerProps } from './service/cosmosdb';
import { filterToQuery } from './utils';
import { AUTH_GROUPS } from './consts';

export interface FetchData {
  count: number;
  values: any[];
}

const cosmosClient = new CosmosClient({
  endpoint: process.env.PH_COSMOS_ENDPOINT || 'https://localhost:8081/',
  key:
    process.env.PH_COSMOS_KEY ||
    'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==',
});

export const cosmosDbName = process.env.COSMOSDB_NAME || 'pv_db';

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

export const deleteContainer = async (
  containerId: string,
): Promise<ContainerResponse> => {
  const container = await fetchContainer(containerId);

  const res = await container.delete();

  return res;
};

export const fetchContainer = async (
  containerId: string,
  partitionKey: string | PartitionKeyDefinition = {
    paths: ['/id'],
  },
  uniqueKeyPolicy: UniqueKeyPolicy | undefined = undefined,
  initialDocs?: Record<any, any>[],
): Promise<Container | undefined> => {
  if (containerId === AUTH_GROUPS) {
    (containerId = authGroupContainerProps.AUTH_GROUPS),
      (uniqueKeyPolicy = authGroupContainerProps.uniqueKeyPolicy),
      (partitionKey = authGroupContainerProps.partitionKey);
  }
  const database = await fetchDatabase(cosmosDbName);

  const { container, statusCode } = await database.containers.createIfNotExists(
    {
      id: containerId,
      partitionKey,
      uniqueKeyPolicy,
    },
  );

  // Creating initial document when container is created
  if (statusCode === 201 && initialDocs) {
    let adminGroup;
    let adminUser;
    for (const doc of initialDocs) {
      const res = await container.items.create(doc);
    }
  }

  return container;
};

export const deleteDatabase = async (
  databaseId: string,
): Promise<DatabaseResponse | undefined> => {
  const database = await fetchDatabase(databaseId);
  return database.delete();
};

export const fetchData = async (
  filter: ReadPaginationFilter,
  table: string,
): Promise<FetchData | undefined> => {
  try {
    const query = filterToQuery(filter);

    const container = await fetchContainer(table);

    const countStr = `select VALUE COUNT(1) from c ${query}`;

    const valuesStr = `select  * from c ${query}`;

    const values = await container.items
      .query({
        query: valuesStr,
        parameters: [],
      })
      .fetchAll();

    const count = await container.items
      .query({ query: countStr, parameters: [] })
      .fetchAll();

    if (values.resources.length === 0) {
      throw { code: 404, message: `No ${table} has been found.` };
    }

    return { count: count.resources[0], values: values.resources };
  } catch (error) {
    throw error;
  }
};



const convertToISOString = (dateString) => {
  const parts = dateString.split(' ');
  const dateParts = parts[0].split('-');
  const timeParts = parts[1].split(':');

  const date = new Date(
    Date.UTC(
      dateParts[0],
      dateParts[1] - 1,
      dateParts[2],
      timeParts[0],
      timeParts[1],
      timeParts[2],
    ),
  );

  const year = date.getUTCFullYear();
  const month = ('0' + (date.getUTCMonth() + 1)).slice(-2); // Months are 0-indexed, so we add 1. Also, we add a leading zero if necessary.
  const day = ('0' + date.getUTCDate()).slice(-2); // Add a leading zero if necessary.
  const hours = ('0' + date.getUTCHours()).slice(-2); // Add a leading zero if necessary.
  const minutes = ('0' + date.getUTCMinutes()).slice(-2); // Add a leading zero if necessary.
  const seconds = ('0' + date.getUTCSeconds()).slice(-2); // Add a leading zero if necessary.

  const isoDateString =
    year +
    '-' +
    month +
    '-' +
    day +
    'T' +
    hours +
    ':' +
    minutes +
    ':' +
    seconds +
    'Z';

  return isoDateString;
};
