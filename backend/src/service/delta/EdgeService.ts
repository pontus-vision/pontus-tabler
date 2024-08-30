import {
  TableEdgeCreateReq,
  TableEdgeDeleteReq,
  TableEdgeReadReq,
  TableEdgeUpdateReq,
  TableRef,
  TableReadRes,
  TableEdgeReadRes,
  TableDataEdgeCreateReq,
  TableDataEdgeCreateRes,
  TableDataRowRef,
  TableDataEdgeReadReq,
  TableDataEdgeReadRes,
  TableDataEdgeDeleteReq,
  TableDataEdgeCreateRef,
  EdgeDirectionEnum,
  ReadPaginationFilter,
  TableEdgeCreateRes,
} from '../../typescript/api';
import { fetchContainer, filterToQuery } from '../../cosmos-utils';
import { ItemResponse, PatchOperation, ResourceResponse } from '@azure/cosmos';
import {
  BadRequestError,
  ConflictEntityError,
  NotFoundError,
} from '../../generated/api';
import { AUTH_GROUPS, convertToSqlFields, createSql } from './AuthGroupService';
import { initiateAuthGroupContainer } from './AuthGroupService';
import * as db from './../../../delta-table/node/index-jdbc';
import { filter, snakeCase } from 'lodash';
const conn: db.Connection = db.createConnection();

const TABLES = 'tables';
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
  const sql = await db.executeQuery(
    `SELECT COUNT(*) FROM ${tableNameFrom} WHERE id IN (
      ${data.tableFrom.rows.map((table) => `'${table.id}'`).join(', ')});
     `,
    conn,
  );

  if (+sql[0]['count(1)'] !== data.tableFrom.rows.length) {
    throw new NotFoundError(`A record at ${data.tableFrom} does not exist`);
  }
  const tableNameTo = snakeCase(data.tableTo.tableName);

  const sql2 = await db.executeQuery(
    `SELECT COUNT(*) FROM ${tableNameTo} WHERE id IN (${data.tableTo.rows
      .map((table) => `'${table.id}'`)
      .join(', ')});`,
    conn,
  );

  if (+sql2[0]['count(1)'] !== data.tableTo.rows.length) {
    throw new NotFoundError(`A record at ${data.tableTo} does not exist`);
  }

  const sqlFields = convertToSqlFields(
    Object.keys(data.tableFrom.rows[0]).map(
      (el) => `table_from__${snakeCase(el)}`,
    ),
  );
  const sqlFields2 = convertToSqlFields(
    Object.keys(data.tableTo.rows[0]).map((el) => `table_to__${snakeCase(el)}`),
  );

  let tableFrom = data.tableFrom.rows.map((row) =>
    prependToKeys(row, 'table_from__'),
  );
  let tableTo = data.tableTo.rows.map((row) =>
    prependToKeys(row, 'table_to__'),
  );

  const insertFields = [];

  const maxLength = Math.max(tableFrom.length, tableTo.length);
  if (data.edgeType === 'oneToOne') {
    for (let i = 0; i < maxLength; i++) {
      if (tableFrom[i] && tableTo[i]) {
        insertFields.push({ ...tableFrom[i], ...tableTo[i] });
      } else if (tableFrom[i]) {
        insertFields.push(tableFrom[i]);
      } else if (tableTo[i]) {
        insertFields.push(tableTo[i]);
      }
    }
  } else {
    for (let i = 0; i < maxLength; i++) {
      if (tableFrom[i] && tableTo[i]) {
        insertFields.push({ ...tableFrom[i], ...tableTo[i] });
      } else if (!tableFrom[i]) {
        insertFields.push({
          ...tableFrom[tableFrom.length - 1],
          ...tableTo[i],
        });
      } else if (!tableTo[i]) {
        insertFields.push({
          ...tableFrom[i],
          ...tableTo[tableFrom.length - 1],
        });
      }
    }
  }

  const res = (await createSql(
    data.jointTableName ||
      `${tableNameFrom}_${tableNameTo}`,
    sqlFields + ', ' + sqlFields2 + ', edge_label STRING',
    insertFields.map((field) => {
      if (data?.edge) {
        return { ...field, ['edge_label']: data?.edge };
      } else {
        return field;
      }
    }),
  )) as TableDataEdgeCreateRes;

  const retVal = res.map((el) => {
    const obj = {from: {}, to: {}};
    for (const prop in el) {
      if (prop.startsWith('table_from')) {
        obj['from'][prop] = el[prop];
      }
      if (prop.startsWith('table_to')) {
        obj['to'][prop] = el[prop];
      }
      // if (prop === 'id') {
      //   obj['id'] = el[prop];
      // }
    }

    return obj as TableDataEdgeCreateRef;
  });

  return retVal
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
  const container = await fetchContainer(table1.containerName);

  const path = `edges/${snakeToCamel(
    table2.tableName,
  )}/${edgeLabel}/${direction}`;
  const arrRes = [];
  if (edgeType === 'oneToOne') {
    for (const [index, value] of table1.values.entries()) {
      const table2Value = table2.rowIds.at(index);

      if (!table2Value) return;

      const partitionKey = table1?.partitionKeyProp
        ? value[table1.partitionKeyProp]
        : undefined;

      const res = await container
        .item(value.id, partitionKey || value.id)
        .read();

      const index2 = res.resource.edges[snakeToCamel(table2.tableName)][
        edgeLabel
      ][direction].findIndex((el) => el.id === table2Value.id);

      try {
        await container.item(value.id, partitionKey || value.id).patch([
          {
            op: 'set',
            path: `/${path}/${index2}`,
            value: table2Value,
          },
        ]);
        arrRes.push({ from: value, to: table2Value });
      } catch (error) {}
    }
  } else if (edgeType === 'oneToMany') {
    for (const [index, value] of table1.values.entries()) {
      for (const [index, value2] of table2.rowIds.entries()) {
        if (!value2) return;

        const partitionKey = table1?.partitionKeyProp
          ? value[table1.partitionKeyProp]
          : undefined;
        const res = await container
          .item(value.id, partitionKey || value.id)
          .read();

        if (res.statusCode === 404) {
          throw new NotFoundError(
            `id "${value2.id} not found at ${table2.tableName} at id ${value.id}"`,
          );
        }

        if (!res.resource?.edges) {
          throw new BadRequestError(
            `No edges found in record at id: "${value.id}" ${
              table1?.partitionKeyProp
                ? `and ${table1?.partitionKeyProp}: '${partitionKey}'`
                : ''
            }`,
          );
        }

        const index2 = res.resource?.edges[snakeToCamel(table2.tableName)][
          edgeLabel
        ][direction].findIndex((el) => el.id === value2.id);

        try {
          const res = await container
            .item(value.id, partitionKey || value.id)
            .patch([
              {
                op: 'set',
                path: `/${path}/${index2}`,
                value: value2,
              },
            ]);
          arrRes.push({ from: value, to: value2 });
        } catch (error) {}
      }
    }
  }

  return arrRes;
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
  const deleteConnection = async (data: TableDataEdgeDeleteReq) => {
    const container = await fetchContainer(data.tableName);

    const res = await container
      .item(data.rowId, data?.rowPartitionKey || data.rowId)
      .read();
    if (res.statusCode === 404) {
      throw new NotFoundError(
        `did not found document at id ${data.rowId} ${
          data?.rowPartitionKey
            ? `and partition key: ${data.rowPartitionKey} `
            : ''
        }`,
      );
    }

    const resource = res.resource;
    const { direction, edgeLabel, rows, tableName: edgeTableName } = data.edge;

    for (const row of rows) {
      const index = resource.edges[snakeToCamel(edgeTableName)][edgeLabel][
        direction
      ].findIndex((el) => el.id === row.id);

      if (index === -1) {
        throw new NotFoundError(`Did not find row at id: ${row.id}.`);
      }

      const resPatch = await container
        .item(data.rowId, data?.rowPartitionKey || data.rowId)
        .patch([
          {
            op: 'remove',
            path: `/edges/${snakeToCamel(
              edgeTableName,
            )}/${edgeLabel}/${direction}/${index}`,
          },
        ]);
    }
  };

  for (const row of data.edge.rows) {
    await deleteConnection({
      tableName: data.edge.tableName,
      edge: {
        direction: 'from',
        edgeLabel: data.edge.edgeLabel,
        rows: [{ id: data.rowId }],
        tableName: data.tableName,
      },
      rowId: row.id as string,
      rowPartitionKey: row[data.edge.partitionKeyProp] as string,
    });
  }

  await deleteConnection({
    tableName: data.tableName,
    edge: {
      direction: 'to',
      edgeLabel: data.edge.edgeLabel,
      rows: data.edge.rows,
      tableName: data.edge.tableName,
    },
    rowId: data.rowId,
    rowPartitionKey: data.rowPartitionKey,
  });
};

export const readEdge = async (
  data: {
    tableToName: string;
    tableFromName: string;
    direction: EdgeDirectionEnum;
    edgeTable: string;
    filters: ReadPaginationFilter;
    rowId: string;
  },
  conn: db.Connection,
) => {
  const whereClause = filterToQuery(
    {
      filters: data.filters.filters,
    },
    '',
  );
  const fromTo = ` ${
    data.filters.to ? 'LIMIT ' + (data.filters.to - data.filters.from) : ''
  } ${data.filters.from ? ' OFFSET ' + (data.filters.from - 1) : ''}`;
  const filtersOn = Object.keys(data.filters).length > 0;

  const sql = (await db.executeQuery(
    `SELECT * FROM ${data.edgeTable} ${
      filtersOn ? whereClause + ' AND ' : 'WHERE'
    } ${
      data.direction === 'from'
        ? `table_to__id = '${data.rowId}'`
        : `table_from__id = '${data.rowId}'`
    }` + fromTo,
    conn,
  )) as Record<string, any>;

  return sql;
};

export const readTableDataEdge = async (
  data: TableDataEdgeReadReq,
): Promise<TableDataEdgeReadRes> => {
  const { direction, edgeLabel, tableName: edgeTableName } = data.edge;
  const whereClause = filterToQuery({
    filters: data.filters,
  });
  const fromTo = ` ${data.to ? 'LIMIT ' + (data.to - data.from) : ''} ${
    data.from ? ' OFFSET ' + (data.from - 1) : ''
  }`;
  const filtersOn = Object.keys(data?.filters || {}).length > 0;

  const sql = (await db.executeQuery(
    `SELECT * FROM ${data?.jointTableName || edgeTableName} ${
      filtersOn ? whereClause + ' AND ' : 'WHERE'
    } ${
      direction === 'from'
        ? `table_to__id = '${data.rowId}'`
        : `table_from__id = '${data.rowId}'`
    }` + `${edgeLabel ? ` AND edge_label = '${edgeLabel}' ` : ''}` + fromTo,
    conn,
  )) as Record<string, any>;
  const sqlCount = await db.executeQuery(
    `SELECT COUNT(*) FROM ${data?.jointTableName || edgeTableName} ${
      filtersOn ? whereClause + ' AND ' : 'WHERE'
    } ${
      direction === 'from'
        ? `table_to__id = '${data.rowId}'`
        : `table_from__id = '${data.rowId}'`
    }` + `${edgeLabel ? ` AND edge_label = '${edgeLabel}' ` : ''}`,
    conn,
  );

  const edges = sql.map((edge) => {
    return {
      ['to']: {
        create: edge?.['table_to__create'] === 'true' ? true : false,
        read: edge?.['table_to__read'] === 'true' ? true : false,
        update: edge?.['table_to__update'] === 'true' ? true : false,
        delete: edge?.['table_to__delete'] === 'true' ? true : false,
        id: edge?.['table_to__id'],
        name: edge?.['table_to__name'] || edge?.['table_to__username'],
        ['tableName']: data.tableName,
      },
      ['from']: {
        create: edge?.['table_from__create'] === 'true' ? true : false,
        read: edge?.['table_from__read'] === 'true' ? true : false,
        update: edge?.['table_from__update'] === 'true' ? true : false,
        delete: edge?.['table_from__delete'] === 'true' ? true : false,
        name: edge?.['table_from__name'],
        id: edge?.['table_from__id'],
      },
    };
  });
  return {
    edges,
    count: +sqlCount[0]['count(1)'],
    rowId: sql[0]?.['table_to__id'],
    tableName: edgeTableName,
  };
};

const updateRelatedDocumentEdges = async (relatedData: TableEdgeCreateReq) => {
  const tableContainer = await fetchContainer(TABLES);
  const res = (await tableContainer
    .item(relatedData.id, relatedData.name)
    .read()) as ItemResponse<TableRef>;

  const relatedDocument = res.resource;
  if (!relatedDocument?.hasOwnProperty('edges')) {
    relatedDocument['edges'] = {};
  }

  for (const prop in relatedData.edges) {
    if (!Array.isArray(relatedDocument.edges[prop])) {
      relatedDocument.edges[prop] = [];
    }
    relatedDocument.edges[prop] = relatedDocument.edges[prop].concat(
      relatedData.edges[prop],
    );
  }

  await tableContainer
    .item(relatedData.id, relatedData.name)
    .replace(relatedDocument);
};

export const createTableEdge = async (
  data: TableEdgeCreateReq,
): Promise<TableEdgeCreateRes> => {
  const values = [];
  for (const prop in data.edges) {
    const obj = {};
    for (const edge of data.edges[prop]) {
      obj['edge_label'] = prop;

      if (edge?.from?.id && edge?.from?.tableName) {
        obj['table_from__id'] = edge?.from.id;
        obj['table_from__name'] = edge?.from.tableName;
      } else {
        obj['table_from__id'] = data.id;
        obj['table_from__name'] = data.name;
      }
      if (edge?.to?.id && edge?.to?.tableName) {
        obj['table_to__id'] = edge?.to.id;
        obj['table_to__name'] = edge?.to.tableName;
      } else {
        obj['table_to__id'] = data.id;
        obj['table_to__name'] = data.name;
      }
    }
    values.push(obj);
  }

  const sql = await createSql(
    'tables_edges',
    'table_from__name STRING, table_from__id STRING, table_to__name STRING, table_to__id STRING, edge_label STRING',
    values,
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
  const querySpec = {
    query: 'select c.edges, c.id, c.name from c where c.id=@tableId',
    parameters: [
      {
        name: '@tableId',
        value: data.tableId,
      },
    ],
  };

  const tableContainer = await fetchContainer(TABLES);

  const { resources } = await tableContainer.items.query(querySpec).fetchAll();
  const resource = resources[0];

  if (resources.length === 1) {
    return resource;
  } else if (resources.length === 0) {
    throw new NotFoundError(`No table found at id: ${data.tableId}`);
  }
};

const deleteRelatedDocumentEdges = async (relatedData: TableEdgeDeleteReq) => {
  const tableContainer = await fetchContainer(TABLES);

  const res = (await tableContainer
    .item(relatedData.id, relatedData.tableName)
    .read()) as ItemResponse<TableRef>;

  const resource = res.resource;

  const patchArr: PatchOperation[] = [];

  for (const prop in relatedData.edges) {
    const edgeArr = resource?.edges[prop];
    const edgeInputArr = relatedData.edges[prop];
    for (const [index, el] of edgeArr?.entries()) {
      if (
        edgeInputArr.some(
          (edge) =>
            el?.from?.id === edge?.from?.id &&
            el?.to?.id === edge?.to?.id &&
            el?.from?.tableName === edge?.from?.tableName &&
            el?.to?.tableName === edge?.to?.tableName,
        )
      ) {
        const patchOp: PatchOperation = {
          op: 'remove',
          path: `/edges/${prop}/${index}`,
          value: el,
        };
        patchArr.push(patchOp);
      }
    }
  }

  const res2 = await tableContainer
    .item(relatedData.id, relatedData.tableName)
    .patch(patchArr);

  for (const prop in relatedData?.edges) {
    if (res2.resource.edges[prop].length === 0) {
      const res = await tableContainer
        .item(relatedData.id, relatedData.tableName)
        .patch([{ op: 'remove', path: `/edges/${prop}` }]);
    }
  }
};

export const deleteTableEdge = async (data: TableEdgeDeleteReq) => {
  const tableContainer = await fetchContainer(TABLES);

  const res = (await tableContainer
    .item(data.id, data.tableName)
    .read()) as ItemResponse<TableRef>;

  const resource = res.resource;

  const patchArr: PatchOperation[] = [];

  const message = [];

  for (const prop in data?.edges) {
    const edgeArr = resource?.edges[prop];
    const edgeInputArr = data?.edges[prop];
    for (const [index, el] of edgeArr?.entries()) {
      if (
        edgeInputArr.some(
          (edge) =>
            el?.from?.id === edge?.from?.id &&
            el?.to?.id === edge?.to?.id &&
            el?.from?.tableName === edge?.from?.tableName &&
            el?.to?.tableName === edge?.to?.tableName,
        )
      ) {
        const patchOp: PatchOperation = {
          op: 'remove',
          path: `/edges/${prop}/${index}`,
          value: el,
        };
        patchArr.push(patchOp);
      }
    }
  }

  const res2 = await tableContainer
    .item(data.id, data.tableName)
    .patch(patchArr);

  for (const prop in data?.edges) {
    if (res2.resource.edges[prop].length === 0) {
      const res = await tableContainer
        .item(data.id, data.tableName)
        .patch([{ op: 'remove', path: `/edges/${prop}` }]);
    }
  }

  const updateRelatedDocumentsPromises = [];
  for (const prop in data?.edges) {
    data?.edges[prop].forEach((edge) => {
      if (edge.from) {
        updateRelatedDocumentsPromises.push(
          deleteRelatedDocumentEdges({
            id: edge.from.id,
            tableName: edge.from.tableName,
            edges: {
              [prop]: [{ to: { id: data.id, tableName: data.tableName } }],
            },
          }),
        );
      } else if (edge.to) {
        updateRelatedDocumentsPromises.push(
          deleteRelatedDocumentEdges({
            id: edge.to.id,
            tableName: edge.to.tableName,
            edges: {
              [prop]: [{ from: { id: data.id, tableName: data.tableName } }],
            },
          }),
        );
      }
    });
  }

  await Promise.all(updateRelatedDocumentsPromises);

  return `Table edges (from:${data.edges['']}) deleted!`;
};
