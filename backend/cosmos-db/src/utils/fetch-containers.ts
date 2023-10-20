import { Container } from '@azure/cosmos';
import { fetchDatabase } from './cosmos-utils';

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
