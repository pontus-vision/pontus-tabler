import {
  InternalServerError,
  ReadPaginationFilter,
  TableCreateReq,
  TableCreateRes,
  TableDeleteReq,
  TableReadReq,
  TableReadRes,
  TableUpdateReq,
  TablesReadRes,
} from '../typescript/api';
import { dbSource, COSMOS_DB, DELTA_DB } from './AuthGroupService';
import * as cdb from './cosmosdb/index';
import * as deltadb from './delta/index';

export const createTable = async (
  data: TableCreateReq,
): Promise<TableCreateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.createTable(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.createTable(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const updateTable = async (data: TableUpdateReq) => {
  if (dbSource === COSMOS_DB) {
    return cdb.updateTable(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.updateTable(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readTableById = async (
  data: TableReadReq,
): Promise<TableReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.readTableById(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readTableById(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readTableByName = async (name: string): Promise<TableReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.readTableByName(name);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readTableByName(name);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const deleteTable = async (data: TableDeleteReq) => {
  if (dbSource === COSMOS_DB) {
    return cdb.deleteTable(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.deleteTable(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readTables = async (
  body: ReadPaginationFilter,
): Promise<TablesReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.readTables(body);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readTables(body);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};
