import {
  TableEdgeCreateReq,
  TableEdgeDeleteReq,
  TableEdgeReadReq,
  TableEdgeReadRes,
  TableDataEdgeCreateReq,
  TableDataEdgeCreateRes,
  TableDataEdgeReadReq,
  TableDataEdgeReadRes,
  TableDataEdgeDeleteReq,
  TableDataEdgeCreateRef,
  EdgeDirectionEnum,
  ReadPaginationFilter,
  TableEdgeCreateRes,
  Edge,
} from '../../typescript/api';
import { convertToSqlFields, createSql, runQuery } from '../../db-utils';
import { filterToQuery } from '../../utils';
import {
  ConflictEntityError,
  NotFoundError,
} from '../../generated/api/resources';
import { snakeCase } from 'lodash';

const ensureNestedPathExists = (obj, path) => {
  const parts = path.split('/');
  let current = obj;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (i === parts.length - 1) {
      if (!Array.isArray(current[part])) {
        current[part] = [];
      }
    } else {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
  }

  return current;
};
const snakeToCamel = (snake: string): string => {
  return snake.replace(/(_\w)/g, (match) => match[1].toUpperCase());
};
function prependToKeys(obj, prefix) {
  const newObject = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObject[prefix + key] = obj[key];
    }
  }

  return newObject;
}
interface DeltaTableDataEdgeCreateReq extends TableDataEdgeCreateReq {
  edgeLabel?: string;
}

export const createTableDataEdge = async (
  data: TableDataEdgeCreateReq,
): Promise<TableDataEdgeCreateRes> => {
  const tableNameFrom = snakeCase(data.tableFrom.tableName);
  const fromIds = data.tableFrom.rows.map((row) => row.id);
  const fromPlaceholders = fromIds.map(() => '?').join(', ');

  // Check existence of from IDs
  const sql = await runQuery(
    `SELECT COUNT(*) FROM ${tableNameFrom} WHERE id IN (${fromPlaceholders});`,
    fromIds,
  );

  if (+sql[0]['count(1)'] !== fromIds.length) {
    throw new NotFoundError(`One or more records in table ${data.tableFrom.tableName} do not exist`);
  }

  const tableNameTo = snakeCase(data.tableTo.tableName);
  const toIds = data.tableTo.rows.map((row) => row.id);
  const toPlaceholders = toIds.map(() => '?').join(', ');

  // Check existence of to IDs
  const sql2 = await runQuery(
    `SELECT COUNT(*) FROM ${tableNameTo} WHERE id IN (${toPlaceholders});`,
    toIds,
  );

  if (+sql2[0]['count(1)'] !== toIds.length) {
    throw new NotFoundError(`One or more records in table ${data.tableTo.tableName} do not exist`);
  }

  // Prepare SQL field strings
  const sqlFields = convertToSqlFields(
    Object.keys(data.tableFrom.rows[0]).map((el) => `table_from__${snakeCase(el)}`),
  );
  const sqlFields2 = convertToSqlFields(
    Object.keys(data.tableTo.rows[0]).map((el) => `table_to__${snakeCase(el)}`),
  );

  const tableFrom = data.tableFrom.rows.map((row) =>
    prependToKeys(row, 'table_from__'),
  );
  const tableTo = data.tableTo.rows.map((row) =>
    prependToKeys(row, 'table_to__'),
  );

  // Pair up insert fields based on edge type
  const insertFields: Record<string, any>[] = [];
  const maxLength = Math.max(tableFrom.length, tableTo.length);

  if (data.edgeType === 'oneToOne') {
    for (let i = 0; i < maxLength; i++) {
      insertFields.push({ ...tableFrom[i], ...tableTo[i] });
    }
  } else {
    for (let i = 0; i < maxLength; i++) {
      const from = tableFrom[i] ?? tableFrom[tableFrom.length - 1];
      const to = tableTo[i] ?? tableTo[tableTo.length - 1];
      insertFields.push({ ...from, ...to });
    }
  }

  const rowsToInsert = insertFields.map((field) => ({
    ...field,
    edge_label: data.edge || null,
  }));

  const jointTableName =
    snakeCase(data.jointTableName) ||
    snakeCase(data.edge) ||
    `${tableNameFrom}_${tableNameTo}`;

  const res = (await createSql(
    jointTableName,
    `${sqlFields}, ${sqlFields2}, edge_label STRING`,
    rowsToInsert,
  )) as TableDataEdgeCreateRes;

  const retVal = res.map((el) => {
    const obj: TableDataEdgeCreateRef = { from: {}, to: {} };
    for (const prop in el) {
      if (prop.startsWith('table_from')) {
        obj.from[prop] = el[prop];
      }
      if (prop.startsWith('table_to')) {
        obj.to[prop] = el[prop];
      }
    }
    return obj;
  });

  return retVal;
};


export const createConnection = (
  table1: {
    partitionKeyProp?: string;
    values: Record<string, any>[];
    containerName: string;
  },
  table2: { rowIds: Record<string, any>[]; tableName: string },
  edgeType: 'oneToOne' | 'oneToMany',
): Record<string, any>[] => {
  const arrRes = [];
  if (edgeType === 'oneToOne') {
    for (const [index, row] of table1.values.entries()) {
      const row2 = table2.rowIds.at(index);

      arrRes.push({
        from_id: row.id,
        from_table_name: table1.containerName,
        to_table_name: table2.tableName,
        to_id: row2.id,
      });
    }
  } else if (edgeType === 'oneToMany') {
    for (const [index, row] of table1.values.entries()) {
      for (const [index, row2] of table2.rowIds.entries()) {
        if (!row2) return;

        arrRes.push({
          from_id: row.id,
          from_table_name: table1.containerName,
          to_table_name: table2.tableName,
          to_id: row2.id,
        });
      }
    }
  }

  return arrRes;
};
export const updateTableDataEdge = async (
  data: TableDataEdgeCreateReq,
): Promise<TableDataEdgeCreateRes> => {
  const path = `edges/${snakeToCamel(data.tableTo.tableName)}/${data.edge}/`;
  const path2 = `edges/${snakeToCamel(data.tableFrom.tableName)}/${data.edge}/`;

  const res1 = await updateConnection(
    {
      containerName: data.tableFrom.tableName,
      values: data.tableFrom.rows.map((row) => {
        return { id: row.id as string, ...row };
      }),
      partitionKeyProp: data.tableFrom.partitionKeyProp,
    },
    {
      tableName: data.tableTo.tableName,
      rowIds: data.tableTo.rows,
    },
    data.edge,
    'to',
    'oneToMany',
  );
  const res2 = await updateConnection(
    {
      containerName: data.tableTo.tableName,
      values: data.tableTo.rows.map((row) => {
        return { id: row.id as string, ...row };
      }),
      partitionKeyProp: data.tableTo.partitionKeyProp,
    },
    { tableName: data.tableFrom.tableName, rowIds: data.tableFrom.rows },
    data.edge,
    'from',
    'oneToMany',
  );

  return res1;
};
export const updateConnection = async (
  table1: {
    partitionKeyProp?: string;
    values: { [key: string]: any; id: string }[];
    containerName: string;
  },
  table2: { rowIds: Record<string, any>[]; tableName: string },
  edgeLabel: string,
  direction: EdgeDirectionEnum,
  edgeType: 'oneToOne' | 'oneToMany',
): Promise<TableDataEdgeCreateRef[]> => {
  return
  // const container = await fetchContainer(table1.containerName);

  // const path = `edges/${snakeToCamel(
  //   table2.tableName,
  // )}/${edgeLabel}/${direction}`;
  // const arrRes = [];
  // if (edgeType === 'oneToOne') {
  //   for (const [index, value] of table1.values.entries()) {
  //     const table2Value = table2.rowIds.at(index);

  //     if (!table2Value) return;

  //     const partitionKey = table1?.partitionKeyProp
  //       ? value[table1.partitionKeyProp]
  //       : undefined;

  //     const res = await container
  //       .item(value.id, partitionKey || value.id)
  //       .read();

  //     const index2 = res.resource.edges[snakeToCamel(table2.tableName)][
  //       edgeLabel
  //     ][direction].findIndex((el) => el.id === table2Value.id);

  //     try {
  //       await container.item(value.id, partitionKey || value.id).patch([
  //         {
  //           op: 'set',
  //           path: `/${path}/${index2}`,
  //           value: table2Value,
  //         },
  //       ]);
  //       arrRes.push({ from: value, to: table2Value });
  //     } catch (error) {}
  //   }
  // } else if (edgeType === 'oneToMany') {
  //   for (const [index, value] of table1.values.entries()) {
  //     for (const [index, value2] of table2.rowIds.entries()) {
  //       if (!value2) return;

  //       const partitionKey = table1?.partitionKeyProp
  //         ? value[table1.partitionKeyProp]
  //         : undefined;
  //       const res = await container
  //         .item(value.id, partitionKey || value.id)
  //         .read();

  //       if (res.statusCode === 404) {
  //         throw new NotFoundError(
  //           `id "${value2.id} not found at ${table2.tableName} at id ${value.id}"`,
  //         );
  //       }

  //       if (!res.resource?.edges) {
  //         throw new BadRequestError(
  //           `No edges found in record at id: "${value.id}" ${
  //             table1?.partitionKeyProp
  //               ? `and ${table1?.partitionKeyProp}: '${partitionKey}'`
  //               : ''
  //           }`,
  //         );
  //       }

  //       const index2 = res.resource?.edges[snakeToCamel(table2.tableName)][
  //         edgeLabel
  //       ][direction].findIndex((el) => el.id === value2.id);

  //       try {
  //         const res = await container
  //           .item(value.id, partitionKey || value.id)
  //           .patch([
  //             {
  //               op: 'set',
  //               path: `/${path}/${index2}`,
  //               value: value2,
  //             },
  //           ]);
  //         arrRes.push({ from: value, to: value2 });
  //       } catch (error) {}
  //     }
  //   }
  // }

  // return arrRes;
};
function createOrUpdateNestedObjectWithArray(
  obj: Record<string, any>,
  path: string,
  item: any,
): Record<string, any> {
  const parts = path.split('/');
  let current = obj;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (i === parts.length - 1) {
      if (!Array.isArray(current[part])) {
        current[part] = [];
      }
      current[part].push(item); // Push the item onto the array
    } else {
      if (!current[part]) {
        current[part] = {}; // Create an empty object if it doesn't exist
      }
      current = current[part]; // Move to the next nested level
    }
  }

  return obj;
}
export const deleteTableDataEdge = async (data: TableDataEdgeDeleteReq) => {
  // const deleteConnection = async (data: TableDataEdgeDeleteReq) => {
  //   const container = await fetchContainer(data.tableName);

  //   const res = await container
  //     .item(data.rowId, data?.rowPartitionKey || data.rowId)
  //     .read();
  //   if (res.statusCode === 404) {
  //     throw new NotFoundError(
  //       `did not found document at id ${data.rowId} ${
  //         data?.rowPartitionKey
  //           ? `and partition key: ${data.rowPartitionKey} `
  //           : ''
  //       }`,
  //     );
  //   }

  //   const resource = res.resource;
  //   const { direction, edgeLabel, rows, tableName: edgeTableName } = data.edge;

  //   for (const row of rows) {
  //     const index = resource.edges[snakeToCamel(edgeTableName)][edgeLabel][
  //       direction
  //     ].findIndex((el) => el.id === row.id);

  //     if (index === -1) {
  //       throw new NotFoundError(`Did not find row at id: ${row.id}.`);
  //     }

  //     const resPatch = await container
  //       .item(data.rowId, data?.rowPartitionKey || data.rowId)
  //       .patch([
  //         {
  //           op: 'remove',
  //           path: `/edges/${snakeToCamel(
  //             edgeTableName,
  //           )}/${edgeLabel}/${direction}/${index}`,
  //         },
  //       ]);
  //   }
  // };

  // for (const row of data.edge.rows) {
  //   await deleteConnection({
  //     tableName: data.edge.tableName,
  //     edge: {
  //       direction: 'from',
  //       edgeLabel: data.edge.edgeLabel,
  //       rows: [{ id: data.rowId }],
  //       tableName: data.tableName,
  //     },
  //     rowId: row.id as string,
  //     rowPartitionKey: row[data.edge.partitionKeyProp] as string,
  //   });
  // }

  // await deleteConnection({
  //   tableName: data.tableName,
  //   edge: {
  //     direction: 'to',
  //     edgeLabel: data.edge.edgeLabel,
  //     rows: data.edge.rows,
  //     tableName: data.edge.tableName,
  //   },
  //   rowId: data.rowId,
  //   rowPartitionKey: data.rowPartitionKey,
  // });
};

export const readEdge = async (data: {
  tableToName: string;
  tableFromName: string;
  direction: EdgeDirectionEnum;
  edgeTable: string;
  filters: ReadPaginationFilter;
  rowId: string;
}) => {
  const { queryStr: whereClause, params: filterParams } = filterToQuery(
    { filters: data.filters.filters },
    '',
  );

  const conditions: string[] = [];

  if (whereClause) {
    conditions.push(whereClause);
  }

  const directionCondition =
    data.direction === 'from' ? 'table_to__id = ?' : 'table_from__id = ?';
  conditions.push(directionCondition);

  const fullWhereClause = `${whereClause ? '' : 'WHERE '}${conditions.join(' AND ')}`;

  const paginationClause: string[] = [];
  const values: (string | number)[] = [...filterParams, data.rowId];

  if (data.filters.to != null && data.filters.from != null) {
    paginationClause.push('LIMIT ?');
    paginationClause.push('OFFSET ?');
    values.push(data.filters.to - data.filters.from);
    values.push(data.filters.from - 1);
  }

  const queryStr = `
    SELECT * FROM ${data.edgeTable}
    ${fullWhereClause}
    ${paginationClause.join(' ')}
  `.trim();

  return await runQuery(queryStr, values);
};



export const readTableDataEdge = async (
  data: TableDataEdgeReadReq,
): Promise<TableDataEdgeReadRes> => {
  const { direction, edgeLabel, tableName: edgeTableName } = data.edge;
  const table = data.jointTableName || edgeTableName;

  const filters = data.filters || {};
  const { queryStr: filterClause, params: filterParams } = filterToQuery(
    { filters },
    '',
  );

  const conditions: string[] = [];
  const params: (string | number)[] = [...filterParams];

  if (filterClause) {
    conditions.push(filterClause);
  }

  const directionCondition =
    direction === 'to' ? 'table_from__id = ?' : 'table_to__id = ?';
  conditions.push(directionCondition);
  params.push(data.rowId);

  if (edgeLabel) {
    conditions.push('edge_label = ?');
    params.push(edgeLabel);
  }

  const whereClause = conditions.length > 0 ? `${filterClause ? '' : 'WHERE '}${conditions.join(' AND ')}` : '';

  const limitOffsetClause: string[] = [];
  if (data.to != null && data.from != null) {
    limitOffsetClause.push('LIMIT ?');
    limitOffsetClause.push('OFFSET ?');
    params.push(data.to - data.from);
    params.push(data.from - 1);
  }

  const queryStr = `
    SELECT * FROM ${table}
    ${whereClause}
    ${limitOffsetClause.join(' ')}
  `.trim();

  const rows = await runQuery(queryStr, params);

  const countQuery = `
    SELECT COUNT(*) FROM ${table}
    ${whereClause}
  `.trim();
  const countParams = params.slice(0, filterParams.length + 1 + (edgeLabel ? 1 : 0));

  const countRows = await runQuery(countQuery, countParams);

  const edges = rows.map((edge) => ({
    to: {
      create: edge?.['table_to__create'] === 'true',
      read: edge?.['table_to__read'] === 'true',
      update: edge?.['table_to__update'] === 'true',
      delete: edge?.['table_to__delete'] === 'true',
      id: edge?.['table_to__id'],
      name: edge?.['table_to__name'] || edge?.['table_to__username'],
      tableName: data.tableName,
    },
    from: {
      create: edge?.['table_from__create'] === 'true',
      read: edge?.['table_from__read'] === 'true',
      update: edge?.['table_from__update'] === 'true',
      delete: edge?.['table_from__delete'] === 'true',
      name: edge?.['table_from__name'],
      id: edge?.['table_from__id'],
    }
  }));

  return {
    edges,
    count: +countRows[0]['count(1)'],
    rowId: rows[0]?.['table_to__id'],
    tableName: edgeTableName,
  };
};



const updateRelatedDocumentEdges = async (relatedData: TableEdgeCreateReq) => {
  // const tableContainer = await fetchContainer(TABLES);
  // const res = (await tableContainer
  //   .item(relatedData.id, relatedData.name)
  //   .read()) as ItemResponse<TableRef>;

  // const relatedDocument = res.resource;
  // if (!relatedDocument?.hasOwnProperty('edges')) {
  //   relatedDocument['edges'] = {};
  // }

  // for (const prop in relatedData.edges) {
  //   if (!Array.isArray(relatedDocument.edges[prop])) {
  //     relatedDocument.edges[prop] = [];
  //   }
  //   relatedDocument.edges[prop] = relatedDocument.edges[prop].concat(
  //     relatedData.edges[prop],
  //   );
  // }

  // await tableContainer
  //   .item(relatedData.id, relatedData.name)
  //   .replace(relatedDocument);
};

export const createTableEdge = async (
  data: TableEdgeCreateReq,
): Promise<TableEdgeCreateRes> => {
  const values: Record<string, any>[] = [];

  for (const prop in data.edges) {
    const edges = data.edges[prop];

    const fromEdges = edges.filter(edge => edge?.from?.id);
    const toEdges = edges.filter(edge => edge?.to?.id);

    const conditions: string[] = [];
    const params: any[] = [];

    fromEdges.forEach(edge => {
      conditions.push(`table_from__id = ?`);
      params.push(edge.from.id);
    });

    toEdges.forEach(edge => {
      conditions.push(`table_to__id = ?`);
      params.push(edge.to.id);
    });

    const edgesStr = conditions.length > 0 ? conditions.join(' OR ') : '';
    const query = `SELECT * FROM tables_edges ${edgesStr ? `WHERE ${edgesStr}` : ''}`;

    try {
      const existingEdges = await runQuery(query, params);

      const duplicates = edges.filter(edge =>
        existingEdges.some(existing => {
          if (edge?.from) {
            return (
              existing['table_from__id'] === edge.from.id &&
              existing['table_from__name'] === edge.from.tableName
            );
          } else if (edge?.to) {
            return (
              existing['table_to__id'] === edge.to.id &&
              existing['table_to__name'] === edge.to.tableName
            );
          }
          return false;
        })
      );

      if (duplicates.length > 0) {
        throw {
          code: 409,
          message: `Duplicate edge(s) detected for property '${prop}': ${JSON.stringify(duplicates)}`,
        };
      }
    } catch (error) {
      if (error?.code === 409) throw new ConflictEntityError(error.message);
      console.error({ error });
    }

    for (const edge of edges) {
      const obj: Record<string, any> = { edge_label: prop };

      const fromId = edge?.from?.id ?? data.id;
      const fromName = edge?.from?.tableName ?? data.name;
      const toId = edge?.to?.id ?? data.id;
      const toName = edge?.to?.tableName ?? data.name;

      // Validate existence of table_from__id
      const checkFrom = await runQuery(`SELECT 1 FROM tables WHERE id = ? LIMIT 1`, [fromId]);
      if (checkFrom.length === 0) {
        throw new NotFoundError(`No table found at id: ${fromId}`);
      }

      // Validate existence of table_to__id
      const checkTo = await runQuery(`SELECT 1 FROM tables WHERE id = ? LIMIT 1`, [toId]);
      if (checkTo.length === 0) {
        throw new NotFoundError(`No table found at id: ${toId}`);
      }

      obj['table_from__id'] = fromId;
      obj['table_from__name'] = fromName;
      obj['table_to__id'] = toId;
      obj['table_to__name'] = toName;

      values.push(obj);
    }
  }


  const sql = await createSql(
    'tables_edges',
    'table_from__name STRING, table_from__id STRING, table_to__name STRING, table_to__id STRING, edge_label STRING',
    values
  );

  return data;
};

//export const updateTableEdge = async (data: TableEdgeUpdateReq) => {
//  try {
//    const tableContainer = await fetchContainer(TABLES);
//    const res = (await tableContainer
//      .item(data.id, data.id)
//      .read()) as ItemResponse<TableRef>;
//
//    const resource = res.resource;
//
//    const patchArr: PatchOperation[] = [];
//
//    for (const prop in data.edges) {
//      const edgeArr = data.edges[prop];
//      const indexUpdate = edgeArr.map((edgeInput) =>
//        resource.edges[prop].findIndex((el) => edgeInput === el),
//      );
//      for (const [index, el] of edgeArr.entries()) {
//        const patchOp: PatchOperation = {
//          op: 'set',
//          path: `/edges/${prop}/${index}`,
//          value: el,
//        };
//        patchArr.push(patchOp);
//      }
//    }
//
//    const res2 = await tableContainer.item(data.id, data.id).patch(patchArr);
//    const { _rid, _self, _etag, _attachments, _ts, ...rest } =
//      res.resource as any;
//
//    return rest;
//  } catch (error) {
//    throw error;
//  }
//};

export const readTableEdgesByTableId = async (
  data: TableEdgeReadReq,
): Promise<TableEdgeReadRes> => {
  const sql = await runQuery(
    `
      SELECT te.*, t.name 
      FROM tables_edges te 
      INNER JOIN tables t ON t.id = ?
      WHERE te.table_from__id = ?
    `,
    [data.tableId, data.tableId]
  );

  if (sql.length === 0) {
    throw new NotFoundError(`Could not find any Edge attached to table at id ${data.tableId}`);
  }

  const results:Record<string, Edge[]> = sql.reduce((acc:any, cur)=> {
    if(acc?.[cur['edge_label']]) {
      acc[cur['edge_label']] = [...acc[cur['edge_label']], {to: {id: cur['table_to__id'], tableName: cur['table_to__name']}}]
    } else {
      acc[cur['edge_label']] = [ {to: {id: cur['table_to__id'], tableName: cur['table_to__name']}}]
    }
    return acc;
  }, {});

  return { edges: results, id: data.tableId, name: sql[0]['name'] };
};


const deleteRelatedDocumentEdges = async (relatedData: TableEdgeDeleteReq) => {
  return
  // const tableContainer = await fetchContainer(TABLES);

  // const res = (await tableContainer
  //   .item(relatedData.id, relatedData.tableName)
  //   .read()) as ItemResponse<TableRef>;

  // const resource = res.resource;

  // const patchArr: PatchOperation[] = [];

  // for (const prop in relatedData.edges) {
  //   const edgeArr = resource?.edges[prop];
  //   const edgeInputArr = relatedData.edges[prop];
  //   for (const [index, el] of edgeArr?.entries()) {
  //     if (
  //       edgeInputArr.some(
  //         (edge) =>
  //           el?.from?.id === edge?.from?.id &&
  //           el?.to?.id === edge?.to?.id &&
  //           el?.from?.tableName === edge?.from?.tableName &&
  //           el?.to?.tableName === edge?.to?.tableName,
  //       )
  //     ) {
  //       const patchOp: PatchOperation = {
  //         op: 'remove',
  //         path: `/edges/${prop}/${index}`,
  //         value: el,
  //       };
  //       patchArr.push(patchOp);
  //     }
  //   }
  // }

  // const res2 = await tableContainer
  //   .item(relatedData.id, relatedData.tableName)
  //   .patch(patchArr);

  // for (const prop in relatedData?.edges) {
  //   if (res2.resource.edges[prop].length === 0) {
  //     const res = await tableContainer
  //       .item(relatedData.id, relatedData.tableName)
  //       .patch([{ op: 'remove', path: `/edges/${prop}` }]);
  //   }
  // }
};

export const deleteTableEdge = async (data: TableEdgeDeleteReq) => {
  return
  // const tableContainer = await fetchContainer(TABLES);

  // const res = (await tableContainer
  //   .item(data.id, data.tableName)
  //   .read()) as ItemResponse<TableRef>;

  // const resource = res.resource;

  // const patchArr: PatchOperation[] = [];

  // const message = [];

  // for (const prop in data?.edges) {
  //   const edgeArr = resource?.edges[prop];
  //   const edgeInputArr = data?.edges[prop];
  //   for (const [index, el] of edgeArr?.entries()) {
  //     if (
  //       edgeInputArr.some(
  //         (edge) =>
  //           el?.from?.id === edge?.from?.id &&
  //           el?.to?.id === edge?.to?.id &&
  //           el?.from?.tableName === edge?.from?.tableName &&
  //           el?.to?.tableName === edge?.to?.tableName,
  //       )
  //     ) {
  //       const patchOp: PatchOperation = {
  //         op: 'remove',
  //         path: `/edges/${prop}/${index}`,
  //         value: el,
  //       };
  //       patchArr.push(patchOp);
  //     }
  //   }
  // }

  // const res2 = await tableContainer
  //   .item(data.id, data.tableName)
  //   .patch(patchArr);

  // for (const prop in data?.edges) {
  //   if (res2.resource.edges[prop].length === 0) {
  //     const res = await tableContainer
  //       .item(data.id, data.tableName)
  //       .patch([{ op: 'remove', path: `/edges/${prop}` }]);
  //   }
  // }

  // const updateRelatedDocumentsPromises = [];
  // for (const prop in data?.edges) {
  //   data?.edges[prop].forEach((edge) => {
  //     if (edge.from) {
  //       updateRelatedDocumentsPromises.push(
  //         deleteRelatedDocumentEdges({
  //           id: edge.from.id,
  //           tableName: edge.from.tableName,
  //           edges: {
  //             [prop]: [{ to: { id: data.id, tableName: data.tableName } }],
  //           },
  //         }),
  //       );
  //     } else if (edge.to) {
  //       updateRelatedDocumentsPromises.push(
  //         deleteRelatedDocumentEdges({
  //           id: edge.to.id,
  //           tableName: edge.to.tableName,
  //           edges: {
  //             [prop]: [{ from: { id: data.id, tableName: data.tableName } }],
  //           },
  //         }),
  //       );
  //     }
  //   });
  // }

  // await Promise.all(updateRelatedDocumentsPromises);

  // return `Table edges (from:${data.edges['']}) deleted!`;
};
