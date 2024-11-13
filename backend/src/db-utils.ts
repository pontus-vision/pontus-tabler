import { DELTA_DB } from './service/AuthGroupService';
import { ReadPaginationFilter } from './typescript/api';
import Pool, { IConnection }  from '../pontus-node-jdbc/src/pool';
import {JDBC} from '../pontus-node-jdbc/src/index';

export const config= {
  url: process.env['P_DELTA_TABLE_HIVE_SERVER'] || 'jdbc:hive2://localhost:10000', // Update the connection URL according to your setup
  drivername: 'org.apache.hive.jdbc.HiveDriver', // Driver class name
  properties: {
    user: 'NBuser',
    password: '',
  },
};

const pool = new Pool({
    url: 'jdbc:hive2://delta-db:10000',   // Replace with your JDBC URL
    properties: {
      user: 'admin',           // Database username
      password: 'user'        // Database password
    },
    drivername: 'org.apache.hive.jdbc.HiveDriver', // Driver class name
    minpoolsize: 2,
    maxpoolsize: 10,
    keepalive: {
      interval: 60000,
      query: 'SELECT 1',
      enabled: true
    },
    logging: {
      level: 'info'
    }
  });
  const jdbc = new JDBC(config);

// Initialize pool
async function initializePool() {
  try {
    await pool.initialize();
    console.log('Pool initialized successfully.');
  } catch (error) {
    console.error('Error initializing the pool:', error);
  }
}

(async () => {
  await initializePool();
})();
  export const createConnection = async():Promise<IConnection> => {
    const reservedConn = await jdbc.reserve()
    return reservedConn.conn
  };

export async function runQuery(query: string): Promise<Record<string,any>[]> {
  try {
    console.log({query})
      const connection = await createConnection();
      const preparedStatement = await connection.prepareStatement(query); // Replace `your_table` with your actual table name

      const resultSet = await preparedStatement.executeQuery();
      const results = await resultSet.toObjArray(); // Assuming you have a method to convert ResultSet to an array

      console.log('Query Results:', results);
      
      // Remember to release the connection after you are done
      await pool.release(connection);

      return results
  } catch (error) {
      console.error('Error executing query:', error);
  }
}

export const filterToQuery = (
  body: ReadPaginationFilter,
  alias = 'c',
  additionalClause?: string,
) => {
  const query = [];

  let cols = body?.filters;

  const { from, to } = body;

  let colSortStr = '';

  for (let col in cols) {
    if (cols.hasOwnProperty(col)) {
      const colName =
        process.env.DB_SOURCE === DELTA_DB
          ? col.includes('-')
            ? `\`${col}\``
            : col
          : `["${col}"]`;

      const condition1Filter = cols[col]?.condition1?.filter;
      const condition2Filter = cols[col]?.condition2?.filter;
      const conditions = cols[col]?.conditions;

      const filterType = cols[col]?.filterType;

      const type = cols[col]?.type?.toLowerCase(); // When we received a object from just one colName, the property is on a higher level

      const type1 = cols[col]?.condition1?.type.toLowerCase();
      const type2 = cols[col]?.condition2?.type.toLowerCase();

      const operator = cols[col]?.operator;

      const colQuery = [];

      if (filterType === 'text') {
        const filter = cols[col]?.filter; // When we received a object from just one colName, the property is on a higher level

        if (conditions?.length > 0) {
          for (const condition of conditions) {
            if (process.env.DB_SOURCE === DELTA_DB) {
              if (type === 'contains') {
                colQuery.push(` ${colName} LIKE '%${filter}%'`);
              }

              if (type === 'not contains') {
                colQuery.push(` ${colName} NOT LIKE '%${filter}%'`);
              }

              if (type === 'starts with') {
                colQuery.push(` ${colName} LIKE '${filter}%'`);
              }

              if (type === 'ends with') {
                colQuery.push(` ${colName} LIKE '%${filter}'`);
              }

              if (type === 'equals') {
                colQuery.push(` ${alias}${colName} = '${filter}'`);
              }

              if (type === 'not equals') {
                colQuery.push(` NOT ${alias}${colName} = '${filter}'`);
              }
            } else {
              if (type === 'contains') {
                colQuery.push(` CONTAINS(${alias}${colName}, '${filter}')`);
              }

              if (type === 'not contains') {
                colQuery.push(` NOT CONTAINS(${alias}${colName}, '${filter}')`);
              }

              if (type === 'starts with') {
                colQuery.push(` STARTSWITH(${alias}${colName}, '${filter}')`);
              }

              if (type === 'ends with') {
                colQuery.push(` ENDSWITH(${alias}${colName}, '${filter}')`);
              }

              if (type === 'equals') {
                colQuery.push(` ${alias}${colName} = '${filter}'`);
              }

              if (type === 'not equals') {
                colQuery.push(` NOT ${alias}${colName} = '${filter}'`);
              }
            }
          }
        }

        if (!condition1Filter) {
          if (process.env.DB_SOURCE === DELTA_DB) {
            if (type === 'contains') {
              colQuery.push(` ${colName} LIKE '%${filter}%'`);
            }

            if (type === 'not contains') {
              colQuery.push(` ${colName} NOT LIKE '%${filter}%'`);
            }

            if (type === 'starts with') {
              colQuery.push(` ${colName} LIKE '${filter}%'`);
            }

            if (type === 'ends with') {
              colQuery.push(` ${colName} LIKE '%${filter}'`);
            }

            if (type === 'equals') {
              colQuery.push(` ${alias}${colName} = '${filter}'`);
            }

            if (type === 'not equals') {
              colQuery.push(` NOT ${alias}${colName} = '${filter}'`);
            }
          } else {
            if (type === 'contains') {
              colQuery.push(` CONTAINS(${alias}${colName}, '${filter}')`);
            }

            if (type === 'not contains') {
              colQuery.push(` NOT CONTAINS(${alias}${colName}, '${filter}')`);
            }

            if (type === 'starts with') {
              colQuery.push(` STARTSWITH(${alias}${colName}, '${filter}')`);
            }

            if (type === 'ends with') {
              colQuery.push(` ENDSWITH(${alias}${colName}, '${filter}')`);
            }

            if (type === 'equals') {
              colQuery.push(` ${alias}${colName} = '${filter}'`);
            }

            if (type === 'not equals') {
              colQuery.push(` NOT ${alias}${colName} = '${filter}'`);
            }
          }
        }

        if (condition1Filter && type1 === 'contains') {
          if (process.env.DB_SOURCE === DELTA_DB) {
            colQuery.push(` ${colName} LIKE '%${condition1Filter}%'`);
          } else {
            colQuery.push(
              ` CONTAINS(${alias}${colName}, '${condition1Filter}')`,
            );
          }
        }

        if (condition2Filter && type2 === 'contains') {
          if (process.env.DB_SOURCE === DELTA_DB) {
            colQuery.push(
              ` ${operator} ${colName} LIKE '%${condition2Filter}%'`,
            );
          } else {
            colQuery.push(
              ` ${operator} AND CONTAINS(${alias}${colName}, '${condition2Filter}')`,
            );
          }
        }

        if (condition1Filter && type1 === 'not contains') {
          if (process.env.DB_SOURCE === DELTA_DB) {
            colQuery.push(` ${colName} LIKE '%${condition1Filter}%'`);
          } else {
            colQuery.push(
              ` CONTAINS(${alias}${colName}, '${condition1Filter}')`,
            );
          }
        }

        if (condition2Filter && type2 === 'not contains') {
          if (process.env.DB_SOURCE === DELTA_DB) {
            colQuery.push(` AND ${colName} LIKE '%${condition2Filter}%'`);
          } else {
            colQuery.push(
              ` AND CONTAINS(${alias}${colName}, '${condition2Filter}')`,
            );
          }
        }

        if (condition1Filter && type1 === 'starts with') {
          if (process.env.DB_SOURCE === DELTA_DB) {
            colQuery.push(` ${colName} LIKE '${condition1Filter}%'`);
          } else {
            colQuery.push(
              ` STARTSWITH(${alias}${colName}, '${condition1Filter}')`,
            );
          }
        }

        if (condition2Filter && type2 === 'starts with') {
          if (process.env.DB_SOURCE === DELTA_DB) {
            colQuery.push(` AND ${colName} LIKE '${condition2Filter}%'`);
          } else {
            colQuery.push(
              ` AND STARTSWITH(${alias}${colName}, '${condition2Filter}')`,
            );
          }
        }

        if (condition1Filter && type1 === 'ends with') {
          if (process.env.DB_SOURCE === DELTA_DB) {
            colQuery.push(` ${colName} LIKE '%${condition1Filter}'`);
          } else {
            colQuery.push(
              ` ENDSWITH(${alias}${colName}, '${condition1Filter}')`,
            );
          }
        }

        if (condition2Filter && type2 === 'ends with') {
          if (process.env.DB_SOURCE === DELTA_DB) {
            colQuery.push(` AND ${colName} LIKE '%${condition2Filter}'`);
          } else {
            colQuery.push(
              ` ${operator} ENDSWITH(${alias}${colName}, '${condition2Filter}')`,
            );
          }
        }

        if (condition1Filter && type1 === 'equals') {
          colQuery.push(` ${alias}${colName} = '${condition1Filter}'`);
        }

        if (condition2Filter && type2 === 'equals') {
          colQuery.push(
            ` ${operator} ${alias}${colName} = '${condition2Filter}'`,
          );
        }

        if (condition1Filter && type1 === 'not equals') {
          colQuery.push(` NOT ${alias}${colName} = '${condition1Filter}'`);
        }

        if (condition2Filter && type2 === 'not equals') {
          colQuery.push(
            ` ${operator} NOT ${alias}${colName} = '${condition2Filter}'`,
          );
        }
      }
      if (filterType === 'number') {
        const filter = cols[col]?.filter; // When we received a object from just one colName, the property is on a higher level

        if (!condition1Filter) {
          if (process.env.DB_SOURCE === DELTA_DB) {
            if (type === 'greaterThan') {
              colQuery.push(` ${alias}${colName} > '${condition1Filter}'`);
            }

            if (type === 'greaterThanOrEquals') {
              colQuery.push(` ${alias}${colName} >= '${condition1Filter}'`);
            }
            if (type === 'lessThan') {
              colQuery.push(` ${alias}${colName} < '${condition1Filter}'`);
            }

            if (type === 'lessThanOrEquals') {
              colQuery.push(` ${alias}${colName} <= '${condition1Filter}'`);
            }

            if (type === 'equals') {
              colQuery.push(` ${alias}${colName} = '${filter}'`);
            }

            if (type === 'notEqual') {
              colQuery.push(` NOT ${alias}${colName} = '${filter}'`);
            }

            if (type === 'inRange') {
              const filterFrom = cols[col].filter;
              const filterTo = cols[col].filterTo;
              colQuery.push(
                ` ${alias}${colName} >= '${filterFrom}' AND ${alias}${colName} <= '${filterTo}'`,
              );
            }

            if (type === 'blank') {
              colQuery.push(` NOT ${alias}${colName} = '${filter}'`);
            }

            if (type === 'notBlank') {
              colQuery.push(` NOT ${alias}${colName} = '${filter}'`);
            }
          }
          if (type === 'greaterThan') {
            colQuery.push(` ${alias}${colName} > '${condition1Filter}'`);
          }

          if (type === 'greaterThanOrEquals') {
            colQuery.push(` ${alias}${colName} >= '${condition1Filter}'`);
          }
          if (type === 'lessThan') {
            colQuery.push(` ${alias}${colName} < '${condition1Filter}'`);
          }

          if (type === 'lessThanOrEquals') {
            colQuery.push(` ${alias}${colName} <= '${condition1Filter}'`);
          }

          if (type === 'equals') {
            colQuery.push(` ${alias}${colName} = '${filter}'`);
          }

          if (type === 'notEqual') {
            colQuery.push(` NOT ${alias}${colName} = '${filter}'`);
          }

          if (type === 'inRange') {
            const filterFrom = cols[col].filter;
            const filterTo = cols[col].filterTo;
            colQuery.push(
              ` ${alias}${colName} >= '${filterFrom}' AND ${alias}${colName} <= '${filterTo}'`,
            );
          }

          if (type === 'blank') {
            colQuery.push(` NOT ${alias}${colName} = '${filter}'`);
          }

          if (type === 'notBlank') {
            colQuery.push(` NOT ${alias}${colName} = '${filter}'`);
          }
        }

        if (condition1Filter && type1 === 'greaterThan') {
          colQuery.push(` ${alias}${colName} > '${condition1Filter}'`);
        }

        if (condition2Filter && type2 === 'greaterThan') {
          colQuery.push(
            ` ${operator} ${alias}${colName} > '${condition2Filter}'`,
          );
        }

        if (condition1Filter && type1 === 'greaterThanOrEquals') {
          colQuery.push(` ${alias}${colName} >= '${condition1Filter}'`);
        }

        if (condition2Filter && type2 === 'greaterThanOrEquals') {
          colQuery.push(
            ` ${operator} ${alias}${colName} >= '${condition2Filter}'`,
          );
        }

        if (condition1Filter && type1 === 'lessThan') {
          colQuery.push(` ${alias}${colName} < '${condition1Filter}'`);
        }

        if (condition2Filter && type2 === 'lessThan') {
          colQuery.push(
            ` ${operator} ${alias}${colName} < '${condition2Filter}'`,
          );
        }

        if (condition1Filter && type1 === 'lessThanOrEquals') {
          colQuery.push(` ${alias}${colName} <= '${condition1Filter}'`);
        }

        if (condition2Filter && type2 === 'lessThanOrEquals') {
          colQuery.push(
            ` ${operator} ${alias}${colName} <= '${condition2Filter}'`,
          );
        }

        if (condition1Filter && type1 === 'equals') {
          colQuery.push(` ${alias}${colName} = '${condition1Filter}'`);
        }

        if (condition2Filter && type2 === 'equals') {
          colQuery.push(
            ` ${operator} ${alias}${colName} = '${condition2Filter}'`,
          );
        }

        if (condition1Filter && type1 === 'notEquals') {
          colQuery.push(` NOT ${alias}${colName} = '${condition1Filter}'`);
        }

        if (condition2Filter && type2 === 'notEquals') {
          colQuery.push(
            ` ${operator} NOT ${alias}${colName} = '${condition2Filter}'`,
          );
        }

        if (condition1Filter && type1 === 'inRange') {
          const filterFrom = cols[col].condition1.filter;
          const filterTo = cols[col].condition1.filterTo;
          colQuery.push(
            ` ${alias}${colName} >= '${filterFrom}' AND ${alias}${colName} <= '${filterTo}'`,
          );
        }

        if (condition2Filter && type2 === 'inRange') {
          const filterFrom = cols[col].condition2.filter;
          const filterTo = cols[col].condition2.filterTo;
          colQuery.push(
            ` ${alias}${colName} >= '${filterFrom}' AND ${alias}${colName} <= '${filterTo}'`,
          );
        }

        if (condition1Filter && type1 === 'blank') {
          colQuery.push(
            ` ${alias}${colName} = '' AND ${alias}${colName} = null`,
          );
        }

        if (condition2Filter && type2 === 'blank') {
          colQuery.push(
            ` ${operator} ${alias}${colName} = '' AND ${alias}${colName} = null`,
          );
        }

        if (condition1Filter && type1 === 'notBlank') {
          colQuery.push(
            ` ${alias}${colName} != '' AND ${alias}${colName} != null`,
          );
        }

        if (condition2Filter && type2 === 'notBlank') {
          colQuery.push(
            ` ${operator} ${alias}${colName} != '' AND ${alias}${colName} != null`,
          );
        }
      }

      if (filterType === 'date') {
        const date1 =
          cols[col]?.condition1?.dateFrom &&
          convertToISOString(cols[col]?.condition1?.dateFrom);
        const date2 =
          cols[col]?.condition2?.dateFrom &&
          convertToISOString(cols[col]?.condition2?.dateFrom);

        const condition1DateFrom =
          cols[col]?.condition1?.dateFrom &&
          convertToISOString(cols[col]?.condition1?.dateFrom);
        const condition2DateFrom =
          cols[col]?.condition2?.dateFrom &&
          convertToISOString(cols[col]?.condition2?.dateFrom);

        const condition1DateTo =
          cols[col]?.condition1?.dateTo &&
          convertToISOString(cols[col]?.condition1?.dateTo);
        const condition2DateTo =
          cols[col]?.condition2?.dateTo &&
          convertToISOString(cols[col]?.condition2?.dateTo);

        if (!cols[col]?.condition1) {
          const date =
            cols[col].dateFrom && convertToISOString(cols[col].dateFrom);

          if (type === 'greaterthan') {
            colQuery.push(`${alias}${colName} > '${date}'`);
          }

          if (type === 'lessthan') {
            colQuery.push(` ${alias}${colName} < '${date}'`);
          }

          if (type === 'inrange') {
            const dateFrom =
              cols[col].dateFrom && convertToISOString(cols[col].dateFrom);
            const dateTo =
              cols[col].dateTo && convertToISOString(cols[col].dateTo);
            colQuery.push(
              ` ${alias}${colName} >= '${dateFrom}' AND ${alias}${colName} <= '${dateTo}'`,
            );
          }

          if (type === 'equals') {
            colQuery.push(` ${alias}${colName} = '${date}'`);
          }

          if (type === 'notequal') {
            colQuery.push(` ${alias}${colName} != '${date}'`);
          }

          if (type === 'blank') {
            colQuery.push(
              ` ${alias}${colName} = '' AND ${alias}${colName} = null`,
            );
          }

          if (type === 'notblank') {
            colQuery.push(
              ` ${alias}${colName} != '' AND ${alias}${colName} != null`,
            );
          }
        }

        if (condition1DateFrom && type1 === 'greaterthan') {
          colQuery.push(` ${alias}${colName} > '${date1}'`);
        }

        if (condition2DateFrom && type2 === 'greaterthan') {
          colQuery.push(` ${operator} ${alias}${colName} > '${date2}'`);
        }

        if (condition1DateFrom && type1 === 'lessthan') {
          colQuery.push(` ${alias}${colName} < '${date1}'`);
        }

        if (condition2DateFrom && type2 === 'lessthan') {
          colQuery.push(` ${operator} ${alias}${colName} < '${date2}'`);
        }

        if (condition1DateFrom && type1 === 'blank') {
          colQuery.push(
            ` ${alias}${colName} = '' AND ${alias}${colName} = null`,
          );
        }

        if (condition2DateFrom && type2 === 'blank') {
          colQuery.push(
            ` ${operator} ${alias}${colName} = '' AND ${alias}${colName} = null`,
          );
        }

        if (condition1DateFrom && type1 === 'notblank') {
          colQuery.push(
            ` ${alias}${colName} != '' AND ${alias}${colName} != null`,
          );
        }

        if (condition2DateFrom && type2 === 'notblank') {
          colQuery.push(
            ` ${operator} ${alias}${colName} != '' AND ${alias}${colName} != null`,
          );
        }

        if (condition1DateFrom && type1 === 'equals') {
          colQuery.push(` ${alias}${colName} = ${condition1DateFrom}`);
        }

        if (condition2DateFrom && type2 === 'equals') {
          colQuery.push(
            ` ${operator} ${alias}${colName} = ${condition2DateFrom}`,
          );
        }

        if (condition1DateFrom && type1 === 'notequal') {
          colQuery.push(` ${alias}${colName} != ${condition1DateFrom}`);
        }

        if (condition2DateFrom && type2 === 'notequal') {
          colQuery.push(
            ` ${operator} ${alias}${colName} != ${condition2DateFrom}`,
          );
        }

        if (condition1DateFrom && type1 === 'inrange') {
          const multiCol = Object.keys(cols).length > 1;
          colQuery.push(
            ` ${
              multiCol ? '(' : ''
            }${alias}${colName} >= '${condition1DateFrom}' AND ${alias}${colName} <= '${condition1DateTo}'` +
              (condition2DateFrom ? ')' : ''),
          );
        }

        if (condition2DateFrom && type2 === 'inrange') {
          const multiCol = Object.keys(cols).length > 1;
          colQuery.push(
            ` ${operator} (${alias}${colName} >= '${condition2DateFrom}' AND ${alias}${colName} <= '${condition2DateTo}'${
              multiCol ? ')' : ''
            }`,
          );
        }
      }

      const colSort = cols[col].sort;

      if (!!colSort) {
        colSortStr = `${alias}${colName} ${colSort}`;
      }
      const colQueryStr = colQuery.join('').trim();

      if (process.env.DB_SOURCE === DELTA_DB) {
        query.push(`${colQueryStr}`);
      } else {
        query.push(colQuery.length > 1 ? `(${colQueryStr})` : `${colQueryStr}`);
      }
    }
  }

  for (let i = 0; i < query.length; i++) {
    // Replace the first occurrence of 'WHERE' with 'AND' in each element
    if (i > 0) {
      query[i] = query[i].replace('WHERE', 'AND');
    }
  }

  const hasFilters = Object.keys(body?.filters || {}).length > 0;
  const fromTo =
    process.env.DB_SOURCE === DELTA_DB
      ? ` ${to ? 'LIMIT ' + (to - from) : ''} ${
          from ? ' OFFSET ' + (from - 1) : ''
        }`
      : `${from ? ' OFFSET ' + (from - 1) : ''} ${
          to ? 'LIMIT ' + (to - from) : ''
        }`;

  const finalQuery = (
    (hasFilters ? ' WHERE ' : '') +
    query.join(' and ') +
    (colSortStr ? ` ORDER BY ${colSortStr}` : '') +
    (additionalClause
      ? ` ${hasFilters ? 'AND' : 'WHERE'} ${additionalClause}`
      : '') +
    fromTo
  ).trim();

  return finalQuery;
};

const convertToISOString = (dateString) => {
  const parts = dateString.split(' ');
  const dateParts = parts[0].split('-');
  const timeParts = parts[1].split(':');

  const date = new Date(
    Date.UTC(
      dateParts[0],
      dateParts[1] - 1,
      dateParts[2],
      timeParts[0],
      timeParts[1],
      timeParts[2],
    ),
  );

  const year = date.getUTCFullYear();
  const month = ('0' + (date.getUTCMonth() + 1)).slice(-2); // Months are 0-indexed, so we add 1. Also, we add a leading zero if necessary.
  const day = ('0' + date.getUTCDate()).slice(-2); // Add a leading zero if necessary.
  const hours = ('0' + date.getUTCHours()).slice(-2); // Add a leading zero if necessary.
  const minutes = ('0' + date.getUTCMinutes()).slice(-2); // Add a leading zero if necessary.
  const seconds = ('0' + date.getUTCSeconds()).slice(-2); // Add a leading zero if necessary.

  const isoDateString =
    year +
    '-' +
    month +
    '-' +
    day +
    'T' +
    hours +
    ':' +
    minutes +
    ':' +
    seconds +
    'Z';

  return isoDateString;
};
