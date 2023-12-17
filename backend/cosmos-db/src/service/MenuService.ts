import {
  ReadPaginationFilter,
  MenuCreateReq,
  MenuUpdateReq,
  MenuDeleteReq,
  MenuCreateRes,
  MenuReadRes,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { FetchData, fetchContainer, fetchData } from '../utils/cosmos-utils';

const MENU = 'menu';

export const upsertMenuItem = async (
  data: MenuCreateReq | MenuUpdateReq,
): Promise<MenuCreateRes> => {
  const menuContainer = await fetchContainer(MENU);

  for (const childIdx in data?.children) {
    const childRes = await upsertMenuItem(data.children[childIdx]);
    data.children[childIdx].id = childRes.id;
  }

  const res = await menuContainer.items.upsert(data);

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
  const menuContainer = await fetchContainer(MENU);

  const { resources } = await menuContainer.items.query(querySpec).fetchAll();
  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw { code: 404, message: 'No menu item found.' };
  }
};

export const deleteMenuItem = async (data: MenuDeleteReq) => {
  try {
    const menuContainer = await fetchContainer(MENU);
    const res = await menuContainer.item(data.id, data.id).delete();

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
