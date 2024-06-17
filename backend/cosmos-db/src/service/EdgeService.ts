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
} from '../typescript/api';
import { fetchContainer, filterToQuery } from '../cosmos-utils';
import { ItemResponse, PatchOperation, ResourceResponse } from '@azure/cosmos';
import {
  BadRequestError,
  ConflictEntityError,
  NotFoundError,
} from '../generated/api';
import { AUTH_GROUPS } from './AuthUserService';
import { initiateAuthGroupContainer } from './AuthGroupService';

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
export const createTableDataEdge = async (
  data: TableDataEdgeCreateReq,
): Promise<TableDataEdgeCreateRes> => {
  const path = `edges/${snakeToCamel(data.tableTo.tableName)}/${data.edge}/`;
  const path2 = `edges/${snakeToCamel(data.tableFrom.tableName)}/${data.edge}/`;
  const res1 = await createConnection(
    {
      containerName: data.tableFrom.tableName,
      values: data.tableFrom.rows,
      partitionKeyProp: data.tableFrom.partitionKeyProp,
    },
    {
      tableName: data.tableTo.tableName,
      rowIds: data.tableTo.rows,
    },
    path + 'to',
    data.edgeType,
  );
  const res2 = await createConnection(
    {
      containerName: data.tableTo.tableName,
      values: data.tableTo.rows,
      partitionKeyProp: data.tableTo.partitionKeyProp,
    },
    { tableName: data.tableFrom.tableName, rowIds: data.tableFrom.rows },
    path2 + 'from',
    data.edgeType,
  );

  return res1;
};

export const createConnection = async (
  table1: {
    partitionKeyProp?: string;
    values: Record<string, any>[];
    containerName: string;
  },
  table2: { rowIds: Record<string, any>[] | string[]; tableName: string },
  path: string,
  edgeType: 'oneToOne' | 'oneToMany',
): Promise<TableDataEdgeCreateRef[]> => {
  const container = await fetchContainer(table1.containerName);

  const arrRes = [];
  if (edgeType === 'oneToOne') {
    for (const [index, rowId] of table1.values.entries()) {
      const table2Row = table2.rowIds.at(index);

      if (!table2Row) return;

      const partitionKey = table1?.partitionKeyProp
        ? rowId[table1.partitionKeyProp]
        : undefined;

      try {
        await container.item(rowId.id, partitionKey || rowId.id).patch([
          {
            op: 'add',
            path: `/${path}/-`,
            value: table2Row,
          },
        ]);
        arrRes.push({ from: rowId, to: table2Row });
      } catch (error) {
        const { resource: existingDocument } = await container
          .item(rowId.id, partitionKey || rowId.id)
          .read();

        ensureNestedPathExists(existingDocument, path);

        const nested = createOrUpdateNestedObjectWithArray(
          existingDocument,
          path,
          [table2Row],
        );
        const obj = { ...existingDocument, ...nested };
        const res = await container
          .item(rowId.id, partitionKey || rowId.id)
          .replace(obj);

        arrRes.push({ from: rowId, to: table2Row });
      }
    }
  } else if (edgeType === 'oneToMany') {
    for (const [index, row] of table1.values.entries()) {
      for (const [index, rowId2] of table2.rowIds.entries()) {
        if (!rowId2) return;

        const partitionKey = table1?.partitionKeyProp
          ? row[table1.partitionKeyProp]
          : undefined;
        try {
          await container.item(row.id, partitionKey || row.id).patch([
            {
              op: 'add',
              path: `/${path}/-`,
              value: rowId2,
            },
          ]);
          arrRes.push({ from: row, to: rowId2 });
        } catch (error) {
          const { resource: existingDocument } = await container
            .item(row.id, partitionKey || row.id)
            .read();

          const res2 = await container.items.query({
            query: 'Select * from c',
            parameters: [],
          }).fetchAll()

          ensureNestedPathExists(existingDocument, path);

          const nested = createOrUpdateNestedObjectWithArray(
            existingDocument,
            path,
            rowId2,
          );

          const obj = { ...existingDocument, ...nested };

          const res = await container
            .item(row.id, partitionKey || row.id)
            .replace(obj);
          arrRes.push({ from: row, to: rowId2 });
        }
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
        return { id: row.id, ...row };
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
        return { id: row.id, ...row };
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

        const index2 = res.resource.edges[snakeToCamel(table2.tableName)][
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
    const resource = res.resource;
    if (res.statusCode === 404) {
      throw new NotFoundError(
        `did not found document at id ${data.rowId} ${
          data?.rowPartitionKey
            ? `and partition key: ${data.rowPartitionKey} `
            : ''
        }`,
      );
    }

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
      rowId: row.id,
      rowPartitionKey: row[data.edge.partitionKeyProp],
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

export const readTableDataEdge = async (
  data: TableDataEdgeReadReq,
): Promise<TableDataEdgeReadRes> => {
  const { direction, edgeLabel, tableName: edgeTableName } = data.edge;
  const str = filterToQuery(
    { filters: data.filters, from: data.from, to: data.to },
    'p',
    `c.id = "${data.rowId}"`,
  );

  //`SELECT ${props} FROM c JOIN p IN c["edges"]["${data.subContainerName}"] ${str2}`
  const query = `SELECT  p FROM c JOIN p IN c["edges"]["${snakeToCamel(
    edgeTableName,
  )}"]["${data.edge.edgeLabel}"]["${data.edge.direction}"] ${str}`;
  const querySpec = {
    query,
    // `select c.edges${edgeTableName ? `["${edgeTableName}"]` : ''}${
    // edgeLabel ? `["${edgeLabel}"]` : ''
    // }${
    // direction ? `["${direction}"]` : ''
    // },  from c where c.edges["${edgeTableName}"]["${edgeLabel}"]["${direction}"] c.id=@rowId`,
    parameters: [
      {
        name: '@rowId',
        value: data.rowId,
      },
    ],
  };

  let tableContainer;

  if (data.tableName === AUTH_GROUPS) {
    tableContainer = await initiateAuthGroupContainer();
  } else {
    tableContainer = await fetchContainer(data.tableName);
  }

  const { resources } = await tableContainer.items.query(querySpec).fetchAll();
  const resource = resources[0];

  const str2 = filterToQuery(
    { filters: data.filters },
    'p',
    `c.id = "${data.rowId}"`,
  );
  const countStr = `SELECT VALUE COUNT(1) FROM c JOIN p IN c["edges"]["${snakeToCamel(
    edgeTableName,
  )}"]["${data.edge.edgeLabel}"]["${data.edge.direction}"] ${str2}`;
  const { resources: countRes } = await tableContainer.items
    .query({ query: countStr, parameters: [] })
    .fetchAll();
  return {
    edges: resources.map((resource) => resource.p),
    count: countRes[0],
    rowId: data.rowId,
    tableName: data.tableName,
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
): Promise<any> => {
  const tableContainer = await fetchContainer(TABLES);

  const res = (await tableContainer
    .item(data.id, data.name)
    .read()) as ItemResponse<TableRef>;

  if (res.statusCode === 404) {
    throw new NotFoundError('Table not found');
  }

  const document = res.resource;
  if (!document?.hasOwnProperty('edges')) {
    document['edges'] = {};
  }

  for (const prop in data.edges) {
    if (!Array.isArray(document.edges[prop])) {
      document.edges[prop] = [];
    }

    const duplicates = data.edges[prop].filter((edge) =>
      document.edges[prop].some((existingEdge) => {
        if (!!edge.from) {
          return (
            existingEdge?.from?.id === edge?.from?.id &&
            existingEdge?.from?.tableName === edge?.from?.tableName
          );
        } else if (!!edge.to) {
          return (
            existingEdge?.to?.id === edge?.to?.id &&
            existingEdge?.to?.tableName === edge?.to?.tableName
          );
        }
      }),
    );

    if (duplicates.length > 0) {
      throw new ConflictEntityError(
        `Duplicate edge(s) detected for property '${prop}': ${JSON.stringify(
          duplicates,
        )}`,
      );
    }
    document.edges[prop] = document.edges[prop].concat(data.edges[prop]);
    for (const edge of data?.edges[prop]) {
      await readTableEdgesByTableId({
        tableId: edge?.from?.id || edge?.to?.id,
      });
    }
  }

  const res2 = await tableContainer.item(data.id, data.name).replace(document);
  const { _rid, _self, _etag, _attachments, _ts, ...rest } =
    res2.resource as any;

  const updateRelatedDocumentsPromises = [];
  for (const prop in data.edges) {
    data.edges[prop].forEach((edge) => {
      if (edge.from) {
        updateRelatedDocumentsPromises.push(
          updateRelatedDocumentEdges({
            id: edge.from.id,
            name: edge.from.tableName,
            edges: { [prop]: [{ to: { id: data.id, tableName: data.name } }] },
          }),
        );
      } else if (edge.to) {
        updateRelatedDocumentsPromises.push(
          updateRelatedDocumentEdges({
            id: edge.to.id,
            name: edge.to.tableName,
            edges: {
              [prop]: [{ from: { id: data.id, tableName: data.name } }],
            },
          }),
        );
      }
    });
  }

  await Promise.all(updateRelatedDocumentsPromises);

  return rest;
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
