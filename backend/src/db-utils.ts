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

export async function runQuery(query: string): Promise<Record<string, any>[]> {
  try {
    const jdbc = new JDBC(config);
    const reservedConn = await jdbc.reserve()
    const connection = reservedConn.conn
    //const connection = await createConnection();
    const preparedStatement = await connection.prepareStatement(query); // Replace `your_table` with your actual table name

    const resultSet = await preparedStatement.executeQuery();
    const results = await resultSet.toObjArray(); // Assuming you have a method to convert ResultSet to an array

    // Remember to release the connection after you are done
    // await pool.release(connection)

    await connection.close()
    await jdbc.release(connection)

    //console.log({ query, results })

    return results
  } catch (error) {
    console.error('Error executing query:', { query, error });
    throw error
  }
}

export const updateSql = async (
  table: string,
  data: Record<string, any>,
  whereClause: string,
): Promise<Record<string, any>[]> => {
  const insertValues = [];

  if (Array.isArray(data)) {
    for (const el of data) {
      for (const [key, value] of Object.entries(el)) {
        const val = typeof value === 'string' ? `'${value}'` : value;
        insertValues.push(`${key} = ${val}`);
      }
    }
  } else {
    for (const [key, value] of Object.entries(data)) {
      const val = typeof value === 'string' ? `'${value}'` : value;
      insertValues.push(`${key} = ${val}`);
    }
  }

  const insert = `UPDATE ${table} SET ${insertValues.join(
    ', ',
  )} ${whereClause}`;

  const res2 = await runQuery(insert);
  if (+res2[0]['num_affected_rows'] === 0) {
    throw new NotFoundError(
      `did not find any record at table '${table}' (${whereClause})`,
    );
  }

  const res3 = await runQuery(
    `SELECT * FROM ${table} ${whereClause}`,
  );

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
  data: Record<string, any>,
): Promise<Record<string, any>[]> => {
  const uuid = generateUUIDv6();

  let entries
  if (data?.id) {
    const { id, ...rest } = data
    entries = objEntriesToStr(rest);
  } else {
    entries = objEntriesToStr(data);
  }

  const keys = entries.keysStr;
  let values = entries.valuesStr;

  const createQuery = `CREATE TABLE IF NOT EXISTS ${table} (${data?.id ? '' : 'id STRING, '
    } ${fields}) USING DELTA LOCATION '/data/pv/${table}';`;

  const res = await runQuery(createQuery);


  const insertFields = Array.isArray(data)
    ? Object.keys(data[0]).join(', ')
    : Object.keys(data).join(', ');

  const insertValues = [];
  if (Array.isArray(data)) {
    for (const el of data) {
      const entries = objEntriesToStr(el);
      insertValues.push(`${entries.valuesStr}`);
    }
  }

  const ids = [];

  const insert = `INSERT INTO ${table} (${data?.id ? '' : 'id, '
    } ${insertFields}) VALUES ${Array.isArray(data)
      ? insertValues
        .map((el) => {
          const uuid = generateUUIDv6();
          ids.push(uuid);
          return `('${uuid}', ${el})`;
        })
        .join(', ')
      : `('${data?.id ? data?.id : uuid}',` + values + ')'
    }`;

  const res2 = await runQuery(insert);


  const selectQuery = `SELECT * FROM ${table} WHERE ${data?.id
    ? `id = '${data?.id}'`
    : ids.length > 0
      ? ids.map((id) => `id = '${id}'`).join(' OR ')
      : `id = '${uuid}'`
    }`;

  const res3 = await runQuery(selectQuery);

  return res3;
};

//export const createConnection = async (): Promise<IConnection> => {
//};



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
