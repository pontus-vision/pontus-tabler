import {
  MenuCreateReq,
  MenuUpdateReq,
  MenuDeleteReq,
  MenuCreateRes,
  MenuReadRes,
  MenuItemTreeRef,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { fetchContainer } from '../utils/cosmos-utils';
import {
  Container,
  PartitionKeyDefinition,
  UniqueKeyPolicy,
} from '@azure/cosmos';

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

const initiateMenuContainer = async (): Promise<Container> => {
  const menuContainer = await fetchContainer(
    MENU,
    partitionKey,
    uniqueKeyPolicy,
    initialDoc,
  );

  return menuContainer;
};

export const createMenuItem = async (
  data: MenuCreateReq,
): Promise<MenuCreateRes | any> => {
  const menuContainer = await initiateMenuContainer();

  const res = await menuContainer.items.create(data);
  const { _rid, _self, _etag, _attachments, _ts, ...rest } =
    res.resource as any;
  return rest;
};

export const updateMenuItem = async (
  data: MenuCreateReq | MenuUpdateReq,
): Promise<MenuCreateRes> => {
  const menuContainer = await initiateMenuContainer();

  const patchArr = [];

  // Partial Update Docs https://learn.microsoft.com/en-us/azure/cosmos-db/partial-document-update

  for (const prop in data) {
    switch (prop) {
      case 'name':
        patchArr.push({ op: 'replace', path: '/name', value: data[prop] });
        break;
      case 'kind':
        patchArr.push({ op: 'replace', path: '/kind', value: data[prop] });
        break;
      case 'children':
        const child = data[prop][0];
        const res = await menuContainer.items.upsert({
          ...child,
          path: `${data.path}${data.path.endsWith('/') ? '' : '/'}${
            child.name
          }`,
        });
        res.statusCode === 201 &&
          patchArr.push({
            op: 'add',
            path: '/children/-',
            value: res.resource,
          });

        break;
      default:
        break;
    }
  }

  const res = await menuContainer.item(data.id, data.path).patch(patchArr);

  const { _rid, _self, _etag, _attachments, _ts, ...rest } =
    res.resource as any;

  return rest;
};

export const readMenuItemByPath = async (
  path: string,
): Promise<MenuReadRes> => {
  const querySpec = {
    query: 'select * from menu p where p.path=@path',
    parameters: [
      {
        name: '@path',
        value: path,
      },
    ],
  };
  const menuContainer = await initiateMenuContainer();

  const { resources } = await menuContainer.items.query(querySpec).fetchAll();
  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw { code: 404, message: `No menu item found at path "${path}".` };
  } 
};

export const deleteMenuItem = async (data: MenuDeleteReq) => {
  try {
    const menuContainer = await initiateMenuContainer();

    const res = await menuContainer.item(data.id, data.path).delete();

    return 'menu item deleted!';
  } catch (error) {
    throw error;
  }
};
