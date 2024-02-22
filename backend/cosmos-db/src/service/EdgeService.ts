import {
  TableEdgeCreateReq,
  TableEdgeDeleteReq,
  TableEdgeReadReq,
  TableEdgeUpdateReq,
  TableRef,
  TableReadRes,
  TableEdgeReadRes,
} from '../typescript/api';
import { fetchContainer } from '../cosmos-utils';
import { ItemResponse, PatchOperation } from '@azure/cosmos';
import { ConflictEntityError, NotFoundError } from '../generated/api';

const TABLES = 'tables';

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
      console.log({
        duplicates: JSON.stringify(duplicates),
        document: JSON.stringify(document.edges[prop]),
        data: JSON.stringify(data.edges[prop]),
      });
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
