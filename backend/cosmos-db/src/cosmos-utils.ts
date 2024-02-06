import {
  Container,
  ContainerResponse,
  CosmosClient,
  Database,
  DatabaseResponse,
  PartitionKeyDefinition,
  UniqueKeyPolicy,
} from '@azure/cosmos';
import { ReadPaginationFilter } from './typescript/api';

export interface FetchData {
  count: number;
  values: any[];
}

const cosmosClient = new CosmosClient({
  endpoint: process.env.PH_COSMOS_ENDPOINT || 'https://localhost:8081/',
  key:
    process.env.PH_COSMOS_KEY ||
    'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==',
});

const cosmosDbName = process.env.COSMOSDB_NAME || 'pv_db';

export const fetchDatabase = async (
  db_name: string,
): Promise<Database | undefined> => {
  try {
    const { database } = await cosmosClient.databases.createIfNotExists({
      id: db_name,
      throughput: 400,
    });
    return database;
  } catch (error) {
    throw error;
  }
};

export const deleteContainer = async (
  containerId: string,
): Promise<ContainerResponse> => {
  const container = await fetchContainer(containerId);

  const res = await container.delete();

  return res;
};

export const fetchContainer = async (
  containerId: string,
  partitionKey: string | PartitionKeyDefinition = {
    paths: ['/id'],
  },
  uniqueKeyPolicy: UniqueKeyPolicy | undefined = undefined,
  initialDoc?: Record<any, any>,
): Promise<Container | undefined> => {
  const database = await fetchDatabase(cosmosDbName);

  const { container, statusCode } = await database.containers.createIfNotExists(
    {
      id: containerId,
      partitionKey,
      uniqueKeyPolicy,
    },
  );

  // Creating initial document when container is created
  if (statusCode === 201 && initialDoc) {
    const res = await container.items.create(initialDoc);
  }

  return container;
};
export const deleteDatabase = async (
  databaseId: string,
): Promise<DatabaseResponse | undefined> => {
  const database = await fetchDatabase(databaseId);
  return database.delete();
};

export const fetchData = async (
  filter: ReadPaginationFilter,
  table: string,
): Promise<FetchData | undefined> => {
  try {
    const query = filterToQuery(filter);

    const container = await fetchContainer(table);

    const countStr = `select VALUE COUNT(1) from c ${query}`;

    const valuesStr = `select * from c ${query}`;

    const values = await container.items
      .query({
        query: valuesStr,
        parameters: [],
      })
      .fetchAll();

    const count = await container.items
      .query({ query: countStr, parameters: [] })
      .fetchAll();

    if (values.resources.length === 0) {
      throw { code: 404, message: `No ${table} has been found.` };
    }

    return { count: count.resources[0], values: values.resources };
  } catch (error) {
    throw error;
  }
};

export const filterToQuery = (body: ReadPaginationFilter) => {
  const query = [];

  let cols = body?.filters;

  const { from, to } = body;

  let colSortStr = '';

  for (const colId in cols) {
    if (cols.hasOwnProperty(colId)) {
      const condition1Filter = cols[colId]?.condition1?.filter;
      const condition2Filter = cols[colId]?.condition2?.filter;

      const filterType = cols[colId]?.filterType;

      const type = cols[colId]?.type?.toLowerCase(); // When we received a object from just one col, the property is on a higher level

      const type1 = cols[colId]?.condition1?.type.toLowerCase();
      const type2 = cols[colId]?.condition2?.type.toLowerCase();

      const operator = cols[colId]?.operator;

      const colQuery = [];

      if (filterType === 'text') {
        const filter = cols[colId]?.filter; // When we received a object from just one col, the property is on a higher level

        if (!condition1Filter) {
          if (type === 'contains') {
            colQuery.push(` CONTAINS(c.${colId}, "${filter}")`);
          }

          if (type === 'not contains') {
            colQuery.push(` NOT CONTAINS(c.${colId}, "${filter}")`);
          }

          if (type === 'starts with') {
            colQuery.push(` STARTSWITH(c.${colId}, "${filter}")`);
          }

          if (type === 'ends with') {
            colQuery.push(` ENDSWITH(c.${colId}, "${filter}")`);
          }

          if (type === 'equals') {
            colQuery.push(` c.${colId} = "${filter}"`);
          }

          if (type === 'not equals') {
            colQuery.push(` NOT c.${colId} = "${filter}"`);
          }
        }

        if (condition1Filter && type1 === 'contains') {
          colQuery.push(` CONTAINS(c.${colId}, "${condition1Filter}")`);
        }

        if (condition2Filter && type2 === 'contains') {
          colQuery.push(
            `${operator} CONTAINS(c.${colId}, "${condition2Filter}")`,
          );
        }

        if (condition1Filter && type1 === 'not contains') {
          colQuery.push(` NOT CONTAINS(c.${colId}, "${condition1Filter}")`);
        }

        if (condition2Filter && type2 === 'not contains') {
          colQuery.push(
            ` ${operator} NOT CONTAINS(c.${colId}, "${condition2Filter}")`,
          );
        }

        if (condition1Filter && type1 === 'starts with') {
          colQuery.push(` STARTSWITH(c.${colId}, "${condition1Filter}")`);
        }

        if (condition2Filter && type2 === 'starts with') {
          colQuery.push(
            ` ${operator} STARTSWITH(c.${colId}, "${condition2Filter}")`,
          );
        }

        if (condition1Filter && type1 === 'ends with') {
          colQuery.push(` ENDSWITH(c.${colId}, "${condition1Filter}")`);
        }

        if (condition2Filter && type2 === 'ends with') {
          colQuery.push(
            ` ${operator} ENDSWITH(c.${colId}, "${condition2Filter}")`,
          );
        }

        if (condition1Filter && type1 === 'equals') {
          colQuery.push(` c.${colId} = "${condition1Filter}"`);
        }

        if (condition2Filter && type2 === 'equals') {
          colQuery.push(` ${operator} c.${colId} = "${condition2Filter}"`);
        }

        if (condition1Filter && type1 === 'not equals') {
          colQuery.push(` NOT c.${colId} = "${condition1Filter}"`);
        }

        if (condition2Filter && type2 === 'not equals') {
          colQuery.push(` ${operator} NOT c.${colId} = "${condition2Filter}"`);
        }
      }
      if (filterType === 'number') {
        const filter = cols[colId]?.filter; // When we received a object from just one col, the property is on a higher level

        if (!condition1Filter) {
          if (type === 'greaterThan') {
            colQuery.push(` CONTAINS(c.${colId}, "${filter}")`);
          }

          if (type === 'greaterThanOrEquals') {
            colQuery.push(` ENDSWITH(c.${colId}, "${filter}")`);
          }
          if (type === 'lessThan') {
            colQuery.push(` NOT CONTAINS(c.${colId}, "${filter}")`);
          }

          if (type === 'lessThanOrEquals') {
            colQuery.push(` STARTSWITH(c.${colId}, "${filter}")`);
          }

          if (type === 'equals') {
            colQuery.push(` c.${colId} = "${filter}"`);
          }

          if (type === 'notEqual') {
            colQuery.push(` NOT c.${colId} = "${filter}"`);
          }

          if (type === 'inRange') {
            const filterFrom = cols[colId].filter;
            const filterTo = cols[colId].filterTo;
            colQuery.push(
              ` c.${colId} >= "${filterFrom}" AND c.${colId} <= "${filterTo}"`,
            );
          }

          if (type === 'blank') {
            colQuery.push(` NOT c.${colId} = "${filter}"`);
          }

          if (type === 'notBlank') {
            colQuery.push(` NOT c.${colId} = "${filter}"`);
          }
        }

        if (condition1Filter && type1 === 'greaterThan') {
          colQuery.push(` c.${colId} > "${condition1Filter}"`);
        }

        if (condition2Filter && type2 === 'greaterThan') {
          colQuery.push(` ${operator} c.${colId} > "${condition2Filter}"`);
        }

        if (condition1Filter && type1 === 'greaterThanOrEquals') {
          colQuery.push(` c.${colId} >= "${condition1Filter}"`);
        }

        if (condition2Filter && type2 === 'greaterThanOrEquals') {
          colQuery.push(` ${operator} c.${colId} >= "${condition2Filter}"`);
        }

        if (condition1Filter && type1 === 'lessThan') {
          colQuery.push(` c.${colId} < "${condition1Filter}"`);
        }

        if (condition2Filter && type2 === 'lessThan') {
          colQuery.push(` ${operator} c.${colId} < "${condition2Filter}"`);
        }

        if (condition1Filter && type1 === 'lessThanOrEquals') {
          colQuery.push(` c.${colId} <= "${condition1Filter}"`);
        }

        if (condition2Filter && type2 === 'lessThanOrEquals') {
          colQuery.push(` ${operator} c.${colId} <= "${condition2Filter}"`);
        }

        if (condition1Filter && type1 === 'equals') {
          colQuery.push(` c.${colId} = "${condition1Filter}"`);
        }

        if (condition2Filter && type2 === 'equals') {
          colQuery.push(` ${operator} c.${colId} = "${condition2Filter}"`);
        }

        if (condition1Filter && type1 === 'notEquals') {
          colQuery.push(` NOT c.${colId} = "${condition1Filter}"`);
        }

        if (condition2Filter && type2 === 'notEquals') {
          colQuery.push(` ${operator} NOT c.${colId} = "${condition2Filter}"`);
        }

        if (condition1Filter && type1 === 'inRange') {
          const filterFrom = cols[colId].condition1.filter;
          const filterTo = cols[colId].condition1.filterTo;
          colQuery.push(
            ` c.${colId} >= "${filterFrom}" AND c.${colId} <= "${filterTo}"`,
          );
        }

        if (condition2Filter && type2 === 'inRange') {
          const filterFrom = cols[colId].condition2.filter;
          const filterTo = cols[colId].condition2.filterTo;
          colQuery.push(
            ` c.${colId} >= "${filterFrom}" AND c.${colId} <= "${filterTo}"`,
          );
        }

        if (condition1Filter && type1 === 'blank') {
          colQuery.push(` c.${colId} = "" AND c.${colId} = null`);
        }

        if (condition2Filter && type2 === 'blank') {
          colQuery.push(` ${operator} c.${colId} = "" AND c.${colId} = null`);
        }

        if (condition1Filter && type1 === 'notBlank') {
          colQuery.push(` c.${colId} != "" AND c.${colId} != null`);
        }

        if (condition2Filter && type2 === 'notBlank') {
          colQuery.push(` ${operator} c.${colId} != "" AND c.${colId} != null`);
        }
      }

      if (filterType === 'date') {
        const date1 =
          cols[colId]?.condition1?.dateFrom &&
          convertToISOString(cols[colId]?.condition1?.dateFrom);
        const date2 =
          cols[colId]?.condition2?.dateFrom &&
          convertToISOString(cols[colId]?.condition2?.dateFrom);

        const condition1DateFrom =
          cols[colId]?.condition1?.dateFrom &&
          convertToISOString(cols[colId]?.condition1?.dateFrom);
        const condition2DateFrom =
          cols[colId]?.condition2?.dateFrom &&
          convertToISOString(cols[colId]?.condition2?.dateFrom);

        const condition1DateTo =
          cols[colId]?.condition1?.dateTo &&
          convertToISOString(cols[colId]?.condition1?.dateTo);
        const condition2DateTo =
          cols[colId]?.condition2?.dateTo &&
          convertToISOString(cols[colId]?.condition2?.dateTo);

        if (!cols[colId]?.condition1) {
          const date =
            cols[colId].dateFrom && convertToISOString(cols[colId].dateFrom);

          if (type === 'greaterthan') {
            colQuery.push(`c.${colId} > "${date}"`);
          }

          if (type === 'lessthan') {
            colQuery.push(` c.${colId} < "${date}"`);
          }

          if (type === 'inrange') {
            const dateFrom =
              cols[colId].dateFrom && convertToISOString(cols[colId].dateFrom);
            const dateTo =
              cols[colId].dateTo && convertToISOString(cols[colId].dateTo);
            colQuery.push(
              ` c.${colId} >= "${dateFrom}" AND c.${colId} <= "${dateTo}"`,
            );
          }

          if (type === 'equals') {
            colQuery.push(` c.${colId} = "${date}"`);
          }

          if (type === 'notequal') {
            colQuery.push(` c.${colId} != "${date}"`);
          }

          if (type === 'blank') {
            colQuery.push(` c.${colId} = "" AND c.${colId} = null`);
          }

          if (type === 'notblank') {
            colQuery.push(` c.${colId} != "" AND c.${colId} != null`);
          }
        }

        if (condition1DateFrom && type1 === 'greaterthan') {
          colQuery.push(` c.${colId} > "${date1}"`);
        }

        if (condition2DateFrom && type2 === 'greaterthan') {
          colQuery.push(` ${operator} c.${colId} > "${date2}"`);
        }

        if (condition1DateFrom && type1 === 'lessthan') {
          colQuery.push(` c.${colId} < "${date1}"`);
        }

        if (condition2DateFrom && type2 === 'lessthan') {
          colQuery.push(` ${operator} c.${colId} < "${date2}"`);
        }

        if (condition1DateFrom && type1 === 'blank') {
          colQuery.push(` c.${colId} = "" AND c.${colId} = null`);
        }

        if (condition2DateFrom && type2 === 'blank') {
          colQuery.push(` ${operator} c.${colId} = "" AND c.${colId} = null`);
        }

        if (condition1DateFrom && type1 === 'notblank') {
          colQuery.push(` c.${colId} != "" AND c.${colId} != null`);
        }

        if (condition2DateFrom && type2 === 'notblank') {
          colQuery.push(` ${operator} c.${colId} != "" AND c.${colId} != null`);
        }

        if (condition1DateFrom && type1 === 'equals') {
          colQuery.push(` c.${colId} = ${condition1DateFrom}`);
        }

        if (condition2DateFrom && type2 === 'equals') {
          colQuery.push(` ${operator} c.${colId} = ${condition2DateFrom}`);
        }

        if (condition1DateFrom && type1 === 'notequal') {
          colQuery.push(` c.${colId} != ${condition1DateFrom}`);
        }

        if (condition2DateFrom && type2 === 'notequal') {
          colQuery.push(` ${operator} c.${colId} != ${condition2DateFrom}`);
        }

        if (condition1DateFrom && type1 === 'inrange') {
          const multiCol = Object.keys(cols).length > 1;
          colQuery.push(
            ` ${
              multiCol ? '(' : ''
            }c.${colId} >= "${condition1DateFrom}" AND c.${colId} <= "${condition1DateTo}"` +
              (condition2DateFrom ? ')' : ''),
          );
        }

        if (condition2DateFrom && type2 === 'inrange') {
          const multiCol = Object.keys(cols).length > 1;
          colQuery.push(
            ` ${operator} (c.${colId} >= "${condition2DateFrom}" AND c.${colId} <= "${condition2DateTo}"${
              multiCol ? ')' : ''
            }`,
          );
        }
      }

      const colSort = cols[colId].sort;

      if (!!colSort) {
        colSortStr = `c.${colId} ${colSort}`;
      }
      const colQueryStr = colQuery.join('').trim();

      query.push(colQuery.length > 1 ? `(${colQueryStr})` : `${colQueryStr}`);
    }
  }

  for (let i = 0; i < query.length; i++) {
    // Replace the first occurrence of "WHERE" with "AND" in each element
    if (i > 0) {
      query[i] = query[i].replace('WHERE', 'AND');
    }
  }

  const finalQuery = (
    (Object.keys(body.filters).length > 0 ? ' WHERE ' : '') +
    query.join(' and ') +
    (colSortStr ? ` ORDER BY ${colSortStr}` : '') +
    `${from ? ' OFFSET ' + (from - 1) : ''} ${to ? 'LIMIT ' + (to - from) : ''}`
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
