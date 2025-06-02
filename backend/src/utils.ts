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
  ): { queryStr: string; params: any[] } => {
    const query: string[] = [];
    const params: any[] = [];
  
    const { filters = {}, from, to } = body;
  
    if (process.env.DB_SOURCE && alias) {
      alias = `${alias}.`;
    }
  
    const addCondition = (sqlFragment: string, value: any) => {
      query.push(sqlFragment);
      params.push(value);
    };
  
    for (const col in filters) {
      if (!filters.hasOwnProperty(col)) continue;
  
      const {
        condition1,
        condition2,
        filter,
        filterTo,
        filterType,
        type,
        operator = 'AND',
        conditions = [],
      } = filters[col];
  
      const type1 = condition1?.type?.toLowerCase?.();
      const type2 = condition2?.type?.toLowerCase?.();
  
      const condition1Filter = condition1?.filter;
      const condition2Filter = condition2?.filter;
  
      const colName =
        process.env.DB_SOURCE === DELTA_DB
          ? col.includes('-') ? `\`${col}\`` : col
          : `["${col}"]`;
  
      const fullCol = `${alias}${colName}`;
      const colQuery: string[] = [];
  
      const addTextCondition = (type: string, value: any, opPrefix = '') => {
        switch (type) {
          case 'contains':
            addCondition(`${opPrefix}${fullCol} LIKE ?`, `%${value}%`);
            break;
          case 'not contains':
            addCondition(`${opPrefix}${fullCol} NOT LIKE ?`, `%${value}%`);
            break;
          case 'startswith':
          case 'starts with':
            addCondition(`${opPrefix}${fullCol} LIKE ?`, `${value}%`);
            break;
          case 'endswith':
          case 'ends with':
            addCondition(`${opPrefix}${fullCol} LIKE ?`, `%${value}`);
            break;
          case 'equals':
            addCondition(`${opPrefix}${fullCol} = ?`, value);
            break;
          case 'not equals':
            addCondition(`${opPrefix}NOT ${fullCol} = ?`, value);
            break;
        }
      };
  
      const addNumberCondition = (type: string, val1?: any, val2?: any) => {
        switch (type) {
          case 'greaterthan':
            addCondition(`${fullCol} > ?`, val1);
            break;
          case 'greaterthanorequals':
            addCondition(`${fullCol} >= ?`, val1);
            break;
          case 'lessthan':
            addCondition(`${fullCol} < ?`, val1);
            break;
          case 'lessthanorequals':
            addCondition(`${fullCol} <= ?`, val1);
            break;
          case 'equals':
            addCondition(`${fullCol} = ?`, val1);
            break;
          case 'notequal':
            addCondition(`NOT ${fullCol} = ?`, val1);
            break;
          case 'inrange':
            addCondition(`${fullCol} >= ?`, val1);
            addCondition(`AND ${fullCol} <= ?`, val2);
            break;
          case 'blank':
          case 'notblank':
            colQuery.push(`${type === 'blank' ? '' : 'NOT '}${fullCol} IS NULL`);
            break;
        }
      };
  
      if (filterType === 'text') {
        if (conditions.length > 0) {
          for (const cond of conditions) {
            addTextCondition(type, filter);
          }
        } else {
          addTextCondition(type?.toLowerCase?.(), filter);
          if (condition1Filter) addTextCondition(type1, condition1Filter);
          if (condition2Filter) addTextCondition(type2, condition2Filter, ` ${operator} `);
        }
      }
  
      if (filterType === 'number') {
        if (type === 'inRange') {
          addNumberCondition('inrange', filter, filterTo);
        } else {
          addNumberCondition(type?.toLowerCase?.(), filter);
          if (condition1Filter) addNumberCondition(type1, condition1Filter);
          if (condition2Filter) addNumberCondition(type2, condition2Filter);
        }
      }
  
      if (colQuery.length > 0) {
        query.push(`(${colQuery.join(` ${operator} `)})`);
      }
    }
  
    if (from && to) {
      addCondition(`${alias}created_at >= ?`, from);
      addCondition(`AND ${alias}created_at <= ?`, to);
    }
  
    if (additionalClause) {
      query.push(additionalClause);
    }
  
    const queryStr = query.join(' AND ');
  
    return onlyParams ? { queryStr: '', params } : { queryStr, params };
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