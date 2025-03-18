import {
  MenuCreateReq,
  MenuUpdateReq,
  MenuDeleteReq,
  MenuCreateRes,
  MenuReadRes,
  MenuItemTreeRef,
} from '../typescript/api/index';

import { InternalServerError } from '../generated/api';
import * as cdb from './cosmosdb/index';
import * as deltadb from './delta/index';
import { COSMOS_DB, dbSource, DELTA_DB } from '../consts';
import { ItemResponse } from '@azure/cosmos';

export const createMenuItem = async (
  data: MenuCreateReq,
): Promise<MenuCreateRes | any> => {
  if (dbSource === COSMOS_DB) {
    return cdb.createMenuItem(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.createMenuItem(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const updateMenuItem = async (
  data: MenuCreateReq | MenuUpdateReq,
): Promise<MenuCreateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.updateMenuItem(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.updateMenuItem(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readMenuItemByPath = async (
  path: string,
): Promise<MenuReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.readMenuItemByPath(path);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readMenuTree(path);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const deleteMenuItem = async (data: MenuDeleteReq): Promise<string> => {
  if (dbSource === COSMOS_DB) {
    return cdb.deleteMenuItem(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.deleteMenuItem(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};
