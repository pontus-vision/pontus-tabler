import {
  TableDataCreateReq,
  TableDataCreateRes,
  TableDataDeleteReq,
  TableDataReadReq,
  TableDataReadRes,
  TableDataRowRef,
  TableDataUpdateReq,
} from '../../typescript/api';
import { fetchContainer, fetchData, filterToQuery } from '../../cosmos-utils';
import { PatchOperation } from '@azure/cosmos';
import {
  TABLES,
  TABLE_DATA,
  initiateTableContainer,
  readTableByName,
} from './TableService';
import { v4 as uuidv4 } from 'uuid';
import {
  convertToSqlFields,
  createSql,
  generateUUIDv6,
  objEntriesToStr,
  updateSql,
} from './AuthGroupService';
import * as db from './../../../delta-table/node/index-jdbc';
import { snakeCase } from 'lodash';
import { NotFoundError } from '../../generated/api';

const conn: db.Connection = db.createConnection();
const checkTableCols = async (tableName: string, cols: TableDataRowRef) => {
  const res = (await db.executeQuery(
    `SELECT * FROM ${TABLES} WHERE name = '${tableName}'`,
    conn,
  )) as any;

  const resTable = res.map((el) => {
    return { ...el, cols: JSON.parse(res[0].cols) };
  });

  const colsChecked = [];

  for (const col in cols) {
    let found = false;
    for (const colReq of resTable[0]?.cols) {
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
};
export const createTableData = async (
  data: TableDataCreateReq,
): Promise<TableDataCreateRes> => {
  const tableName = snakeCase(data.tableName);

  const cols = {};

  for (const prop in data.cols) {
    // if (prop === 'name') {
    //   cols[snakeCase(prop)] = data.cols[prop];
    // } else {
    cols[snakeCase(prop)] = data.cols[prop];
    // }
  }

  try {
    await checkTableCols(tableName, cols);
  } catch (error) {
    throw error;
  }

  const uuid = generateUUIDv6();
  const fields = objEntriesToStr(data.cols);

  // const res = await db.executeQuery(
  //   `CREATE TABLE IF NOT EXISTS ${tableName} (id STRING, ${fields.keysStr}) USING DELTA LOCATION '/data/pv/${tableName}';`,
  //   conn,
  // );
  // const query = `INSERT INTO ${tableName} (id, ${Object.keys(data.cols).map(
  //   (key) =>
  //     typeof key === 'number' || typeof key === 'boolean' ? key : `'${key}'`,
  // )}) VALUES (${})`;

  // const res2 = await db.executeQuery(query, conn);

  // const cols = {};

  // for (const prop in data.cols) {
  //   cols[snakeCase(prop)] = data.cols[prop];
  // }

  const res = await createSql(tableName, fields.keysStr, cols);

  return res[0] as any;
};

export const updateTableData = async (data: TableDataUpdateReq) => {
  const tableName = snakeCase(data.tableName);

  const cols = {};

  for (const prop in data.cols) {
    cols[snakeCase(prop)] = data.cols[prop];
  }
  await checkTableCols(tableName, cols);


  const sql = await updateSql(tableName, cols, `WHERE id = '${data.rowId}'`);

  return { ...sql[0] };
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
    const sql = await db.executeQuery(
      `DELETE FROM ${snakeCase(data.tableName)} WHERE id = '${data.rowId}'`,
      conn,
    );

    if (+sql[0]['num_affected_rows'] === 0) {
      // throw new NotFoundError();
      throw {
        code: 404,
        message: `Did not find any row at id "${data.rowId}"`,
      };
    }
    return 'Row deleted!';
  } catch (error) {
    if (error.includes('[TABLE_OR_VIEW_NOT_FOUND]')) {
      throw {
        code: 404,
        message: `Did not find table "${data.tableName}"`,
      };
    }
  }
};

export const readTableData = async (
  body: TableDataReadReq,
): Promise<TableDataReadRes> => {
  const tableName = snakeCase(body.tableName);
  const filtersSnakeCase = {};

  for (const prop in body.filters) {
    filtersSnakeCase[snakeCase(prop)] = body.filters[prop];
  }

  const res1 = await checkTableCols(tableName, filtersSnakeCase);

  const filters = filterToQuery(filtersSnakeCase);
  const filtersCount = filterToQuery({
    filters: filtersSnakeCase,
    to: body.to,
    from: body.from,
  });

  const res2 = (await db.executeQuery(
    `SELECT * FROM ${tableName} ${filters}`,
    conn,
  )) as Record<string, any>[];

  if (res2.length === 0) {
    // throw new NotFoundError(`Could not find any row`);
    throw new NotFoundError(`no data found at table ${tableName}`);
  }

  const res = await db.executeQuery(
    `SELECT COUNT(*) FROM ${tableName} ${filtersCount}`,
    conn,
  );

  return { rowsCount: +res[0]['count(1)'], rows: res2 };
};
