import {
  MenuCreateReq,
  MenuUpdateReq,
  MenuDeleteReq,
  MenuCreateRes,
  MenuReadRes,
  MenuItemTreeRef,
} from '../../typescript/api/index';
import { fetchContainer } from '../../cosmos-utils';
import {
  Container,
  ItemResponse,
  PartitionKeyDefinition,
  UniqueKeyPolicy,
} from '@azure/cosmos';
import { BadRequestError, NotFoundError } from '../../generated/api';
import { updateDashboard, createDashboard } from './DashboardService';

const MENU = 'menu';
const DASHBOARDS = 'dashboards';

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
  const menuContainer = await initiateMenuContainer();

  const patchArr = [];
  for (const prop in data) {
    switch (prop) {
      case 'children':
        const child = data[prop][0];

        if (child.kind === 'file') {
          delete child?.children;
        }

        const path = `${data?.path}${data?.path?.endsWith('/') ? '' : '/'}${
          child.name
        }`;

        const res = await menuContainer.items.create({
          ...child,
          path,
        });

        const res2 = await createDashboard({
          id: res.resource.id,
          name: child.name,
        });

        if (res.statusCode === 201) {
          patchArr.push({
            op: 'add',
            path: '/children/-',
            value: res.resource,
          });
        }
        break;
      default:
        break;
    }
  }
  try {
    const res = await menuContainer.item(data.id, data.path).patch(patchArr);
    const { _rid, _self, _etag, _attachments, _ts, ...rest } =
      res.resource as any;
    return rest;
  } catch (error) {
    if (error.code === 404) {
      throw new NotFoundError(
        `Menu item at path '${data.path}' and id '${data.id}' not found.`,
      );
    }
  }
};

export const updateMenuItem = async (
  data: MenuCreateReq | MenuUpdateReq,
): Promise<ItemResponse<MenuCreateRes>> => {
  const menuContainer = await initiateMenuContainer();

  const patchArr = [];

  // Partial Update Docs https://learn.microsoft.com/en-us/azure/cosmos-db/partial-document-update

  const child = data?.children?.[0];

  for (const prop in data) {
    switch (prop) {
      case 'name':
        patchArr.push({ op: 'replace', path: '/name', value: data[prop] });
        break;
      case 'kind':
        patchArr.push({ op: 'replace', path: '/kind', value: data[prop] });
        break;
      case 'children':
        if (data.kind === 'file') break;

        const res = await menuContainer.items.upsert({
          ...child,
          path: `${data?.path}${data?.path?.endsWith('/') ? '' : '/'}${
            child.name
          }`,
        });

        const res2 = (await menuContainer
          .item(data.id, data.path)
          .read()) as ItemResponse<MenuItemTreeRef>;

        const index = res2.resource.children.findIndex(
          (el) => el.id === child.id,
        );

        res.statusCode === 201 &&
          patchArr.push({
            op: 'set',
            path: `/children/${index}`,
            value: res.resource,
          });

        const dashboardContainer = await fetchContainer(DASHBOARDS);

        const res3 = await dashboardContainer
          .item(child.id, child.id)
          .patch([{ op: 'set', path: '/name', value: child.name }]);

        break;
      default:
        break;
    }
  }

  if (patchArr.length === 0) {
    throw { code: 400, message: 'No menu item property defined' };
  }
  const res = await menuContainer.item(data.id, data.path).patch(patchArr);

  await menuContainer.item(child.id, child.path).delete();

  const { _rid, _self, _etag, _attachments, _ts, ...rest } =
    res.resource as any;

  return res;
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

  const { resources, requestCharge } = await menuContainer.items
    .query(querySpec)
    .fetchAll();

  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw { code: 404, message: `No menu item found at path "${path}".` };
  }
};

export const deleteMenuItem = async (data: MenuDeleteReq): Promise<string> => {
  try {
    const menuContainer = await initiateMenuContainer();

    const res = await menuContainer.item(data.id, data.path).delete();
    return 'menu item deleted!';
  } catch (error) {
    throw error;
  }
};
