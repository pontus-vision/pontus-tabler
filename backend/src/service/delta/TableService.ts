import {
  InternalServerError,
  ReadPaginationFilter,
  TableColumnRefKind,
  TableCreateReq,
  TableCreateRes,
  TableDeleteReq,
  TableReadReq,
  TableReadRes,
  TableUpdateReq,
  TablesReadRes,
  TablesReadResTablesItem,
} from '../../typescript/api';
import { filtersToSnakeCase, generateUUIDv6, isEmpty, isJSONParsable, runQuery } from '../../db-utils';
import { filterToQuery } from '../../utils';
import { ConflictEntityError, NotFoundError } from '../../generated/api/resources';
import { snakeCase } from 'lodash';
import { TABLES } from '../../consts';

export const createTable = async (
  data: TableCreateReq,
): Promise<TableCreateRes> => {
  const uuid = generateUUIDv6();

  const createQuery = `
    CREATE TABLE IF NOT EXISTS ${TABLES} (
      id STRING,
      name STRING,
      label STRING,
      cols ARRAY<STRUCT<
        id STRING,
        name STRING,
        field STRING,
        sortable BOOLEAN,
        header_name STRING,
        filter BOOLEAN,
        kind STRING,
        pivotIndex INTEGER,
        description STRING,
        regex STRING>>
    ) USING DELTA LOCATION '/data/pv/${TABLES}';
  `;

  await runQuery(createQuery);

  const sqlCheck = (await runQuery(
    `SELECT * FROM ${TABLES} WHERE name = ?`,
    [snakeCase(data.name)]
  )) as TableCreateRes[];

  if (sqlCheck && sqlCheck.length !== 0) {
    throw new ConflictEntityError(
      `There is already a table with this name (${data.name})`
    );
  }

  const cols: string[] = [];
  const arr2: string[] = [];

  for (const col of data.cols) {
    const colUuid = generateUUIDv6();

    if (col.name !== 'id') {
      arr2.push(
        `${snakeCase(col.name)} ${
          col.kind === 'integer'
            ? 'INTEGER'
            : col.kind === 'checkboxes'
            ? 'BOOLEAN'
            : 'STRING'
        }`
      );
    }

    cols.push(
      `struct(
        '${colUuid}',
        '${snakeCase(col.name)}',
        '${snakeCase(col.field)}',
        ${col.sortable},
        '${col.headerName}',
        ${col.filter},
        ${col.kind ? `'${col.kind}'` : null},
        ${col.pivotIndex !== undefined && col.pivotIndex !== null ? col.pivotIndex : 'null'},
        ${col.description ? `'${col.description}'` : 'null'},
        ${col.regex ? `'${col.regex}'` : 'null'}
      )`
    );
  }

  const insertQuery = `
    INSERT INTO ${TABLES} (id, name, label, cols)
    VALUES (?, ?, ?, array(${cols.join(', ')}))
  `;
  await runQuery(insertQuery, [uuid, snakeCase(data.name), data.label]);

  const sql3 = (await runQuery(
    `SELECT * FROM ${TABLES} WHERE id = ?`,
    [uuid]
  )) as TableCreateRes[];

  const tableName = snakeCase(data.name);

  const createTableQuery = `
    CREATE OR REPLACE TABLE ${tableName} (
      id STRING
      ${arr2.length > 0 ? `, ${arr2.join(', ')}` : ''}
    ) USING DELTA
    TBLPROPERTIES (
      'delta.columnMapping.mode' = 'name',
      'delta.minReaderVersion' = '2',
      'delta.minWriterVersion' = '5'
    )
  `;

  await runQuery(createTableQuery);

  return { ...sql3[0], cols: JSON.parse(sql3[0].cols as any) };
};


export const updateTable = async (data: TableUpdateReq) => {
  const cols = [];

  for (const col of data.cols) {
    const uuid = generateUUIDv6();

    const arr1 = [];
    arr1.push(`? AS id`);
    arr1.push(`? AS name`);
    arr1.push(`? AS field`);
    arr1.push(`? AS sortable`);
    arr1.push(`? AS header_name`);
    arr1.push(`? AS filter`);
    arr1.push(`? AS kind`);
    arr1.push(`? AS pivotIndex`);
    arr1.push(`? AS description`);
    arr1.push(`? AS regex`);

    cols.push(`struct(${arr1.join(', ')})`);
  }

  const fields = [];
  const params: any[] = [];

  const { tableColsCrud, ...rest } = data;

  for (const prop in rest) {
    if (prop === 'cols') {
      fields.push(`cols = array(${cols.join(', ')})`);

      for (const col of data.cols) {
        const uuid = generateUUIDv6();
        params.push(
          col?.id || uuid,
          snakeCase(col.name),
          snakeCase(col?.field),
          col?.sortable,
          col?.headerName,
          col?.filter,
          col?.kind,
          col?.pivotIndex,
          col?.description,
          col?.regex
        );
      }

      continue;
    }

    const value = data[prop];
    fields.push(`${prop} = ?`);

    if (prop === 'name' || prop === 'field') {
      params.push(snakeCase(value));
    } else {
      params.push(value);
    }
  }

  params.push(data.id); // for WHERE clause

  const query = `UPDATE ${TABLES} SET ${fields.join(', ')} WHERE id = ?;`;

  const sql = await runQuery(query, params);

  if (+sql[0]['num_affected_rows'] === 0) {
    throw new NotFoundError(`did not find any record at id "${data.id}"`);
  }

  if (!isEmpty(data?.tableColsCrud)) {
    const { renameColumns, tableName, addColumns, dropColumns } = data.tableColsCrud;
    const table_name = snakeCase(tableName);

    try {
      await updateTableSchema(table_name, renameColumns, addColumns, dropColumns);
    } catch (error) {
      console.error({ error });
      throw new InternalServerError(isJSONParsable(error) ? JSON.stringify(error) : error);
    }
  }

  return data;
};


async function updateTableSchema(tableName: string, renameColumns: Record<string, string>, addColumns: Record<string, TableColumnRefKind>, dropColumns: string[]) {
  const alterStatements = [];

  if (Array.isArray(dropColumns) && dropColumns.length > 0) {
    for (const col of dropColumns) {
      alterStatements.push(`ALTER TABLE ${tableName} DROP COLUMN ${snakeCase(col)}`);
    }
  }
  if (!isEmpty(renameColumns)) {
    for (const [oldCol, newCol] of Object.entries(renameColumns)) {
      alterStatements.push(`ALTER TABLE ${tableName} RENAME COLUMN ${snakeCase(oldCol)} TO ${snakeCase(newCol)}`);
    }
  }

  if (!isEmpty(addColumns)) {
    for (const [col, type] of Object.entries(addColumns)) {
      const typeCol = type === 'integer' ? 'INTEGER' : type === 'checkboxes' ? 'BOOLEAN' : 'STRING'
      alterStatements.push(`ALTER TABLE ${tableName} ADD COLUMN ${snakeCase(col)} ${snakeCase(typeCol)}`);
    }
  }

  if (alterStatements.length > 0) {
    for (const stmt of alterStatements) {
      try {
        await runQuery(stmt);
      } catch (error) {
        throw error
      }
    }
  }

  return { message: "Schema updated successfully", executedQueries: alterStatements };
}

export const readTableById = async (
  data: TableReadReq,
): Promise<TableReadRes> => {
  const sql = await runQuery(
    `SELECT * FROM ${TABLES} WHERE id = ?`,
    [data.id]
  ) as {id: string, [key:string]: any}[]

  if (sql.length === 1) {
    const parsed = JSON.parse(sql[0].cols);
    const finalObj = {
      ...sql[0],
      cols: parsed.map(col => ({
        ...col,
        headerName: col['header_name'],
      })),
    };
    return finalObj;
  } else if (sql.length === 0) {
    throw new NotFoundError(`No table found at id "${data.id}"`);
  }
};


export const readTableByName = async (name: string): Promise<TableReadRes> => {
  const sql = await runQuery(
    `SELECT * FROM ${TABLES} WHERE name = ?`,
    [name]
  ) as any;

  if (sql.length === 1) {
    return { ...sql[0], cols: JSON.parse(sql[0].cols) };
  } else if (sql.length === 0) {
    throw { code: 404, message: 'No table found.' };
  }
};


export const deleteTable = async (data: TableDeleteReq) => {
  try {
    const sql = await runQuery(
      `DELETE FROM ${TABLES} WHERE id = ?`,
      [data.id]
    );

    const sql1 = await runQuery(
      `SHOW TABLES LIKE ?`,
      [snakeCase(data.name)]
    );

    if (sql1.length > 0) {
      const timestamp = Date.now();
      await runQuery(
        `ALTER TABLE ${snakeCase(data.name)} RENAME TO deleted_${timestamp}_${snakeCase(data.name)}`
      );
    }

    const affectedRows = +sql[0]?.['num_affected_rows'] || 0;

    if (affectedRows === 0) {
      throw { code: 404 };
    }

    return 'Table deleted!';
  } catch (error) {
    throw {code: 404}
  }
};


export const readTables = async (
  body: ReadPaginationFilter,
): Promise<TablesReadRes> => {
  const filtersSnakeCase = filtersToSnakeCase(body);

  const { queryStr: whereClause, params: whereParams } = filterToQuery(
    {
      filters: filtersSnakeCase,
      from: body.from,
      to: body.to,
      sortModel: body.sortModel,
    },
    ""
  );

  const { queryStr: countWhereClause, params: countParams } = filterToQuery(
    {
      filters: filtersSnakeCase,
    },
    ""
  );

  const sql = (await runQuery(
    `SELECT * FROM ${TABLES} ${whereClause}`,
    whereParams
  )) as TablesReadResTablesItem[];

  if (sql.length === 0) {
    throw { code: 404 };
  }

  const sql2 = await runQuery(
    `SELECT COUNT(*) FROM ${TABLES} ${countWhereClause}`,
    countParams
  );

  return {
    totalTables: +sql2[0]['count(1)'],
    tables: sql.map((table) => ({
      ...table,
      cols: JSON.parse(table?.cols as any),
    })),
  };
};

