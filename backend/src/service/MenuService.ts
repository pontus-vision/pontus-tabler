import {
  MenuCreateReq,
  MenuUpdateReq,
  MenuDeleteReq,
  MenuCreateRes,
  MenuReadRes,
  MenuItemTreeRef,
} from '../typescript/api/index';
import { fetchContainer } from '../cosmos-utils';
import {
  Container,
  ItemResponse,
  PartitionKeyDefinition,
  UniqueKeyPolicy,
} from '@azure/cosmos';
import { InternalServerError } from '../generated/api';
import { dbSource, COSMOS_DB, DELTA_DB } from './AuthGroupService';
import * as cdb from './cosmosdb/index';
import * as deltadb from './delta/index';

const MENU = 'menu';

const partitionKey: string | PartitionKeyDefinition = {
  paths: ['/path'],
};

const uniqueKeyPolicy: UniqueKeyPolicy = {
  uniqueKeys: [{ paths: ['/path'] }],
};

const initialDoc: MenuItemTreeRef = {
  name: '/',
  kind: 'folder',
  path: '/',
  children: [],
};

export const initiateMenuContainer = async (): Promise<Container> => {
  const menuContainer = await fetchContainer(
    MENU,
    partitionKey,
    uniqueKeyPolicy,
    [initialDoc],
  );

  return menuContainer;
};

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
): Promise<ItemResponse<MenuCreateRes>> => {
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
    return deltadb.readMenuItemByPath(path);
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
