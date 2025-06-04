import { DELTA_DB } from "./consts";
import { ReadPaginationFilter } from "./typescript/api";

export const removeFalsyValues =<T extends Record<string, any>>(obj: T): Record<string,any> => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => Boolean(value))
    );
  }

  export const filterToQuery = (
    body: ReadPaginationFilter,
    alias = 'c',
    additionalClause?: string,
    onlyParams = false
  ): {queryStr: string; params: any[]} => {
    const query = [];
    const params: any[] = [];
  
    let cols = body?.filters;
  
    const { from, to } = body;
  
    let colSortStr = '';
    if (process.env.DB_SOURCE && alias) {
      alias = `${alias}.`
    }
  
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
                  colQuery.push(` ${alias}${colName} LIKE ?`);
                  params.push(`%${filter}%`);
                }
  
                if (type === 'notcontains') {
                  colQuery.push(` ${alias}${colName} NOT LIKE ?`);
                  params.push(`%${filter}%`);
                }
  
                if (type === 'startswith') {
                  colQuery.push(` ${alias}${colName} LIKE ?`);
                  params.push(`${filter}%`);
                }
  
                if (type === 'endswith') {
                    colQuery.push(` ${alias}${colName} LIKE ?`);
                    params.push(`%${filter}`);
                }
  
                if (type === 'equals') {
                    colQuery.push(` ${alias}${colName} = ?`);
                    params.push(filter);
                }
  
                if (type === 'notequals') {
                  colQuery.push(` NOT ${alias}${colName} = ?`);
                  params.push(filter);
                }
              } else {
                if (type === 'contains') {
                  colQuery.push(` CONTAINS(${alias}${colName}, ?)`);
                  params.push(filter);
                }
  
                if (type === 'notcontains') {
                  colQuery.push(` NOT CONTAINS(${alias}${colName}, ?)`);
                  params.push(filter);
                }
  
                if (type === 'startswith') {
                  colQuery.push(` STARTSWITH(${alias}${colName}, ?)`);
                  params.push(filter);
                }
  
                if (type === 'endswith') {
                  colQuery.push(` ENDSWITH(${alias}${colName}, ?)`);
                  params.push(filter);
                }
  
                if (type === 'equals') {
                  colQuery.push(` ${alias}${colName} = ?`);
                  params.push(filter);
                }
  
                if (type === 'notequals') {
                  colQuery.push(` NOT ${alias}${colName} = ?`);
                  params.push(filter);
                }
              }
            }
          }
  
          if (!condition1Filter) {
            if (process.env.DB_SOURCE === DELTA_DB) {
              if (type === 'contains') {
                colQuery.push(` ${alias}${colName} LIKE ?`);
                params.push(`%${filter}%`);
              }
  
              if (type === 'not contains') {
                colQuery.push(` ${alias}${colName} NOT LIKE ?`);
                params.push(`%${filter}%`);
              }
  
              if (type === 'startswith') {
                colQuery.push(` ${alias}${colName} LIKE ?`);
                params.push(`${filter}%`);
              }
  
              if (type === 'ends with') {
                colQuery.push(` ${alias}${colName} LIKE ?`);
                params.push(`%${filter}`);
              }
  
              if (type === 'equals') {
                colQuery.push(` ${alias}${colName} = ?`);
                params.push(filter);
              }
  
              if (type === 'not equals') {
                colQuery.push(` NOT ${alias}${colName} = ?`);
                params.push(filter);
              }
            } else {
              if (type === 'contains') {
                colQuery.push(` CONTAINS(${alias}${colName}, ?)`);
                params.push(filter);
              }
  
              if (type === 'not contains') {
                colQuery.push(` NOT CONTAINS(${alias}${colName}, ?)`);
                params.push(filter);
              }
  
              if (type === 'starts with') {
                colQuery.push(` STARTSWITH(${alias}${colName}, ?)`);
                params.push(filter);
              }
  
              if (type === 'ends with') {
                colQuery.push(` ENDSWITH(${alias}${colName}, ?)`);
                params.push(filter);
              }
  
              if (type === 'equals') {
                colQuery.push(` ${alias}${colName} = ?`);
                params.push(filter);
              }
  
              if (type === 'not equals') {
                colQuery.push(` NOT ${alias}${colName} = ?`);
                params.push(filter);
              }
            }
          }
  
          if (condition1Filter && type1 === 'contains') {
            if (process.env.DB_SOURCE === DELTA_DB) {
              colQuery.push(` ${alias}${colName} LIKE ?`);
              params.push(`%${condition1Filter}%`);
            } else {
              colQuery.push(` CONTAINS(${alias}${colName}, ?)`);
              params.push(condition1Filter);
            }
          }
  
          if (condition2Filter && type2 === 'contains') {
            if (process.env.DB_SOURCE === DELTA_DB) {
              colQuery.push(` ${operator} ${alias}${colName} LIKE ?`);
              params.push(`%${condition2Filter}%`);
            } else {
              colQuery.push(` ${operator} AND CONTAINS(${alias}${colName}, ?)`);
              params.push(condition2Filter);
            }
          }
  
          if (condition1Filter && type1 === 'not contains') {
            if (process.env.DB_SOURCE === DELTA_DB) {
              colQuery.push(` ${alias}${colName} LIKE ?`);
              params.push(`%${condition1Filter}%`);
            } else {
              colQuery.push(` CONTAINS(${alias}${colName}, ?)`);
              params.push(condition1Filter);
            }
          }
  
          if (condition2Filter && type2 === 'not contains') {
            if (process.env.DB_SOURCE === DELTA_DB) {
              colQuery.push(` AND ${alias}${colName} LIKE ?`);
              params.push(`%${condition2Filter}%`);
            } else {
              colQuery.push(` AND CONTAINS(${alias}${colName}, ?)`);
              params.push(condition2Filter);
            }
          }
  
          if (condition1Filter && type1 === 'starts with') {
            if (process.env.DB_SOURCE === DELTA_DB) {
              colQuery.push(` ${alias}${colName} LIKE ?`);
              params.push(`${condition1Filter}%`);
            } else {
              colQuery.push(` STARTSWITH(${alias}${colName}, ?)`);
              params.push(condition1Filter);
            }
          }
  
          if (condition2Filter && type2 === 'starts with') {
            if (process.env.DB_SOURCE === DELTA_DB) {
              colQuery.push(` AND ${alias}${colName} LIKE ?`);
              params.push(`${condition2Filter}%`);
            } else {
              colQuery.push(` AND STARTSWITH(${alias}${colName}, ?)`);
              params.push(condition2Filter);
            }
          }
  
          if (condition1Filter && type1 === 'ends with') {
            if (process.env.DB_SOURCE === DELTA_DB) {
              colQuery.push(` ${alias}${colName} LIKE ?`);
              params.push(`%${condition1Filter}`);
            } else {
              colQuery.push(` ENDSWITH(${alias}${colName}, ?)`);
              params.push(condition1Filter);
            }
          }
  
          if (condition2Filter && type2 === 'ends with') {
            if (process.env.DB_SOURCE === DELTA_DB) {
              colQuery.push(` AND ${alias}${colName} LIKE ?`);
              params.push(`%${condition2Filter}`);
            } else {
              colQuery.push(` ${operator} ENDSWITH(${alias}${colName}, ?)`);
              params.push(condition2Filter);
            }
          }
  
          if (condition1Filter && type1 === 'equals') {
            colQuery.push(` ${alias}${colName} = ?`);
            params.push(condition1Filter);
          }
  
          if (condition2Filter && type2 === 'equals') {
            colQuery.push(` ${operator} ${alias}${colName} = ?`);
            params.push(condition2Filter);
          }
  
          if (condition1Filter && type1 === 'not equals') {
            colQuery.push(` NOT ${alias}${colName} = ?`);
            params.push(condition1Filter);
          }
  
          if (condition2Filter && type2 === 'not equals') {
            colQuery.push(` ${operator} NOT ${alias}${colName} = ?`);
            params.push(condition2Filter);
          }
        }
        if (filterType === 'number') {
          const filter = cols[col]?.filter; // When we received a object from just one colName, the property is on a higher level
  
          if (!condition1Filter) {
            if (process.env.DB_SOURCE === DELTA_DB) {
              if (type === 'greaterThan') {
                colQuery.push(` ${alias}${colName} > ?`);
                params.push(filter);
              }
  
              if (type === 'greaterThanOrEquals') {
                colQuery.push(` ${alias}${colName} >= ?`);
                params.push(filter);
              }
              if (type === 'lessThan') {
                colQuery.push(` ${alias}${colName} < ?`);
                params.push(filter);
              }
  
              if (type === 'lessThanOrEquals') {
                colQuery.push(` ${alias}${colName} <= ?`);
                params.push(filter);
              }
  
              if (type === 'equals') {
                colQuery.push(` ${alias}${colName} = ?`);
                params.push(filter);
              }
  
              if (type === 'notEqual') {
                colQuery.push(` NOT ${alias}${colName} = ?`);
                params.push(filter);
              }
  
              if (type === 'inRange') {
                const filterFrom = cols[col].filter;
                const filterTo = cols[col].filterTo;

                colQuery.push(` ${alias}${colName} >= ? AND ${alias}${colName} <= ?`);
                params.push(filterFrom, filterTo);
              }
  
              if (type === 'blank') {
                colQuery.push(` NOT ${alias}${colName} = ?`);
                params.push(filter);
              }
  
              if (type === 'notBlank') {
                colQuery.push(` NOT ${alias}${colName} = ?`);
                params.push(filter);
              }
            }
            if (type === 'greaterThan') {
              colQuery.push(` ${alias}${colName} > ?`);
              params.push(condition1Filter)
            }
  
            if (type === 'greaterThanOrEquals') {
              colQuery.push(` ${alias}${colName} >= ?`);
              params.push(condition1Filter)
            }
            if (type === 'lessThan') {
              colQuery.push(` ${alias}${colName} < ?`);
              params.push(condition1Filter)
            }
  
            if (type === 'lessThanOrEquals') {
              colQuery.push(` ${alias}${colName} <= ?`);
              params.push(condition1Filter)
            }
  
            if (type === 'equals') {
              colQuery.push(` ${alias}${colName} = ?`);
              params.push(condition1Filter)
            }
  
            if (type === 'notEqual') {
              colQuery.push(` NOT ${alias}${colName} = ?`);
              params.push(condition1Filter)
            }
  
            if (type === 'inRange') {
              const filterFrom = cols[col].filter;
              const filterTo = cols[col].filterTo;
              colQuery.push(
                ` ${alias}${colName} >= ? AND ${alias}${colName} <= ?`,
              );
              params.push(filterFrom, filterTo)
            }
  
            if (type === 'blank') {
              colQuery.push(` NOT ${alias}${colName} = ?`);
              params.push(filter)
            }
  
            if (type === 'notBlank') {
              colQuery.push(` NOT ${alias}${colName} = ?`);
              params.push(filter)
            }
          }
  
          if (condition1Filter && type1 === 'greaterThan') {
            colQuery.push(` ${alias}${colName} > ?`);
            params.push(condition1Filter)
          }
  
          if (condition2Filter && type2 === 'greaterThan') {
            colQuery.push(
              ` ${operator} ${alias}${colName} > ?`,
            );
            params.push(condition2Filter)
          }
  
          if (condition1Filter && type1 === 'greaterThanOrEquals') {
            colQuery.push(` ${alias}${colName} >= ?`);
            params.push(condition1Filter)
          }
  
          if (condition2Filter && type2 === 'greaterThanOrEquals') {
            colQuery.push(
              ` ${operator} ${alias}${colName} >= ?`,
            );
            params.push(condition2Filter)
          }
  
          if (condition1Filter && type1 === 'lessThan') {
            colQuery.push(` ${alias}${colName} < ?`);
            params.push(condition1Filter)
          }
  
          if (condition2Filter && type2 === 'lessThan') {
            colQuery.push(
              ` ${operator} ${alias}${colName} < ?`,
            );
            params.push(condition2Filter)
          }
  
          if (condition1Filter && type1 === 'lessThanOrEquals') {
            colQuery.push(` ${alias}${colName} <= ?`);
            params.push(condition1Filter)
          }
  
          if (condition2Filter && type2 === 'lessThanOrEquals') {
            colQuery.push(
              ` ${operator} ${alias}${colName} <= ?`,
            );
            params.push(condition2Filter)
          }
  
          if (condition1Filter && type1 === 'equals') {
            colQuery.push(` ${alias}${colName} = ?`);
            params.push(condition1Filter)
          }
  
          if (condition2Filter && type2 === 'equals') {
            colQuery.push(
              ` ${operator} ${alias}${colName} = ?`,
            );
            params.push(condition2Filter)
          }
  
          if (condition1Filter && type1 === 'notEquals') {
            colQuery.push(` NOT ${alias}${colName} = ?`);
            params.push(condition1Filter)
          }
  
          if (condition2Filter && type2 === 'notEquals') {
            colQuery.push(
              ` ${operator} NOT ${alias}${colName} = ?`,
            );
            params.push(condition2Filter)
          }
  
          if (condition1Filter && type1 === 'inRange') {
            const filterFrom = cols[col].condition1.filter;
            const filterTo = cols[col].condition1.filterTo;
            colQuery.push(
              ` ${alias}${colName} >= ? AND ${alias}${colName} <= ?`,
            );
            params.push(filterFrom, filterTo)
          }
  
          if (condition2Filter && type2 === 'inRange') {
            const filterFrom = cols[col].condition2.filter;
            const filterTo = cols[col].condition2.filterTo;
            colQuery.push(
              ` ${alias}${colName} >= ? AND ${alias}${colName} <= ?`,
            );
            params.push(filterFrom, filterTo)
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
              colQuery.push(`${alias}${colName} > ?`);
              params.push(date)
            }
  
            if (type === 'lessthan') {
              colQuery.push(` ${alias}${colName} < ?`);
              params.push(date)
            }
  
            if (type === 'inrange') {
              const dateFrom =
                cols[col].dateFrom && convertToISOString(cols[col].dateFrom);
              const dateTo =
                cols[col].dateTo && convertToISOString(cols[col].dateTo);
              colQuery.push(
                ` ${alias}${colName} >= ? AND ${alias}${colName} <= ?`,
              );
              params.push(dateFrom, dateTo)
            }
  
            if (type === 'equals') {
              colQuery.push(` ${alias}${colName} = ?`);
              params.push(date)           
            }
  
            if (type === 'notequal') {
              colQuery.push(` ${alias}${colName} != ?`);
              params.push(date)           
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
            colQuery.push(` ${alias}${colName} > ?`);
              params.push(date1)           
          }
  
          if (condition2DateFrom && type2 === 'greaterthan') {
            colQuery.push(` ${operator} ${alias}${colName} > ?`);
              params.push(date2)           
          }
  
          if (condition1DateFrom && type1 === 'lessthan') {
            colQuery.push(` ${alias}${colName} < ?`);
              params.push(date1)           
          }
  
          if (condition2DateFrom && type2 === 'lessthan') {
            colQuery.push(` ${operator} ${alias}${colName} < ?`);
              params.push(date2)           
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
            colQuery.push(` ${alias}${colName} = ?`);
            params.push(condition1DateFrom)
          }
  
          if (condition2DateFrom && type2 === 'equals') {
            colQuery.push(
              ` ${operator} ${alias}${colName} = ?`,
            );
            params.push(condition2DateFrom)
          }
  
          if (condition1DateFrom && type1 === 'notequal') {
            colQuery.push(` ${alias}${colName} != ?`);
            params.push(condition1DateFrom)
          }
  
          if (condition2DateFrom && type2 === 'notequal') {
            colQuery.push(
              ` ${operator} ${alias}${colName} != ?`,
            );
            params.push(condition2DateFrom)
          }
  
          if (condition1DateFrom && type1 === 'inrange') {
            const multiCol = Object.keys(cols).length > 1;
            colQuery.push(
              ` ${multiCol ? '(' : ''
              }${alias}${colName} >= ? AND ${alias}${colName} <= ?` +
              (condition2DateFrom ? ')' : ''),
            );
            params.push(condition1DateFrom, condition1DateTo)
          }
  
          if (condition2DateFrom && type2 === 'inrange') {
            const multiCol = Object.keys(cols).length > 1;
            colQuery.push(
              ` ${operator} (${alias}${colName} >= ? AND ${alias}${colName} <= ?${multiCol ? ')' : ''
              }`,
            );
            params.push(condition2DateFrom, condition2DateTo)
          }
        }
  
        const colSort = cols[col].sort;
  
        if (!!colSort) {
          colSortStr = `${alias}${colName} ${colSort}`;
        }
        const colQueryStr = colQuery.join('').trim();
  
        query.push(colQuery.length > 1 ? `(${colQueryStr})` : `${colQueryStr}`);
      }
    }
  
    const sorting = body?.sortModel?.[0]
  
    const sortingStr = sorting ? ` ORDER BY ${alias}${sorting.colId} ${sorting.sort.toUpperCase()}` : ''
  
    for (let i = 0; i < query.length; i++) {
      // Replace the first occurrence of 'WHERE' with 'AND' in each element
      if (i > 0) {
        query[i] = query[i].replace('WHERE', 'AND');
      }
    }
  
    const hasFilters = Object.keys(body?.filters || {}).length > 0;
    const fromTo =
      process.env.DB_SOURCE === DELTA_DB
        ? ` ${to ? 'LIMIT ' + (to - from) : ''} ${from ? ' OFFSET ' + (from - 1) : ''
        }`
        : `${from ? ' OFFSET ' + (from - 1) : ''} ${to ? 'LIMIT ' + (to - from) : ''
        }`;
  
    const finalQuery = (
      (hasFilters && !onlyParams ? ' WHERE ' : '') +
      query.join(' and ') +
      (colSortStr ? ` ORDER BY ${colSortStr}` : '') +
      (additionalClause
        ? ` ${hasFilters ? 'AND' : 'WHERE'} ${additionalClause}`
        : '') + sortingStr +
      fromTo
    ).trim();
  
    return {queryStr: finalQuery, params};
  };
  
  
  
  

function convertToISOString(dateString)  {
  console.log(dateString)
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
}