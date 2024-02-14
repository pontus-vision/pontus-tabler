import {
  ReadPaginationFilter,
  TableCreateReq,
  TableCreateRes,
  TableDeleteReq,
  TableEdgeCreateReq,
  TableEdgeCreateRes,
  TableEdgeDeleteReq,
  TableEdgeReadReq,
  TableEdgeUpdateReq,
  TableRef,
  TableReadReq,
  TableReadRes,
  TableUpdateReq,
  TablesReadRes,
  Edge,
  TableEdgeReadRes,
} from '../typescript/api';
import { deleteContainer, fetchContainer, fetchData } from '../cosmos-utils';
import {
  Item,
  ItemResponse,
  PartitionKeyDefinition,
  PatchOperation,
  UniqueKeyPolicy,
} from '@azure/cosmos';
import { NotFoundError } from '../generated/api';
import { table } from 'console';

const TABLES = 'tables';

// const partitionKey: string | PartitionKeyDefinition = {
//   paths: ['/name'],
// };

// const uniqueKeyPolicy: UniqueKeyPolicy = {
//   uniqueKeys: [{ paths: ['/name'] }],
// };

const updateRelatedDocumentEdges = async (relatedData: TableEdgeCreateReq) => {
  const tableContainer = await fetchContainer(TABLES);
  const res = (await tableContainer
    .item(relatedData.id, relatedData.name)
    .read()) as ItemResponse<TableRef>;

  if (res.statusCode === 404) {
    throw new NotFoundError('Related document not found');
  }

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
    document.edges[prop] = document.edges[prop].concat(data.edges[prop]);
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

export const updateTableEdge = async (data: TableEdgeUpdateReq) => {
  try {
    const tableContainer = await fetchContainer(
      TABLES,
      // partitionKey,
      // uniqueKeyPolicy,
    );
    const res = (await tableContainer
      .item(data.id, data.id)
      .read()) as ItemResponse<TableRef>;

    const resource = res.resource;

    const patchArr: PatchOperation[] = [];

    for (const prop in data.edges) {
      const edgeArr = data.edges[prop];
      const indexUpdate = edgeArr.map((edgeInput) =>
        resource.edges[prop].findIndex((el) => edgeInput === el),
      );
      for (const [index, el] of edgeArr.entries()) {
        const patchOp: PatchOperation = {
          op: 'set',
          path: `/edges/${prop}/${index}`,
          value: el,
        };
        patchArr.push(patchOp);
      }
    }

    const res2 = await tableContainer.item(data.id, data.id).patch(patchArr);
    const { _rid, _self, _etag, _attachments, _ts, ...rest } =
      res.resource as any;

    return rest;
  } catch (error) {
    throw error;
  }
};

export const readTableEdgesByTableId = async (
  data: TableEdgeReadReq,
): Promise<TableEdgeReadRes> => {
  const tableContainer = await fetchContainer(
    TABLES,
    // partitionKey,
    // uniqueKeyPolicy,
  );

  const res = (await tableContainer
    .item(data.tableId, data.tableId)
    .read()) as ItemResponse<TableRef>;

  return {
    edges: res.resource.edges,
    id: res.resource.id,
    name: res.resource.name,
  };
};

export const readTableByName = async (name: string): Promise<TableReadRes> => {
  const querySpec = {
    query: 'select * from tables p where p.name=@tableName',
    parameters: [
      {
        name: '@tableName',
        value: name,
      },
    ],
  };

  const tableContainer = await fetchContainer(
    TABLES,
    // partitionKey,
    // uniqueKeyPolicy,
  );

  const { resources } = await tableContainer.items.query(querySpec).fetchAll();

  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw { code: 404, message: 'No table found.' };
  }
};

export const deleteTableEdge = async (data: TableEdgeDeleteReq) => {
  try {
    const tableContainer = await fetchContainer(
      TABLES,
      // partitionKey,
      // uniqueKeyPolicy,
    );

    const res = (await tableContainer
      .item(data.id, data.id)
      .read()) as ItemResponse<TableRef>;

    const resource = res.resource;

    const patchArr: PatchOperation[] = [];

    for (const prop in data.edges) {
      const edgeArr = resource.edges[prop];

      for (const [index, el] of edgeArr.entries()) {
        const patchOp: PatchOperation = {
          op: 'remove',
          path: `/edges/${prop}/${index}`,
          value: el,
        };
        patchArr.push(patchOp);
      }
    }

    const res2 = await tableContainer.item(data.id, data.id).patch(patchArr);
    const { _rid, _self, _etag, _attachments, _ts, ...rest } =
      res2.resource as any;

    // return rest;

    return 'Table deleted!';
  } catch (error) {
    throw error;
  }
};

// export const readTables = async (
//   body: ReadPaginationFilter,
// ): Promise<TablesReadRes> => {
//   const res = await fetchData(body, 'tables');
//   return { totalTables: res.count, tables: res.values };
// };
