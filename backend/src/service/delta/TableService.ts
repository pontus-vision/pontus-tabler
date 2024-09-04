import {
  ReadPaginationFilter,
  TableCreateReq,
  TableCreateRes,
  TableDeleteReq,
  TableReadReq,
  TableReadRes,
  TableUpdateReq,
  TablesReadRes,
  TablesReadResTablesItem,
} from '../../typescript/api';
import { deleteContainer, fetchContainer, fetchData } from '../../cosmos-utils';
import { filterToQuery } from '../../db-utils';
import {
  Container,
  PartitionKeyDefinition,
  UniqueKeyPolicy,
} from '@azure/cosmos';
import { ConflictEntityError, NotFoundError } from '../../generated/api';

import * as db from './../../../delta-table/node/index-jdbc';
import { createSql, generateUUIDv6, updateSql } from './AuthGroupService';
import { snakeCase } from 'lodash';
export const TABLES = 'tables';
export const TABLE_DATA = 'table_data';

const conn: db.Connection = db.createConnection();
const partitionKey: string | PartitionKeyDefinition = {
  paths: ['/name'],
};

const uniqueKeyPolicy: UniqueKeyPolicy = {
  uniqueKeys: [{ paths: ['/name'] }],
};

export const initiateTableContainer = async (): Promise<Container> => {
  return await fetchContainer(TABLES, partitionKey, uniqueKeyPolicy);
};

export const createTable = async (
  data: TableCreateReq,
): Promise<TableCreateRes> => {
  const uuid = generateUUIDv6();

  const sqlCheck = (await db.executeQuery(
    `SELECT * FROM ${TABLES} WHERE name = '${snakeCase(data.name)}'`,
    conn,
  )) as TableCreateRes[];

  if (sqlCheck.length !== 0) {
    throw new ConflictEntityError(
      `There is already a table with this name (${data.name})`,
    );
  }

  const sql = (await db.executeQuery(
    `CREATE TABLE IF NOT EXISTS ${TABLES} (id STRING, name STRING, label STRING, cols ARRAY<STRUCT<id STRING, name STRING, field STRING, sortable BOOLEAN, header_name STRING, filter BOOLEAN, kind STRING>>) USING DELTA LOCATION '/data/pv/${TABLES}';`,
    conn,
  )) as TableCreateRes[];

  // const sql5 = (await db.executeQuery(
  //   `SELECT * FROM ${TABLES};`,
  //   conn,
  // )) as TableCreateRes[];

  const cols = [];

  for (const col of data.cols) {
    const uuid = generateUUIDv6();

    cols.push(
      `struct('${uuid}', '${snakeCase(col.name)}', '${col.field}', ${
        col.sortable
      }, '${col.headerName}', ${col.filter}, ${
        col.kind ? `'${col.kind}'` : null
      } )`,
    );
  }

  const query = `INSERT INTO ${TABLES} (id, name, label, cols) VALUES ('${uuid}', '${snakeCase(
    data.name,
  )}', '${data.label}', array(${cols.join(', ')}));`;
  const sql2 = await db.executeQuery(query, conn);

  const sql3 = (await db.executeQuery(
    `SELECT * FROM ${TABLES} WHERE id = '${uuid}'`,
    conn,
  )) as TableCreateRes[];

  return { ...sql3[0], cols: JSON.parse(sql3[0].cols as any) };
};

export const updateTable = async (data: TableUpdateReq) => {
  const cols = [];

  // const sql2 = db.executeQuery(`SELECT * FROM ${TABLES} WHERE id = '${data.id}'`, conn)

  const arr2 = [];

  for (const col of data.cols) {
    const uuid = generateUUIDv6();

    const arr1 = [];
    arr1.push(`'${col?.id || uuid}' AS id`);
    arr1.push(`'${snakeCase(col.name)}' AS name`);
    arr1.push(`'${col.field}' AS field`);
    arr1.push(`${col.sortable} AS sortable`);
    arr1.push(`'${col.headerName}' AS header_name`);
    arr1.push(`${col.filter} AS filter`);
    arr1.push(`'${col.kind}' AS kind`);
    const colSnakeCase = [];

    // for (const el of arr1) {
    //   // for (const prop in col) {
    //   //   if (typeof col[prop] === 'number' || typeof col[prop] === 'boolean') {
    //   //     colSnakeCase.push(`${col[prop]} AS ${prop}`);
    //   //   } else {
    //   //     if (prop === 'name') {
    //   //       colSnakeCase.push(`'${snakeCase(col[prop])}' AS ${prop}`);
    //   //     } else {
    //   //       colSnakeCase.push(`'${col[prop]}' AS ${prop}`);
    //   //     }
    //   //   }
    //   // }
    //   for (const prop in col) {
    //     if (typeof el === 'number' || typeof el === 'boolean') {
    //       colSnakeCase.push(el);
    //     } else {
    //       colSnakeCase.push(`'${el}'`);
    //     }
    //   }
    //   // }
    //   // if (!col.hasOwnProperty('id')) {
    //   //   colSnakeCase.unshift(`'${uuid}' AS id`);

    //   //   cols.push(`struct(${colSnakeCase.join(', ')})`);
    //   // } else {
    //   //   cols.push(`struct(${colSnakeCase.join(', ')})`);
    //   // }
    // }
    cols.push(`struct(${arr1.join(', ')})`);
  }

  const fields = [];

  for (const prop in data) {
    if (prop === 'cols') {
      fields.push(`cols = array(${cols.join(', ')})`);
      continue;
    }
    fields.push(
      `${prop} = ${
        typeof data[prop] === 'number' || typeof data[prop] === 'boolean'
          ? data[prop]
          : `'${data[prop]}'`
      }`,
    );
  }

  const strCols = `${data.name ? ` name = '${data.name}' ` : ''} ${
    data.label ? ` label = '${data.label}' ` : ''
  }`;

  const query = `UPDATE ${TABLES} SET ${fields.join(', ')} WHERE id = '${
    data.id
  }';`;

  const sql = await db.executeQuery(query, conn);

  if (+sql[0]['num_affected_rows'] === 0) {
    throw new NotFoundError(`did not find any record at id "${data.id}"`);
  }

  return {
    ...data,
  };
};

export const readTableById = async (
  data: TableReadReq,
): Promise<TableReadRes> => {
  const sql = (await db.executeQuery(
    `SELECT * FROM ${TABLES} WHERE id = '${data.id}'`,
    conn,
  )) as any;

  if (sql.length === 1) {
    return { ...sql[0], cols: JSON.parse(sql[0].cols) };
  } else if (sql.length === 0) {
    throw new NotFoundError(`No table found at id "${data.id}"`);
  }
};

export const readTableByName = async (name: string): Promise<TableReadRes> => {
  const sql = (await db.executeQuery(
    `SELECT * FROM ${TABLES} WHERE name = '${name}'`,
    conn,
  )) as any;

  if (sql.length === 1) {
    return { ...sql[0], cols: JSON.parse(sql[0].cols) };
  } else if (sql.length === 0) {
    throw { code: 404, message: 'No table found.' };
  }
};

export const deleteTable = async (data: TableDeleteReq) => {
  try {
    const sql = (await db.executeQuery(
      `DELETE FROM ${TABLES} WHERE id = '${data.id}'`,
      conn,
    )) as any;

    const affectedRows = +sql[0]['num_affected_rows'];
    if (affectedRows === 0) {
      throw { code: 404 };
    }
    return 'Table deleted!';
  } catch (error) {
    throw error;
  }
};

export const readTables = async (
  body: ReadPaginationFilter,
): Promise<TablesReadRes> => {
  const filtersSnakeCase = {};

  for (const prop in body.filters) {
    if (prop === 'name') {
      filtersSnakeCase[prop] = {
        ...body.filters,
        name: {
          ...body.filters.name,
          filter: snakeCase(body.filters.name.filter as string),
        },
      };
    }
  }

  const whereClause = filterToQuery({
    filters: filtersSnakeCase,
    from: body.from,
    to: body.to,
  });
  const whereClause2 = filterToQuery({ filters: filtersSnakeCase });

  const sql = (await db.executeQuery(
    `SELECT * FROM ${TABLES} ${whereClause}`,
    conn,
  )) as TablesReadResTablesItem[];

  if (sql.length === 0) {
    throw { code: 404 };
  }

  const sql2 = await db.executeQuery(
    `SELECT COUNT(*) FROM ${TABLES} ${whereClause2}`,
    conn,
  );

  return {
    totalTables: +sql2[0]['count(1)'],
    tables: sql.map((table) => {
      return { ...table, cols: JSON.parse(table?.cols as any) };
    }),
  };
};
