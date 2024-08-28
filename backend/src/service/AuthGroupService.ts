import {
  AuthGroupCreateReq,
  AuthGroupDashboardCreateReq,
  AuthGroupDashboardCreateRes,
  AuthGroupDashboardDeleteReq,
  AuthGroupDashboardDeleteRes,
  AuthGroupDashboardUpdateReq,
  AuthGroupDashboardUpdateRes,
  AuthGroupDashboardsReadReq,
  AuthGroupDashboardsReadRes,
  AuthGroupDeleteReq,
  AuthGroupDeleteRes,
  AuthGroupReadReq,
  AuthGroupReadRes,
  AuthGroupTableReadReq,
  AuthGroupTableReadRes,
  AuthGroupTableUpdateReq,
  AuthGroupTableUpdateRes,
  AuthGroupTablesCreateReq,
  AuthGroupTablesCreateRes,
  AuthGroupTablesDeleteReq,
  AuthGroupTablesDeleteRes,
  AuthGroupTablesReadReq,
  AuthGroupTablesReadRes,
  AuthGroupUpdateReq,
  AuthGroupUpdateRes,
  AuthGroupUsersCreateReq,
  AuthGroupUsersCreateRes,
  AuthGroupUsersDeleteReq,
  AuthGroupUsersDeleteRes,
  AuthGroupUsersReadReq,
  AuthGroupUsersReadRes,
  AuthGroupUsersUpdateReq,
  AuthGroupUsersUpdateRes,
  AuthGroupsReadReq,
  AuthGroupsReadRes,
  InternalServerError,
} from '../generated/api';
import { CrudDocumentRef } from '../typescript/api';

import * as cdb from './cosmosdb/index';
import * as deltadb from './delta/index';

export const COSMOS_DB = 'cosmosdb';
export const DELTA_DB = 'deltadb';
export const GROUPS_USERS = 'groups_users';
export const GROUPS_TABLES = 'groups_tables';

export const dbSource = process.env.DB_SOURCE || COSMOS_DB;

export const createAuthGroup = async (data: AuthGroupCreateReq) => {
  if (dbSource === COSMOS_DB) {
    return cdb.createAuthGroup(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.createAuthGroup(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const updateAuthGroup = async (
  data: AuthGroupUpdateReq,
): Promise<AuthGroupUpdateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.updateAuthGroup(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.updateAuthGroup(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readAuthGroup = async (
  data: AuthGroupReadReq,
): Promise<AuthGroupReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.readAuthGroup(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readAuthGroup(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const deleteAuthGroup = async (
  data: AuthGroupDeleteReq,
): Promise<AuthGroupDeleteRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.deleteAuthGroup(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.deleteAuthGroup(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readAuthGroups = async (
  data: AuthGroupsReadReq,
): Promise<AuthGroupsReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.readAuthGroups(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readAuthGroups(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const createAuthGroupDashboards = async (
  data: AuthGroupDashboardCreateReq,
): Promise<AuthGroupDashboardCreateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.createAuthGroupDashboards(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.createAuthGroupDashboards(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readAuthGroupDashboards = async (
  data: AuthGroupDashboardsReadReq,
): Promise<AuthGroupDashboardsReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.readAuthGroupDashboards(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readAuthGroupDashboards(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const updateAuthGroupDashboards = async (
  data: AuthGroupDashboardUpdateReq,
): Promise<AuthGroupDashboardUpdateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.updateAuthGroupDashboards(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.updateAuthGroupDashboards(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const deleteAuthGroupDashboards = async (
  data: AuthGroupDashboardDeleteReq,
): Promise<AuthGroupDashboardDeleteRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.deleteAuthGroupDashboards(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.deleteAuthGroupDashboards(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const createAuthUserGroup = async (
  data: AuthGroupUsersCreateReq,
): Promise<AuthGroupUsersCreateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.createAuthUserGroup(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.createAuthUserGroup(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readAuthGroupTables = async (
  data: AuthGroupTablesReadReq,
): Promise<AuthGroupTablesReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.readAuthGroupTables(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readAuthGroupTables(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readAuthGroupUsers = async (
  data: AuthGroupUsersReadReq,
): Promise<AuthGroupUsersReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.readAuthGroupUsers(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readAuthGroupUsers(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const updateAuthGroupUsers = async (
  data: AuthGroupUsersUpdateReq,
): Promise<AuthGroupUsersUpdateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.updateAuthGroupUsers(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.updateAuthGroupUsers(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const deleteAuthGroupUsers = async (
  data: AuthGroupUsersDeleteReq,
): Promise<AuthGroupUsersDeleteRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.deleteAuthGroupUsers(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.deleteAuthGroupUsers(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const createAuthGroupTables = async (
  data: AuthGroupTablesCreateReq,
): Promise<AuthGroupTablesCreateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.createAuthGroupTables(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.createAuthGroupTables(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const deleteAuthGroupTables = async (
  data: AuthGroupTablesDeleteReq,
): Promise<AuthGroupTablesDeleteRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.deleteAuthGroupTables(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.deleteAuthGroupTables(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readAuthGroupTable = async (
  data: AuthGroupTableReadReq,
): Promise<AuthGroupTableReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.readAuthGroupTable(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readAuthGroupTable(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const updateAuthGroupTable = async (
  data: AuthGroupTableUpdateReq,
): Promise<AuthGroupTableUpdateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.updateAuthGroupTable(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.updateAuthGroupTable(data);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const checkTableMetadataPermissions = async (
  userId: string,
): Promise<CrudDocumentRef> => {
  if (dbSource === COSMOS_DB) {
    return cdb.checkTableMetadataPermissions(userId);
  } else if (dbSource === DELTA_DB) {
    return deltadb.checkTableMetadataPermissions(userId);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const checkPermissions = async (
  userId: string,
  targetId: string,
  containerId: 'auth_users' | 'dashboards' | 'tables',
): Promise<CrudDocumentRef> => {
  if (dbSource === COSMOS_DB) {
    return cdb.checkPermissions(userId, targetId, containerId);
  } else if (dbSource === DELTA_DB) {
    return deltadb.checkPermissions(userId, targetId, containerId);
  }

  throw new InternalServerError(`invalid data source. ${dbSource}`);
};
