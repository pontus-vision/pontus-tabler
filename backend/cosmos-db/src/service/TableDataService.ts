import {
  InternalServerError,
  TableDataCreateReq,
  TableDataDeleteReq,
  TableDataReadReq,
  TableDataReadRes,
  TableDataUpdateReq,
} from '../typescript/api';
import { dbSource, COSMOS_DB, DELTA_DB } from './AuthGroupService';
import * as cdb from './cosmosdb';
import * as deltadb from './delta';

export const createTableData = async (data: TableDataCreateReq) => {
  if (dbSource === COSMOS_DB) {
    return cdb.createTableData(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.createTableData(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const updateTableData = async (data: TableDataUpdateReq) => {
  if (dbSource === COSMOS_DB) {
    return cdb.updateTableData(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.updateTableData(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const deleteTableData = async (data: TableDataDeleteReq) => {
  if (dbSource === COSMOS_DB) {
    return cdb.deleteTableData(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.deleteTableData(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readTableData = async (
  body: TableDataReadReq,
): Promise<TableDataReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.deleteTableData(body);
  } else if (dbSource === DELTA_DB) {
    return deltadb.deleteTableData(body);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};
