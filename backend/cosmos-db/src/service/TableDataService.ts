import {
  ReadPaginationFilter,
  TableCreateReq,
  TableDataCreateReq,
  TableDataDeleteReq,
  TableDataReadReq,
  TableDataUpdateReq,
  TableDeleteReq,
  TableReadReq,
  TableUpdateReq,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { FetchData, fetchContainer, fetchData } from '../utils/cosmos-utils';
import { PatchOperation } from '@azure/cosmos';

export const upsertTableData = async (data: TableDataCreateReq) => {
  try {
    const tableDataContainer = await fetchContainer(data.tableName);

    const res = await tableDataContainer.items.upsert(data.cols);
    const { _rid, _self, _etag, _attachments, _ts, ...rest } =
      res.resource as any;

    return rest;
  } catch (error) {
    throw error;
  }
};

export const updateTableData = async (data: TableDataUpdateReq) => {
  try {
    const tableDataContainer = await fetchContainer(data.tableName);

    // const res = await tableDataContainer.items.upsert({
    //   ...data.cols,
    //   id: data.rowId,
    // });
    // const { _rid, _self, _etag, _attachments, _ts, ...rest } =
    //   res.resource as any;

    // return rest;

    const patchArr: PatchOperation[] = [];

    for (const prop in data.cols) {
      patchArr.push({
        op: 'replace',
        path: `/${prop}`,
        value: data.cols[prop],
      });
    }

    patchArr.forEach((arr) =>
      console.log({ arr, rowId: data.rowId, container: data.tableName }),
    );

    const res = await tableDataContainer
      .item(data.rowId, data.rowId)
      .patch(patchArr);

    const { _rid, _self, _etag, _attachments, _ts, ...rest } =
      res.resource as any;

    return rest;
  } catch (error) {
    throw error;
  }
};

// export const readTableById = async (data: TableDataReadReq) => {
//   const querySpec = {
//     query: `select * from ${} p where p.id=@rowId`,
//     parameters: [
//       {
//         name: '@rowId',
//         value: data.id,
//       },
//     ],
//   };
//   const tableDataContainer = await fetchContainer(data.tableName);

//   const { resources } = await tableDataContainer.items
//     .query(querySpec)
//     .fetchAll();
//   if (resources.length === 1) {
//     return resources[0];
//   } else if (resources.length === 0) {
//     throw { code: 404, message: 'No table found.' };
//   }
// };

export const deleteTableData = async (data: TableDataDeleteReq) => {
  try {
    const tableDataContainer = await fetchContainer(data.tableName);
    const res = await tableDataContainer.item(data.id, data.id).delete();

    return 'Table deleted!';
  } catch (error) {
    throw error;
  }
};

export const readTableData = async (
  body: TableDataReadReq,
): Promise<FetchData> => {
  try {
    console.log({ body });
    return fetchData(body, body.tableName);
  } catch (error) {
    throw error;
  }
};
