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
  InternalServerError,
} from '../typescript/api';
import { COSMOS_DB, DELTA_DB, dbSource } from './AuthGroupService';
import * as cdb from './cosmosdb/index';
import * as deltadb from './delta/index';

export const GROUPS_DASHBOARDS = 'groups_dashboards';
export const GROUPS_USERS = 'groups-users';
export const GROUPS_TABLES = 'groups-tables';

export const createTableDataEdge = async (
  data: TableDataEdgeCreateReq,
): Promise<TableDataEdgeCreateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.createTableDataEdge(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.createTableDataEdge(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const updateTableDataEdge = async (
  data: TableDataEdgeCreateReq,
): Promise<TableDataEdgeCreateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.updateTableDataEdge(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.updateTableDataEdge(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const deleteTableDataEdge = async (data: TableDataEdgeDeleteReq) => {
  if (dbSource === COSMOS_DB) {
    return cdb.deleteTableDataEdge(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.deleteTableDataEdge(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readTableDataEdge = async (
  data: TableDataEdgeReadReq,
): Promise<TableDataEdgeReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.readTableDataEdge(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readTableDataEdge(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const createTableEdge = async (
  data: TableEdgeCreateReq,
): Promise<any> => {
  if (dbSource === COSMOS_DB) {
    return cdb.createTableEdge(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.createTableEdge(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
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
  if (dbSource === COSMOS_DB) {
    return cdb.readTableEdgesByTableId(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readTableEdgesByTableId(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const deleteTableEdge = async (data: TableEdgeDeleteReq) => {
  if (dbSource === COSMOS_DB) {
    return cdb.deleteTableEdge(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.deleteTableEdge(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};
