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
} from '../typescript/api';
import { fetchContainer } from '../cosmos-utils';
import { ItemResponse, PatchOperation, ResourceResponse } from '@azure/cosmos';
import { ConflictEntityError, NotFoundError } from '../generated/api';

const TABLES = 'tables';




export const createTableDataEdge = async (
  data: TableDataEdgeCreateReq, 
): Promise<TableDataEdgeCreateRes> => {
  const arrRes = [];
  

  function getOrCreatePath(obj, path, defaultValue = {}) {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        // If this is the last part of the path, return or set the value
        if (current[part] === undefined) {
          current[part] = defaultValue;
        }
        return current[part];
      } else {
        // For other parts, ensure they are objects
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    }

    return current;
  }

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

  const createConnection = async (
    direction: 'from' | 'to',
    table1: { rowIds: string[]; tableName: string },
    table2: { rowIds: string[]; tableName: string },
  ) => {
    const container = await fetchContainer(table1.tableName);

    if (data.edgeType === 'oneToOne') {
      for (const [index, rowId] of table1.rowIds.entries()) {
        const table2RowId = table2.rowIds.at(index);

        if (!table2RowId) return;
        const path = `edges/${table2.tableName}/${data.edge}/${direction}`;

        try {
          await container.item(rowId, rowId).patch([
            {
              op: 'add',
              path: `/${path}/-`,
              value: table2RowId,
            },
          ]);
          arrRes.push({ from: rowId, to: table2RowId });
        } catch (error) {
          const { resource: existingDocument } = await container
            .item(rowId, rowId)
            .read();

          ensureNestedPathExists(existingDocument, path);

          existingDocument['edges'][table2.tableName][data.edge][
            direction
          ].push(table2RowId);

          await container.item(rowId, rowId).replace(existingDocument);
          arrRes.push({ from: rowId, to: table2RowId });
        }
      }
    } else if (data.edgeType === 'oneToMany') {
      for (const [index, rowId] of table1.rowIds.entries()) {
        for (const [index, rowId2] of table2.rowIds.entries()) {
          if (!rowId2) return;
          const path = `edges/${table2.tableName}/${data.edge}/${direction}`;

          try {
            await container.item(rowId, rowId).patch([
              {
                op: 'add',
                path: `/${path}/-`,
                value: rowId2,
              },
            ]);
            arrRes.push({ from: rowId, to: rowId2 });
          } catch (error) {
            const { resource: existingDocument } = await container
              .item(rowId, rowId)
              .read();

            ensureNestedPathExists(existingDocument, path);

            existingDocument['edges'][table2.tableName][data.edge][
              direction
            ].push(rowId2);

            await container.item(rowId, rowId).replace(existingDocument);
            arrRes.push({ from: rowId, to: rowId2 });
          }
        }
      }
    }
  };

  await createConnection(
    'to',
    { tableName: data.tableFrom.tableName, rowIds: data.tableFrom.rowIds },
    { tableName: data.tableTo.tableName, rowIds: data.tableTo.rowIds },
  );
  await createConnection(
    'from',
    { tableName: data.tableTo.tableName, rowIds: data.tableTo.rowIds },
    { tableName: data.tableFrom.tableName, rowIds: data.tableFrom.rowIds },
  );

  return arrRes;
};

export const deleteTableDataEdge = async (data: TableDataEdgeDeleteReq) => {
  const deleteConnection = async (data: TableDataEdgeDeleteReq) => {
    const container = await fetchContainer(data.tableName);

    const res = (await container.item(data.rowId, data.rowId).read()).resource;

    const {
      direction,
      edgeLabel,
      rowIds,
      tableName: edgeTableName,
    } = data.edge;

    rowIds.forEach((rowId) => {
      const index = res.edges[edgeTableName][edgeLabel][direction].findIndex(
        (el) => el === rowId,
      );

      const resPatch = container.item(data.rowId, data.rowId).patch([
        {
          op: 'remove',
          path: `/edges/${edgeTableName}/${edgeLabel}/${direction}/${index}`,
        },
      ]);
    });
  };

  data.edge.rowIds.forEach(async (rowId) => {
    await deleteConnection({
      tableName: data.edge.tableName,
      edge: {
        direction: data.edge.direction === 'from' ? 'to' : 'from',
        edgeLabel: data.edge.edgeLabel,
        rowIds: [data.rowId],
        tableName: data.tableName,
      },
      rowId,
    });
  });

  await deleteConnection(data);
};

export const readTableDataEdge = async (
  data: TableDataEdgeReadReq,
): Promise<TableDataEdgeReadRes> => {
  const { direction, edgeLabel, tableName: edgeTableName } = data.edge;

  const querySpec = {
    query: `select c.edges${edgeTableName ? `["${edgeTableName}"]` : ''}${
      edgeLabel ? `["${edgeLabel}"]` : ''
    }${direction ? `["${direction}"]` : ''}, c.id from c where c.id=@rowId`,
    parameters: [
      {
        name: '@rowId',
        value: data.rowId,
      },
    ],
  };

  const tableContainer = await fetchContainer(data.tableName);

  const { resources } = await tableContainer.items.query(querySpec).fetchAll();
  const resource = resources[0];

  return {
    edges: resource,
    rowId: resource.id,
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
