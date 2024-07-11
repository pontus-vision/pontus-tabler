import {
  AuthUserCreateReq,
  AuthUserCreateRes,
  AuthUserDeleteReq,
  AuthUserDeleteRes,
  AuthUserGroupsCreateReq,
  AuthUserGroupsCreateRes,
  AuthUserGroupsReadReq,
  AuthUserGroupsReadRes,
  AuthUserGroupsUpdateReq,
  AuthUserGroupsUpdateRes,
  AuthUserReadReq,
  AuthUserReadRes,
  AuthUserUpdateReq,
  AuthUserUpdateRes,
  AuthUsersReadReq,
  AuthUsersReadRes,
  InitiateRes,
  LoginReq,
  LoginRes,
  LogoutReq,
  LogoutRes,
  RegisterAdminReq,
  RegisterAdminRes,
  RegisterUserRes,
  RegisterUserReq,
  AuthUserGroupsDeleteRes,
  AuthUserGroupsDeleteReq,
} from '../typescript/api';
import { InternalServerError } from '../generated/api';
import dotenv from 'dotenv';
import * as cdb from './cosmosdb';
import * as deltadb from './delta';
import { dbSource, COSMOS_DB, DELTA_DB } from './AuthGroupService';
dotenv.config();

export const setup = async (): Promise<InitiateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.setup();
  } else if (dbSource === DELTA_DB) {
    return deltadb.setup();
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const registerUser = async (
  data: RegisterUserReq,
): Promise<RegisterUserRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.registerUser(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.registerUser(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const registerAdmin = async (
  data: RegisterAdminReq,
): Promise<RegisterAdminRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.registerAdmin(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.registerAdmin(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const authUserCreate = async (
  data: AuthUserCreateReq,
): Promise<AuthUserCreateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.authUserCreate(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.authUserCreate(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const authUserRead = async (
  data: AuthUserReadReq,
): Promise<AuthUserReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.authUserRead(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.authUserRead(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const authUserUpdate = async (
  data: AuthUserUpdateReq,
): Promise<AuthUserUpdateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.authUserUpdate(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.authUserUpdate(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const authUserDelete = async (
  data: AuthUserDeleteReq,
): Promise<AuthUserDeleteRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.authUserDelete(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.authUserDelete(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const authUsersRead = async (
  data: AuthUsersReadReq,
): Promise<AuthUsersReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.authUserRead(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.authUserRead(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const authUserGroupsCreate = async (
  data: AuthUserGroupsCreateReq,
): Promise<AuthUserGroupsCreateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.authUserRead(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.authUserRead(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const authUserGroupsRead = async (
  data: AuthUserGroupsReadReq,
): Promise<AuthUserGroupsReadRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.authUserGroupsRead(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.authUserGroupsRead(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const authUserGroupsUpdate = async (
  data: AuthUserGroupsUpdateReq,
): Promise<AuthUserGroupsUpdateRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.authUserGroupsUpdate(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.authUserGroupsUpdate(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const authUserGroupsDelete = async (
  data: AuthUserGroupsDeleteReq,
): Promise<AuthUserGroupsDeleteRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.authUserGroupsDelete(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.authUserGroupsDelete(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const loginUser = async (data: LoginReq): Promise<LoginRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.loginUser(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.loginUser(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const logout = async (data: LogoutReq): Promise<LogoutRes> => {
  if (dbSource === COSMOS_DB) {
    return cdb.logout(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.logout(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};
