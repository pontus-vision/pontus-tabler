import {
  TableDataCreateReq,
  TableDataDeleteReq,
  TableDataReadReq,
  TableDataReadRes,
  TableDataRowRef,
  TableDataUpdateReq,
} from '../../typescript/api';
import { fetchContainer, fetchData } from '../../cosmos-utils';
import { PatchOperation } from '@azure/cosmos';
import { readTableByName } from './TableService';
import { v4 as uuidv4 } from 'uuid';

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
        message: `Cols are not defined in table: ${colsChecked.join(', ')}`,
      };
    }
  } catch (error) {
    throw error;
  }
};
export const createTableData = async (data: TableDataCreateReq) => {
  try {
    await checkTableCols(data.tableName, data?.cols);

    const uuid = uuidv4();


    const dataRow = { ...data.cols, edges: [], id: uuid };

    const tableDataContainer = await fetchContainer(data.tableName);

    const res = await tableDataContainer.items.create(dataRow)

    const { _rid, _self, _etag, _attachments, _ts,edges, ...rest } =
      res.resource as any;

    return dataRow;
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
    const res1 = await checkTableCols(body.tableName, body.filters);

    const res2 = await fetchData(body, body.tableName);

    return { rowsCount: res2.count, rows: res2.values };
  } catch (error) {
    throw error;
  }
};
