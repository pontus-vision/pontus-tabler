import {
  ReadPaginationFilter,
  TableCreateReq,
  TableCreateRes,
  TableDeleteReq,
  TableReadReq,
  TableReadRes,
  TableUpdateReq,
  TablesReadRes,
} from '../../typescript/api';
import { deleteContainer, fetchContainer, fetchData } from '../../cosmos-utils';
import {
  Container,
  PartitionKeyDefinition,
  UniqueKeyPolicy,
} from '@azure/cosmos';
import { NotFoundError } from '../../generated/api';

import * as db from '../../../../delta-table/node/index-jdbc';
import { createSql, generateUUIDv6 } from './AuthGroupService';
export const TABLES = 'tables';

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

  const sql = (await db.executeQuery(
    `CREATE TABLE IF NOT EXISTS ${TABLES} (id STRING, name STRING, label STRING, cols ARRAY<STRUCT<id STRING, name STRING, field STRING, sortable BOOLEAN, header_name STRING, filter BOOLEAN, kind STRING>>) USING DELTA LOCATION '/data/pv/${TABLES}';`,
    conn,
  )) as TableCreateRes[];


  const sql5 = (await db.executeQuery(
    `SELECT * FROM ${TABLES};`,
    conn,
  )) as TableCreateRes[];

  const cols = [];

  for (const col of data.cols) {
    const uuid = generateUUIDv6();

    cols.push(
      `struct('${uuid}', '${col.name}', '${col.field}', ${col.sortable}, '${
        col.headerName
      }', ${col.filter}, ${col.kind ? `'${col.kind}` : null} )`,
    );
  }

  const sql2 = await db.executeQuery(
    `INSERT INTO ${TABLES} (id, name, label, cols) VALUES ('${uuid}', '${data.name}', '${
      data.label
    }', array(${cols.join(', ')}));`,
    conn,
  );

  const sql3 = (await db.executeQuery(
    `SELECT * FROM ${TABLES} WHERE id = '${uuid}'`,
    conn,
  )) as TableCreateRes[];

  return {...sql3[0], cols: JSON.parse(sql3[0].cols as any)};
};

export const updateTable = async (data: TableUpdateReq) => {
  try {
    const tableContainer = await initiateTableContainer();

    const res = await tableContainer.items.upsert(data);
    const { _rid, _self, _etag, _attachments, _ts, ...rest } =
      res.resource as any;

    return rest;
  } catch (error) {
    throw error;
  }
};

export const readTableById = async (
  data: TableReadReq,
): Promise<TableReadRes> => {
  const querySpec = {
    query: 'select * from tables p where p.id=@tableId',
    parameters: [
      {
        name: '@tableId',
        value: data.id,
      },
    ],
  };
  const tableContainer = await initiateTableContainer();

  const { resources } = await tableContainer.items.query(querySpec).fetchAll();

  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw new NotFoundError('Table not found');
  }
};

export const readTableByName = async (name: string): Promise<TableReadRes> => {
  const querySpec = {
    query: 'select * from tables p where p.name=@tableName',
    parameters: [
      {
        name: '@tableName',
        value: name,
      },
    ],
  };

  const tableContainer = await initiateTableContainer();

  const { resources } = await tableContainer.items.query(querySpec).fetchAll();

  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw { code: 404, message: 'No table found.' };
  }
};

export const deleteTable = async (data: TableDeleteReq) => {
  try {
    const tableContainer = await initiateTableContainer();
    const res = await tableContainer.item(data.id, data.name).delete();

    const res2 = (await fetchContainer(data.name)).read();

    if ((await res2).statusCode === 200) {
      const res3 = await deleteContainer(data.name);
    }

    return 'Table deleted!';
  } catch (error) {
    throw error;
  }
};

export const readTables = async (
  body: ReadPaginationFilter,
): Promise<TablesReadRes> => {
  const res = await fetchData(body, 'tables');
  return { totalTables: res.count, tables: res.values };
};
