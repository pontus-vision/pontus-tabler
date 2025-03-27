import { COSMOS_DB, dbSource, DELTA_DB } from '../consts';
import {
  DashboardDeleteReq,
  DashboardCreateReq,
  DashboardUpdateReq,
  ReadPaginationFilter,
  DashboardsReadRes,
  DashboardGroupAuthCreateReq,
  DashboardGroupAuthCreateRes,
  DashboardGroupAuthReadReq,
  DashboardGroupAuthReadRes,
  DashboardGroupAuthUpdateReq,
  DashboardGroupAuthUpdateRes,
  DashboardGroupAuthDeleteReq,
  DashboardGroupAuthDeleteRes,
  DashboardUpdateRes,
  DashboardCreateRes,
  InternalServerError,
} from '../typescript/api';
import * as cdb from './cosmosdb/index';
import * as deltadb from './delta/index';

export const createDashboard = async (
  data: DashboardCreateReq,
): Promise<DashboardCreateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.createDashboard(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.createDashboard(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const updateDashboard = async (
  data: DashboardUpdateReq,
): Promise<DashboardUpdateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.updateDashboard(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.updateDashboard(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readDashboardById = async (dashboardId: string, userId: string) => {
  if (dbSource === COSMOS_DB) {
    return cdb.readDashboardById(dashboardId);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readDashboardById(dashboardId, userId);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const deleteDashboard = async (data: DashboardDeleteReq) => {
  if (dbSource === COSMOS_DB) {
    return cdb.deleteDashboard(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.deleteDashboard(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readDashboards = async (
  body: ReadPaginationFilter,
  userId?: string
): Promise<DashboardsReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.readDashboards(body);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readDashboards(body, userId);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const createDashboardAuthGroup = async (
  data: DashboardGroupAuthCreateReq,
): Promise<DashboardGroupAuthCreateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.createDashboardAuthGroup(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.createDashboardAuthGroup(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readDashboardGroupAuth = async (
  data: DashboardGroupAuthReadReq,
): Promise<DashboardGroupAuthReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.readDashboardGroupAuth(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readDashboardGroupAuth(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const deleteDashboardGroupAuth = async (
  data: DashboardGroupAuthDeleteReq,
): Promise<DashboardGroupAuthDeleteRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.deleteDashboardGroupAuth(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.deleteDashboardGroupAuth(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const updateDashboardGroupAuth = async (
  data: DashboardGroupAuthUpdateReq,
): Promise<DashboardGroupAuthUpdateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.updateDashboardGroupAuth(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.updateDashboardGroupAuth(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};
