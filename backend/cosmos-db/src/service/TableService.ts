import {
  ReadPaginationFilter,
  TableCreateReq,
  TableDeleteReq,
  TableReadReq,
  TableUpdateReq,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { FetchData, fetchContainer, fetchData } from '../utils/cosmos-utils';

export const upsertTable = async (data: TableCreateReq | TableUpdateReq) => {
  try {
    const tableContainer = await fetchContainer('pv_db', 'tables');

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
  const tableContainer = await fetchContainer('pv_db', 'tables');

  const { resources } = await tableContainer.items.query(querySpec).fetchAll();
  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw { code: 404, message: 'No table found.' };
  } else {
    throw { code: 409, message: 'There is more than 1 table' };
  }
};

export const deleteTable = async (data: TableDeleteReq) => {
  try {
    const tableContainer = await fetchContainer('pv_db', 'tables');
    const res = await tableContainer.item(data.id, data.id).delete();

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
