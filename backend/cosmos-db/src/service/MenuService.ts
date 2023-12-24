import {
  ReadPaginationFilter,
  MenuCreateReq,
  MenuUpdateReq,
  MenuDeleteReq,
  MenuCreateRes,
  MenuReadRes,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { FetchData, fetchContainer, fetchData } from '../utils/cosmos-utils';
import { PartitionKeyDefinition, UniqueKeyPolicy } from '@azure/cosmos';
import e = require('express');

const MENU = 'menu';

const partitionKey: string | PartitionKeyDefinition = {
  paths: ['/path'],
};

const uniqueKeyPolicy: UniqueKeyPolicy = {
  uniqueKeys: [{ paths: ['/path'] }],
};

export const upsertMenuItem = async (
  data: MenuCreateReq | MenuUpdateReq,
): Promise<MenuCreateRes> => {
  const menuContainer = await fetchContainer(
    MENU,
    partitionKey,
    uniqueKeyPolicy,
  );

  for (const childIdx in data?.children) {
    const childRes = await upsertMenuItem(data.children[childIdx]);
    data.children[childIdx].id = childRes.id;
  }

  const res = await menuContainer.items.upsert(data);

  const { _rid, _self, _etag, _attachments, _ts, ...rest } =
    res.resource as any;

  return rest;
};

// export const createMenuItem = async (
//   data: MenuCreateReq,
// ): Promise<MenuCreateRes | any> => {
//   const menuContainer = await fetchContainer(
//     MENU,
//     partitionKey,
//     uniqueKeyPolicy,
//   );

//   for (const childIdx in data?.children) {
//     const childRes = await createMenuItem(data?.children[childIdx]);
//     data.children[childIdx].id = childRes.id;
//   }
//   const res = await menuContainer.items.upsert(data);
//   console.log({ res });

//   const { _rid, _self, _etag, _attachments, _ts, ...rest } =
//     res.resource as any;

//   return rest;
// };

export const createMenuItem = async (
  data: MenuCreateReq,
): Promise<MenuCreateRes | any> => {
  const menuContainer = await fetchContainer(
    MENU,
    partitionKey,
    uniqueKeyPolicy,
  );

  const res = await menuContainer.items.create(data);
  const { _rid, _self, _etag, _attachments, _ts, ...rest } =
    res.resource as any;
  return rest;
};

export const updateMenuItem = async (
  data: MenuCreateReq | MenuUpdateReq,
): Promise<MenuCreateRes> => {
  const menuContainer = await fetchContainer(
    MENU,
    partitionKey,
    uniqueKeyPolicy,
  );

  const patchArr = [];

  for (const prop in data) {
    switch (prop) {
      case 'name':
        patchArr.push({ op: 'replace', path: '/name', value: data[prop] });
        break;
      case 'kind':
        patchArr.push({ op: 'replace', path: '/kind', value: data[prop] });
        break;
      case 'children':
        const res = await menuContainer.items.upsert(data[prop][0]);
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

  function changeLastPart(str, newPart) {
    var n = str.lastIndexOf('/');
    var result = str.substring(0, n + 1) + newPart;
    return result;
  }

  // patchArr.push({
  //   op: 'replace',
  //   path: '/path',
  //   value: changeLastPart(data.path, data.name),
  // });

  console.log({ id: data.id, path: data.path, patchArr });

  const res = await menuContainer.item(data.id, data.path).patch(patchArr);

  const { _rid, _self, _etag, _attachments, _ts, ...rest } =
    res.resource as any;

  return rest;
};

export const readMenuItemByPath = async (
  path: string,
): Promise<MenuReadRes | any> => {
  const querySpec = {
    query: 'select * from menu p where p.path=@path',
    parameters: [
      {
        name: '@path',
        value: path,
      },
    ],
  };
  const menuContainer = await fetchContainer(
    MENU,
    partitionKey,
    uniqueKeyPolicy,
  );

  const { resources } = await menuContainer.items.query(querySpec).fetchAll();
  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw { code: 404, message: `No menu item found at path "${path}".` };
  } else if (resources.length > 1) {
    throw { code: 409, message: 'More than 1 record found.' };
  }
};

export const deleteMenuItem = async (data: MenuDeleteReq) => {
  try {
    const menuContainer = await fetchContainer(
      MENU,
      partitionKey,
      uniqueKeyPolicy,
    );
    const res = await menuContainer.item(data.id, data.path).delete();

    return 'menu item deleted!';
  } catch (error) {
    throw error;
  }
};

// export const readMenu = async (
//   body: ReadPaginationFilter,
// ): Promise<FetchData> => {
//   return fetchData(body, MENU);
// };

// export const countDashboardsRecords = async (
//   query: string,
// ): Promise<number> => {
//   const menuContainer = await fetchDashboardsContainer(query);
//   const { resources } = await menuContainer.items
//     .query({ query, parameters: [] })
//     .fetchAll();

//   return resources[0];
// };
