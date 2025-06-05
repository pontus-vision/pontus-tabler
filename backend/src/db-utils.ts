import { ReadPaginationFilter, ReadPaginationFilterFilters } from './typescript/api';
import { Jinst, Pool } from '../pontus-node-jdbc/src/index';
import { JDBC } from '../pontus-node-jdbc/src/index';
import { v4 as uuidv4 } from 'uuid';
import { snakeCase } from 'lodash';
import { NotFoundError } from './generated/api';
import { IConnection } from '../pontus-node-jdbc/src/pool';

export const DELTA_DB = 'deltadb'

export const classPath = process.env['CLASSPATH']?.split(',');

if (!Jinst.getInstance().isJvmCreated()) {
  Jinst.getInstance().addOption('-Xrs');
  Jinst.getInstance().setupClasspath(classPath || []); // Path to your JDBC driver JAR file
}

export const config = {
  url: 'jdbc:hive2://delta-db:10000', // Update the connection URL according to your setup
  drivername: 'org.apache.hive.jdbc.HiveDriver', // Driver class name
  properties: {
    user: 'NBuser',
    password: '',
  },
};

let instance: JDBC | null = null;

export const getJDBCInstance = (): JDBC => {
  if (!instance) {
    instance = new JDBC(config);
  }
  return instance;
};

// export const pool = new Pool({
//   url: 'jdbc:hive2://172.18.0.4:10000',  // 🔧 key fix here!
//   drivername: 'org.apache.hive.jdbc.HiveDriver',
//   minpoolsize: 2,
//   maxpoolsize: 10,
//   keepalive: {
//     interval: 60000,
//     query: 'SELECT 1',
//     enabled: true
//   },
//   logging: {
//     level: 'info'
//   }
// });


// // Initialize pool
// async function initializePool() {
//   try {
//     await pool.initialize();
//     console.log('Pool initialized successfully.');
//   } catch (error) {
//     console.error('Error initializing the pool:', error);
//   }
// }
// let initialized = false;

// export async function ensurePoolInitialized() {
//   if (!initialized) {
//     console.log('🔄 Initializing JDBC pool...');
//     await pool.initialize();
//     initialized = true;
//     console.log('✅ JDBC pool initialized');
//   } else {
//     console.log('⏩ JDBC pool already initialized');
//   }
// }

export const convertToSqlFields = (data: any[]): string => {
  const fields = [];

  for (const value of data) {
    const valType = typeof value;
    if (valType === 'boolean') {
      fields.push(`${value} BOOLEAN`);
    } else if (valType === 'number') {
      fields.push(`${value} INT`);
    } else {
      fields.push(`${value} STRING`);
    }
  }

  return fields.join(', ');
};

export async function runQuery(
  query: string,
  params: any[] = []
): Promise<Record<string, any>[]> {
  try {
    const jdbc = new JDBC(config);
    const reservedConn = await jdbc.reserve();
    const connection = reservedConn.conn;

    const preparedStatement = await connection.prepareStatement(query);

    // Safely bind parameters to the query
    for (let i = 0; i < params.length; i++) {
      preparedStatement.setObject(i + 1, params[i]); // JDBC uses 1-based index
    }

    const resultSet = await preparedStatement.executeQuery();
    const results = await resultSet.toObjArray();

    await connection.close();
    await jdbc.release(connection);

    return results;
  } catch (error) {
    console.error('Error executing query:', { query, params, error });
    throw error;
  }
}

export const updateSql = async (
  table: string,
  data: Record<string, any>,
  whereClause: string, // e.g., "WHERE id = ?"
  whereParams: any[],   // e.g., [5]
): Promise<Record<string, any>[]> => {


  const keys = Object.keys(data);
  if (keys.length === 0) {
    throw new Error("No data to update");
  }

  const setClause = keys.map(key => {
    return `${key} = ?`;
  }).join(', ');

  const values = Object.values(data);
  const query = `UPDATE ${table} SET ${setClause} ${whereClause}`;

  const res2 = await runQuery(query, [...values, ...whereParams]);

  if (+res2[0]?.['num_affected_rows'] === 0) {
    throw new NotFoundError(
      `did not find any record at table '${table}' (${whereClause})`,
    );
  }

  const selectQuery = `SELECT * FROM ${table} ${whereClause}`;
  const res3 = await runQuery(selectQuery, whereParams);

  if (res3.length === 0) {
    throw new NotFoundError(
      `did not find any record at table '${table}' (${whereClause})`,
    );
  }

  return res3;
};

export const objEntriesToStr = (
  data: Record<string, any>,
): { keysStr: string; valuesStr: string } => {
  const keys = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    // keys.push(key);
    // values.push(value)

    const valType = typeof value;
    const keyType = typeof key;
    if (valType === 'boolean') {
      keys.push(`${snakeCase(key)} BOOLEAN`);
      values.push(value);
    } else if (valType === 'number') {
      keys.push(`${snakeCase(key)} INT`);
      values.push(value);
    } else {
      keys.push(`${snakeCase(key)} STRING`);
      values.push(`'${value}'`);
    }
  }

  const keysStr = keys.join(', ');
  const valuesStr = values.join(', ');
  return { keysStr, valuesStr };
};
export const generateUUIDv6 = () => {
  const uuid = uuidv4().replace(/-/g, '');
  const timestamp = new Date().getTime();

  let timestampHex = timestamp.toString(16).padStart(12, '0');
  let uuidV6 = timestampHex + uuid.slice(12);

  return uuidV6;
};

export const createSql = async (
  table: string,
  fields: string,
  data: Record<string, any> | Record<string, any>[],
): Promise<Record<string, any>[]> => {
  const isArray = Array.isArray(data);
  const rows = isArray ? data : [data];
  const needsId = !('id' in rows[0]);

  const createQuery = `
    CREATE TABLE IF NOT EXISTS ${table} (${needsId ? 'id STRING, ' : ''}${fields})
    USING DELTA LOCATION '/data/pv/${table}';
  `;
  await runQuery(createQuery);

  const insertFields = needsId ? ['id', ...Object.keys(rows[0])] : Object.keys(rows[0]);
  const placeholders: string[] = [];
  const values: any[] = [];
  const ids: string[] = [];

  rows.forEach((row) => {
    const valueList: string[] = [];

    if (needsId) {
      const uuid = generateUUIDv6();
      ids.push(uuid);
      values.push(uuid);
      valueList.push('?');
    } else {
      ids.push(row.id);
    }

    for (const key of Object.keys(row)) {
      values.push(row[key]);
      valueList.push('?');
    }

    placeholders.push(`(${valueList.join(', ')})`);
  });

  const insertQuery = `INSERT INTO ${table} (${insertFields.join(', ')}) VALUES ${placeholders.join(', ')}`;
  await runQuery(insertQuery, values);

  const selectPlaceholders = ids.map(() => '?').join(', ');
  const selectQuery = `SELECT * FROM ${table} WHERE id IN (${selectPlaceholders})`;
  const result = await runQuery(selectQuery, ids);

  return result;
};

export function validateRegex(regexString) {
  try {
    new RegExp(regexString);  // Attempt to create a regex object
    return true;               // If no error, it's a valid regex
  } catch (e) {
    return false;              // If there's an error, it's an invalid regex
  }
}

export const filtersToSnakeCase = (data: ReadPaginationFilter): Record<string, ReadPaginationFilterFilters> => {
  const filtersSnakeCase: Record<string, ReadPaginationFilterFilters> = {};

  for (const prop in data.filters) {
    const snakeKey = snakeCase(prop);

    filtersSnakeCase[snakeKey] = {
      ...data.filters[prop],
      filter: typeof data.filters[prop].filter === "string"
        ? snakeCase(data.filters[prop].filter as string)
        : data.filters[prop].filter,
    };
  }

  return filtersSnakeCase;
};

export const isJSONParsable = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};
export function isEmpty(obj) {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  //

  return true
}
