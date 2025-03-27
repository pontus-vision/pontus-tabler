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
import { filtersToSnakeCase, filterToQuery, generateUUIDv6, isEmpty, isJSONParsable, runQuery } from '../../db-utils';
import { ConflictEntityError, NotFoundError } from '../../generated/api';
import { snakeCase } from 'lodash';
import { TABLES } from '../../consts';

export const createTable = async (
  data: TableCreateReq,
): Promise<TableCreateRes> => {
  const uuid = generateUUIDv6();

  const sqlCheck = (await runQuery(
    `SELECT * FROM ${TABLES} WHERE name = '${snakeCase(data.name)}'`,
  )) as TableCreateRes[];


  if (sqlCheck && sqlCheck?.length !== 0) {
    throw new ConflictEntityError(
      `There is already a table with this name (${data.name})`,
    );
  }

  const createQuery = `CREATE TABLE IF NOT EXISTS ${TABLES} (id STRING, name STRING, label STRING, 
      cols ARRAY<STRUCT<id STRING, name STRING, field STRING, sortable BOOLEAN, 
      header_name STRING, filter BOOLEAN, kind STRING, pivotIndex INTEGER, description STRING, regex STRING>>) USING DELTA LOCATION '/data/pv/${TABLES}';`

  const sql = (await runQuery(createQuery)) as TableCreateRes[];


  // const sql5 = (await runQuery(
  //   `SELECT * FROM ${TABLES};`,
  //   
  // )) as TableCreateRes[];

  const cols = [];
  const arr2 = []

  for (const col of data.cols) {
    const uuid = generateUUIDv6();

    if (col.name !== 'id') {
      arr2.push(`${snakeCase(col.name)} ${col.kind === 'integer' ? 'INTEGER' : col.kind === 'checkboxes' ? 'BOOLEAN' : 'STRING'}`)
    }

    cols.push(
      `struct('${uuid}', 
      '${snakeCase(col.name)}', '${snakeCase(col.field)}', ${col.sortable}, 
      '${col.headerName}', ${col.filter}, ${col.kind ? `'${col.kind}'` : null}, 
      ${col.pivotIndex ? `'${col.pivotIndex}'` : null},
      ${col.description ? `'${col.description}'` : null},
      ${col.regex ? `'${col.regex}'` : null}
       )`,
    );
  }

  //  cols.push(
  //    `struct('${uuid}', '${snakeCase(col.name)}', '${col.field}', ${col.sortable
  //    }, '${col.headerName}', ${col.filter}, ${col.kind ? `'${col.kind}'` : null
  //    } )`,
  const query = `INSERT INTO ${TABLES} (id, name, label, cols) VALUES ('${uuid}', '${snakeCase(
    data.name,
  )}', '${data.label}', array(${cols.join(', ')}));`;

  const sql2 = await runQuery(query);

  const sql3 = (await runQuery(
    `SELECT * FROM ${TABLES} WHERE id = '${uuid}'`,

  )) as TableCreateRes[];

  const table_name = snakeCase(data.name)

  const queryCreate = `CREATE TABLE IF NOT EXISTS ${table_name} (id STRING ${arr2.length > 0 ? `, ${arr2.join(", ")})` : ')'} USING DELTA LOCATION '/data/pv/${table_name}' TBLPROPERTIES ('delta.columnMapping.mode' = 'name', 'delta.minReaderVersion' = '2','delta.minWriterVersion' = '5')`

  const res = await runQuery(queryCreate)
  return { ...sql3[0], cols: JSON.parse(sql3[0].cols as any) };
};

export const updateTable = async (data: TableUpdateReq) => {
  const cols = [];

  // const sql2 = runQuery(`SELECT * FROM ${TABLES} WHERE id = '${data.id}'`, conn)

  const arr2 = [];

  for (const col of data.cols) {
    const uuid = generateUUIDv6();

    const arr1 = [];
    arr1.push(`'${col?.id || uuid}' AS id`);
    arr1.push(`'${snakeCase(col.name)}' AS name`);
    arr1.push(`'${snakeCase(col?.field)}' AS field`);
    arr1.push(`${col?.sortable} AS sortable`);
    arr1.push(`'${col?.headerName}' AS header_name`);
    arr1.push(`${col?.filter} AS filter`);
    arr1.push(`'${col?.kind}' AS kind`);
    arr1.push(`'${col?.pivotIndex}' AS pivotIndex`);
    arr1.push(`'${col?.description}' AS description`);
    arr1.push(`'${col?.regex}' AS regex`);


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

  const { tableColsCrud, ...rest } = data

  for (const prop in rest) {
    if (prop === 'cols') {
      fields.push(`cols = array(${cols.join(', ')})`);
      continue;
    }
    if (prop === 'name' || prop === 'field') {
      fields.push(`${prop} = '${snakeCase(data[prop])}'`);
      continue
    }
    fields.push(
      `${prop} = ${typeof data[prop] === 'number' || typeof data[prop] === 'boolean'
        ? data[prop]
        : `'${data[prop]}'`
      }`,
    );
  }

  const strCols = `${data.name ? ` name = '${data.name}' ` : ''} ${data.label ? ` label = '${data.label}' ` : ''
    }`;

  const query = `UPDATE ${TABLES} SET ${fields.join(', ')} WHERE id = '${data.id
    }';`;

  const sql = await runQuery(query);

  if (+sql[0]['num_affected_rows'] === 0) {
    throw new NotFoundError(`did not find any record at id "${data.id}"`);
  }

  if (!isEmpty(data?.tableColsCrud)) {
    const { renameColumns, tableName, addColumns, dropColumns } = data.tableColsCrud
    const table_name = snakeCase(tableName)

    try {
      await updateTableSchema(table_name, renameColumns, addColumns, dropColumns)
    } catch (error) {
      console.error({ error })
      throw new InternalServerError(isJSONParsable(error) ? JSON.stringify(error) : error)
    }
  }

  return data
};

async function updateTableSchema(tableName: string, renameColumns: Record<string, string>, addColumns: Record<string, TableColumnRefKind>, dropColumns: string[]) {
  const alterStatements = [];

  if (Array.isArray(dropColumns) && dropColumns.length > 0) {
    for (const col of dropColumns) {
      alterStatements.push(`ALTER TABLE ${tableName} DROP COLUMN ${snakeCase(col)}`);
    }
  }
  // Handle renaming
  if (!isEmpty(renameColumns)) {
    for (const [oldCol, newCol] of Object.entries(renameColumns)) {
      alterStatements.push(`ALTER TABLE ${tableName} RENAME COLUMN ${snakeCase(oldCol)} TO ${snakeCase(newCol)}`);
    }
  }

  // Add new columns
  if (!isEmpty(addColumns)) {
    for (const [col, type] of Object.entries(addColumns)) {
      const typeCol = type === 'integer' ? 'INTEGER' : type === 'checkboxes' ? 'BOOLEAN' : 'STRING'
      alterStatements.push(`ALTER TABLE ${tableName} ADD COLUMN ${snakeCase(col)} ${snakeCase(typeCol)}`);
    }
  }

  // Drop columns

  // Execute SQL queries
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
  const sql = (await runQuery(
    `SELECT * FROM ${TABLES} WHERE id = '${data.id}'`,
  )) as any;

  if (sql.length === 1) {
    const parsed = JSON.parse(sql[0].cols)
    const finalObj = { ...sql[0], cols: parsed.map(col => { return { ...col, headerName: col['header_name'] } }) }
    return finalObj;
  } else if (sql.length === 0) {
    throw new NotFoundError(`No table found at id "${data.id}"`);
  }
};

export const readTableByName = async (name: string): Promise<TableReadRes> => {
  const sql = (await runQuery(
    `SELECT * FROM ${TABLES} WHERE name = '${name}'`,
  )) as any;


  if (sql.length === 1) {
    return { ...sql[0], cols: JSON.parse(sql[0].cols) };
  } else if (sql.length === 0) {
    throw { code: 404, message: 'No table found.' };
  }
};

export const deleteTable = async (data: TableDeleteReq) => {
  try {
    const sql = (await runQuery(
      `DELETE FROM ${TABLES} WHERE id = '${data.id}'`,

    )) as any;
    //   const sql2 = (await runQuery(
    //     `DELETE FROM ${snakeCase(data.name)}`,

    //   )) as any;
    const sql2 = (await runQuery(
      `DELETE FROM ${snakeCase(data.name)}`,
    )) as any;
    const sql3 = (await runQuery(
      `DROP TABLE IF EXISTS ${snakeCase(data.name)}`,
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
  const filtersSnakeCase = filtersToSnakeCase(body)

  const whereClause = filterToQuery({
    filters: filtersSnakeCase,
    from: body.from,
    to: body.to,
    sortModel: body.sortModel
  }, "");
  const whereClause2 = filterToQuery({ filters: filtersSnakeCase }, "");
  const sql = (await runQuery(
    `SELECT * FROM ${TABLES} ${whereClause}`,
  )) as TablesReadResTablesItem[];

  if (sql.length === 0) {
    throw { code: 404 };
  }

  const sql2 = await runQuery(
    `SELECT COUNT(*) FROM ${TABLES} ${whereClause2}`,
  );

  return {
    totalTables: +sql2[0]['count(1)'],
    tables: sql.map((table) => {
      return { ...table, cols: JSON.parse(table?.cols as any) };
    }),
  };
};
