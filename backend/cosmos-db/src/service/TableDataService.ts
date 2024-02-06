import {
  TableDataCreateReq,
  TableDataDeleteReq,
  TableDataReadReq,
  TableDataReadRes,
  TableDataRowRef,
  TableDataUpdateReq,
} from '../typescript/api';
import { fetchContainer, fetchData } from '../cosmos-utils';
import { PatchOperation } from '@azure/cosmos';
import { readTableByName } from './TableService';

const checkTableCols = async (tableName: string, cols: TableDataRowRef) => {
  try {
    const resTable = await readTableByName(tableName);

    const colsChecked = [];

    for (const col in cols) {
      let found = false;
      for (const colReq of resTable?.cols) {
        if (col === colReq?.name) {
          found = true;
          continue;
        }
      }
      if (!found) {
        colsChecked.push(col);
      }
    }

    if (colsChecked?.length > 0) {
      throw {
        code: 400,
        message: {
          string: `Cols are not defined in table: ${colsChecked.join(', ')}`,
          nonExistingFields: Object.keys(cols),
        },
      };
    }
  } catch (error) {
    throw error;
  }
};
export const upsertTableData = async (data: TableDataCreateReq) => {
  try {
    await checkTableCols(data.tableName, data?.cols);

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

    await checkTableCols(data.tableName, data.cols);

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
    const res = await tableDataContainer.item(data.rowId, data.rowId).delete();

    return 'Row deleted!';
  } catch (error) {
    throw error;
  }
};

export const readTableData = async (
  body: TableDataReadReq,
): Promise<TableDataReadRes> => {
  try {
    console.log({ tableName: body.tableName, filters: body.filters });
    const res1 = await checkTableCols(body.tableName, body.filters);
    // console.log({ res1 });
    const res2 = await fetchData(body, body.tableName);
    console.log({ res2 });

    return { rowsCount: res2.count, rows: res2.values };
  } catch (error) {
    throw error;
  }
};
