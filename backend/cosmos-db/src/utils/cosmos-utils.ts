import {
  Container,
  CosmosClient,
  Database,
  DatabaseResponse,
} from '@azure/cosmos';

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
    console.error(error);
  }
};
export const fetchContainer = async (
  databaseId: string,
  containerId: string,
  partitionKey?: string[],
): Promise<Container> => {
  const database = await fetchDatabase(databaseId);

  const { container } = await database.containers.createIfNotExists({
    id: containerId,
    partitionKey: {
      paths: partitionKey || ['/id'],
    },
  });

  return container;
};

export const fetchDashboardsContainer = async (): Promise<Container> => {
  try {
    const dashboardContainer = await fetchContainer('pv_db', 'dashboards');

    return dashboardContainer;
  } catch (error) {
    throw error;
  }
};
