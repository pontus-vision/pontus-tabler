import {
  ReadPaginationFilter,
  TableCreateReq,
  TableCreateRes,
  TableDeleteReq,
  TableReadReq,
  TableReadRes,
  TableUpdateReq,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import {
  FetchData,
  fetchContainer,
  fetchData,
  deleteContainer,
} from '../utils/cosmos-utils';
import { PartitionKeyDefinition, UniqueKeyPolicy } from '@azure/cosmos';
import { deleteTableData } from './TableDataService';

const TABLES = 'tables';

const partitionKey: string | PartitionKeyDefinition = {
  paths: ['/name'],
};

const uniqueKeyPolicy: UniqueKeyPolicy = {
  uniqueKeys: [{ paths: ['/name'] }],
};

export const createTable = async (
  data: TableCreateReq,
): Promise<{ code: number; body: TableCreateRes }> => {
  const tableContainer = await fetchContainer(
    TABLES,
    partitionKey,
    uniqueKeyPolicy,
  );

  const res = await tableContainer.items.create(data);
  const { _rid, _self, _etag, _attachments, _ts, ...rest } =
    res.resource as any;

  // return rest;

  return { code: res.statusCode, body: rest };
};

export const upsertTable = async (data: TableCreateReq | TableUpdateReq) => {
  try {
    const tableContainer = await fetchContainer(
      TABLES,
      partitionKey,
      uniqueKeyPolicy,
    );

    const res = await tableContainer.items.upsert(data);
    const { _rid, _self, _etag, _attachments, _ts, ...rest } =
      res.resource as any;

    return rest;
  } catch (error) {
    throw error;
  }
};

export const readTableById = async (data: TableReadReq) => {
  const querySpec = {
    query: 'select * from tables p where p.id=@tableId',
    parameters: [
      {
        name: '@tableId',
        value: data.id,
      },
    ],
  };
  const tableContainer = await fetchContainer(
    TABLES,
    partitionKey,
    uniqueKeyPolicy,
  );

  const { resources } = await tableContainer.items.query(querySpec).fetchAll();
  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw { code: 404, message: 'No table found.' };
  }
};

export const readTableByName = async (name: string): Promise<TableReadRes> => {
  const querySpec = {
    query: 'select * from tables p where p.name=@tableName',
    parameters: [
      {
        name: '@tableName',
        value: name,
      },
    ],
  };

  const tableContainer = await fetchContainer(
    TABLES,
    partitionKey,
    uniqueKeyPolicy,
  );

  const { resources } = await tableContainer.items.query(querySpec).fetchAll();

  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw { code: 404, message: 'No table found.' };
  }
};

export const deleteTable = async (data: TableDeleteReq) => {
  try {
    const tableContainer = await fetchContainer(
      TABLES,
      partitionKey,
      uniqueKeyPolicy,
    );
    const res = await tableContainer.item(data.id, data.name).delete();

    const res2 = (await fetchContainer(data.name)).read();

    console.log({ res2StatusCode: (await res2).statusCode });

    if ((await res2).statusCode === 200) {
      const res3 = await deleteContainer(data.name);
    }

    return 'Table deleted!';
  } catch (error) {
    throw error;
  }
};

export const readTables = async (
  body: ReadPaginationFilter,
): Promise<FetchData> => {
  return fetchData(body, 'tables');
};
