import {
  TableDataCreateReq,
  TableDataCreateRes,
  TableDataDeleteReq,
  TableDataReadReq,
  TableDataReadRes,
  TableDataRowRef,
  TableDataUpdateReq,
} from '../../typescript/api';
import { snakeCase } from 'lodash';
import { NotFoundError } from '../../generated/api/resources';
import { createSql, generateUUIDv6, objEntriesToStr, runQuery, updateSql } from '../../db-utils';
import { filterToQuery } from '../../utils';
import { TABLES } from '../../consts';

const checkTableCols = async (tableName: string, cols: TableDataRowRef) => {
  const res = (await runQuery(
    `SELECT * FROM ${TABLES} WHERE name = ?`,
    [tableName]
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

  // const res = await runQuery(
  //   `CREATE TABLE IF NOT EXISTS ${tableName} (id STRING, ${fields.keysStr}) USING DELTA LOCATION '/data/pv/${tableName}';`,
  //   
  // );
  // const query = `INSERT INTO ${tableName} (id, ${Object.keys(data.cols).map(
  //   (key) =>
  //     typeof key === 'number' || typeof key === 'boolean' ? key : `'${key}'`,
  // )}) VALUES (${})`;

  // const res2 = await runQuery(query, conn);

  // const cols = {};

  // for (const prop in data.cols) {
  //   cols[snakeCase(prop)] = data.cols[prop];
  // }

  const res = await createSql(tableName, fields.keysStr, cols);

  return res[0] as any;
};

export const updateTableData = async (data: TableDataUpdateReq) => {
  const tableName = snakeCase(data.tableName);

  // Convert cols keys to snake_case
  const cols: Record<string, any> = {};
  for (const prop in data.cols) {
    cols[snakeCase(prop)] = data.cols[prop];
  }

  // Check columns exist in table
  await checkTableCols(tableName, cols);

  // Parameterized WHERE clause, with ? placeholder and parameter array
  const whereClause = `WHERE id = ?`;
  const whereParams = [data.rowId];

  // Call updateSql with all arguments
  const sql = await updateSql(tableName, cols, whereClause, whereParams);

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
  const tableName = snakeCase(data.tableName);

  const sql2 = await runQuery(
    `DELETE FROM ${tableName} WHERE id = ?`,
    [data.rowId]
  );

  if (+sql2?.[0]?.['num_affected_rows'] === 0) {
    throw new NotFoundError(`Did not find any row at id "${data.rowId}"`);
  }

  if (!sql2) {
    throw new NotFoundError(`Did not find table "${data.tableName}"`);
  }

  return 'Row deleted!';
};


export const readTableData = async (
  body: TableDataReadReq,
): Promise<TableDataReadRes> => {
  const tableName = snakeCase(body.tableName);

  // Convert filter keys to snake_case
  const filtersSnakeCase: Record<string, any> = {};
  for (const prop in body.filters) {
    filtersSnakeCase[snakeCase(prop)] = body.filters[prop];
  }

  // Validate filters
  await checkTableCols(tableName, filtersSnakeCase);

  // Build WHERE clause and parameters
  const { queryStr: whereClause, params: whereParams } = filterToQuery(filtersSnakeCase, '');

  const sqlQuery = `SELECT * FROM ${tableName} ${whereClause}`;
  const rows = await runQuery(sqlQuery, whereParams);

  if (rows.length === 0) {
    throw new NotFoundError(`no data found at table ${tableName}`);
  }

  // Count query (reuse filters, optionally add to/from if needed)
  const { queryStr: countClause, params: countParams } = filterToQuery({
    filters: filtersSnakeCase,
    to: body.to,
    from: body.from,
  }, '');

  const countQuery = `SELECT COUNT(*) FROM ${tableName} ${countClause}`;
  const countRows = await runQuery(countQuery, countParams);

  return {
    rowsCount: +countRows[0]['count(1)'],
    rows,
  };
};

