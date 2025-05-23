import {
  ReadPaginationFilter,
  TableCreateReq,
  TableCreateRes,
  TableDeleteReq,
  TableReadReq,
  TableReadRes,
  TableUpdateReq,
  TablesReadRes,
} from '../../typescript/api';
import { deleteContainer, fetchContainer, fetchData } from '../../cosmos-utils';
import {
  Container,
  PartitionKeyDefinition,
  UniqueKeyPolicy,
} from '@azure/cosmos';
import { NotFoundError } from '../../generated/api/resources';
import { TABLES } from '../../consts';


const partitionKey: string | PartitionKeyDefinition = {
  paths: ['/name'],
};

const uniqueKeyPolicy: UniqueKeyPolicy = {
  uniqueKeys: [{ paths: ['/name'] }],
};

export const initiateTableContainer = async (): Promise<Container> => {
  return await fetchContainer(TABLES, partitionKey, uniqueKeyPolicy);
};

export const createTable = async (
  data: TableCreateReq,
): Promise<TableCreateRes> => {
  const tableContainer = await initiateTableContainer();

  const res = await tableContainer.items.create(data);
  const { _rid, _self, _etag, _attachments, _ts, ...rest } =
    res.resource as any;

  // return rest;

  return rest;
};

export const updateTable = async (data: TableUpdateReq) => {
  try {
    const tableContainer = await initiateTableContainer();

    const res = await tableContainer.items.upsert(data);
    const { _rid, _self, _etag, _attachments, _ts, ...rest } =
      res.resource as any;

    return rest;
  } catch (error) {
    throw error;
  }
};

export const readTableById = async (
  data: TableReadReq,
): Promise<TableReadRes> => {
  const querySpec = {
    query: 'select * from tables p where p.id=@tableId',
    parameters: [
      {
        name: '@tableId',
        value: data.id,
      },
    ],
  };
  const tableContainer = await initiateTableContainer();

  const { resources } = await tableContainer.items.query(querySpec).fetchAll();

  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw new NotFoundError('Table not found');
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

  const tableContainer = await initiateTableContainer();

  const { resources } = await tableContainer.items.query(querySpec).fetchAll();

  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw { code: 404, message: 'No table found.' };
  }
};

export const deleteTable = async (data: TableDeleteReq) => {
  try {
    const tableContainer = await initiateTableContainer();
    const res = await tableContainer.item(data.id, data.name).delete();

    const res2 = (await fetchContainer(data.name)).read();

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
): Promise<TablesReadRes> => {
  const res = await fetchData(body, 'tables');
  return { totalTables: res.count, tables: res.values };
};
