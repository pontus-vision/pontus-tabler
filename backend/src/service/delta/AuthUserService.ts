import {
  AuthGroupAuthRef,
  AuthGroupCreateReq,
  AuthGroupDashboardRef,
  AuthGroupRef,
  AuthUserAndGroupsRef,
  AuthUserCreateReq,
  AuthUserCreateRes,
  AuthUserDeleteReq,
  AuthUserDeleteRes,
  AuthUserGroupRef,
  AuthUserGroupsCreateReq,
  AuthUserGroupsCreateRes,
  AuthUserGroupsDeleteReq,
  AuthUserGroupsDeleteRes,
  AuthUserGroupsReadReq,
  AuthUserGroupsReadRes,
  AuthUserGroupsUpdateReq,
  AuthUserGroupsUpdateRes,
  AuthUserIdAndUsername,
  AuthUserReadReq,
  AuthUserReadRes,
  AuthUserRef,
  AuthUserUpdateReq,
  AuthUserUpdateRes,
  AuthUsersReadReq,
  AuthUsersReadRes,
  ConflictEntityError,
  InitiateRes,
  LoginReq,
  LoginRes,
  LogoutReq,
  LogoutRes,
  NameAndIdRef,
  RegisterAdminReq,
  RegisterAdminRes,
  RegisterUserRes,
  RegisterUserReq,
  TokenReq,
  TokenRes,
} from '../../typescript/api';
import {
  cosmosDbName,
  fetchContainer,
  fetchData,
  fetchDatabase,
} from '../../cosmos-utils';
import { filterToQuery } from '../../db-utils';
import {
  Container,
  Item,
  ItemResponse,
  PartitionKeyDefinition,
  PatchOperation,
  UniqueKeyPolicy,
} from '@azure/cosmos';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  TemporaryRedirect,
  UnauthorizedError,
} from '../../generated/api';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {
  ADMIN_GROUP_NAME,
  AUTH_GROUPS,
  AUTH_GROUPS_USER_TABLE,
  createAuthGroup,
  createAuthUserGroup,
  createSql,
  initiateAuthGroupContainer,
  objEntriesToStr,
  updateSql,
} from './AuthGroupService';
import {
  createTableDataEdge,
  deleteTableDataEdge,
  readEdge,
  readTableDataEdge,
  updateTableDataEdge,
} from './EdgeService';
import { DASHBOARDS } from './DashboardService';
import * as db from './../../../delta-table/node/index-jdbc';
import { filter, has } from 'lodash';
dotenv.config();
export const AUTH_USERS = 'auth_users';
export const ADMIN_USER_USERNAME = 'ADMIN';
import { v6 as uuidv6 } from 'uuid';
import { GROUPS_USERS } from '../AuthGroupService';

const conn: db.Connection = db.createConnection();

const partitionKey: string | PartitionKeyDefinition = {
  paths: ['/username'],
};

const uniqueKeyPolicy: UniqueKeyPolicy = {
  uniqueKeys: [{ paths: ['/username'] }],
};

export const authUserContainerProps = {
  AUTH_USERS,
  partitionKey,
  uniqueKeyPolicy,
};

export const initiateAuthUserContainer = async (): Promise<Container> => {
  const authUserContainer = await fetchContainer(
    AUTH_USERS,
    partitionKey,
    uniqueKeyPolicy,
  );

  return authUserContainer;
};

export const setup = async (): Promise<InitiateRes> => {
  try {
    const query = `SELECT * from auth_users`;

    const res = await db.executeQuery(query, conn);
    if (res.length === 0) {
      throw new TemporaryRedirect('/register/admin');
    }
  } catch (error) {
    if (error?.code === 404) {
      throw new TemporaryRedirect('/register/admin');
    }
  }

  return '/login';
};

interface registerUser {
  data: RegisterUserReq;
  jdbc: any;
}

export const registerUser = async (
  data: RegisterUserReq,
): Promise<RegisterUserRes> => {
  if (data.password !== data.passwordConfirmation) {
    throw new BadRequestError('Password fields does not match.');
  }

  const res = await authUserCreate(data);

  return {
    id: res.id,
    username: res.username,
  };
};

export const registerAdmin = async (
  data: RegisterAdminReq,
): Promise<RegisterAdminRes> => {
  if (data.password !== data.passwordConfirmation) {
    throw new BadRequestError('Password fields does not match.');
  }

  const res = await authUserCreate(data);

  const group = await createAuthGroup({ name: ADMIN_GROUP_NAME });

  const userGroup = await createAuthUserGroup({
    id: group.id,
    name: group.name,
    jointTableName: GROUPS_USERS,
    authUsers: [{ id: res.id, username: res.username }],
  });

  return {
    id: res.id,
    username: res.username,
  };
};

export interface authUserCreate {
  jdbc: any;
  data: AuthUserCreateReq;
}

export const getRowCount = async (
  table: string,
  conn: db.Connection,
): Promise<string> => {
  const count = await db.executeQuery(
    `SELECT count(1) FROM delta.\`/data/${table}\``,
    conn,
  );

  return count[0]['count(1)'];
};

export const authUserCreate = async (
  data: AuthUserCreateReq,
): Promise<AuthUserCreateRes> => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const sql = await createSql(
      AUTH_USERS,
      'username STRING, password STRING',
      {
        password: hashedPassword,
        username: data.username,
      },
    );
    return {
      username: sql[0]['username'],
      id: sql[0]['id'],
    };
  } catch (error) {
    if (error?.code === 409) {
      throw new ConflictEntityError('username already taken: ' + data.username);
    }
  }
};

export const authUserRead = async (
  data: AuthUserReadReq,
): Promise<AuthUserReadRes> => {
  const res = (await db.executeQuery(
    `SELECT * FROM ${AUTH_USERS} WHERE id = '${data.id}'`,
    conn,
  )) as { username: string; id: string }[];
  if (res.length === 0) {
    throw new NotFoundError(`User not found at id: ${data.id}`);
  }

  const { id, username } = res[0];

  return {
    id,
    username,
  };
};

export const authUserUpdate = async (
  data: AuthUserUpdateReq,
): Promise<AuthUserUpdateRes> => {
  const sql = await updateSql(
    AUTH_USERS,
    { username: data.username },
    `WHERE id = '${data.id}'`,
  );
  if (sql.length === 0) {
    throw new NotFoundError(`No user found at id: ${data.id}`);
  }

  return {
    id: sql[0].id,
    username: sql[0].username,
  };
};

export const authUserDelete = async (
  data: AuthUserDeleteReq,
): Promise<AuthUserDeleteRes> => {
  const sql = await db.executeQuery(
    `DELETE FROM ${AUTH_USERS} WHERE id = '${data.id}'`,
    conn,
  );
  const affectedRows = +sql[0]['num_affected_rows'];
  if (affectedRows === 0) {
    throw new NotFoundError(`No user found at id: ${data.id}`);
  }

  try {
    const sql = await db.executeQuery(
      `DELETE FROM ${GROUPS_USERS} WHERE table_to__id = '${data.id}'`,
      conn,
    );
  } catch (error) {}
  return `User at id "${data.id}" deleted!`;
};

export const authUsersRead = async (
  data: AuthUsersReadReq,
): Promise<AuthUsersReadRes> => {
  const whereClause = filterToQuery(data);
  const sql = await db.executeQuery(
    `SELECT * FROM ${AUTH_USERS} ${whereClause}`,
    conn,
  );
  const whereClause2 = filterToQuery({ filters: data.filters });
  const sqlCount = await db.executeQuery(
    `SELECT COUNT(*) FROM ${AUTH_USERS} ${whereClause2}`,
    conn,
  );
  if (+sqlCount[0]['count(1)'] === 0) {
    throw new NotFoundError(`Auth User(s) not found.`);
  }
  return {
    authUsers: sql.map((el) => {
      return { id: el['id'], username: el['username'] };
    }),
    count: +sqlCount[0]['count(1)'],
  };
};

export const authUserGroupsCreate = async (
  data: AuthUserGroupsCreateReq,
): Promise<AuthUserGroupsCreateRes> => {
  const res = await createTableDataEdge({
    edge: GROUPS_USERS,
    edgeType: 'oneToMany',
    jointTableName: GROUPS_USERS,
    tableFrom: {
      tableName: AUTH_GROUPS,
      rows: data.authGroups as any,
      partitionKeyProp: 'name',
    },
    tableTo: {
      tableName: AUTH_USERS,
      rows: [{ id: data.id, username: data.username }],
      partitionKeyProp: 'username',
    },
  });

  return {
    id: data.id,
    authGroups: data.authGroups as AuthGroupRef[],

    username: data.username,
  };
};

export const authUserGroupsRead = async (
  data: AuthUserGroupsReadReq,
): Promise<AuthUserGroupsReadRes> => {
  const filtersRefactor = {};

  for (const prop in data.filters) {
    if (prop === 'name') {
      filtersRefactor['table_from__name'] = {
        ...data.filters[prop],
      };
    }
  }

  const res = (await readTableDataEdge({
    edge: {
      direction: 'from',
      // edgeLabel: AUTH_GROUPS,
      tableName: GROUPS_USERS,
    },
    jointTableName: GROUPS_USERS,
    tableName: AUTH_USERS,
    rowId: data.id,
    filters: filtersRefactor,
    from: data.from,
    to: data.to,
  })) as any;

  if (res.count === 0) {
    throw new NotFoundError('No group auth found.');
  }
  return {
    count: res.count,
    authGroups: res.edges.map((edge) => {
      return { ...edge.to, id: edge.from.id, name: edge.from.name };
    }) as NameAndIdRef[],
  };
};

export const authUserGroupsUpdate = async (
  data: AuthUserGroupsUpdateReq,
): Promise<AuthUserGroupsUpdateRes> => {
  const usersContainer = await fetchContainer(AUTH_USERS);

  const res2 = await usersContainer.item(data.id, data.id).read();

  if (res2.statusCode === 404) {
    throw new NotFoundError(`Did not find any group at id "${data.id}"`);
  }
  const username = res2.resource.username;

  const res = (await updateTableDataEdge({
    tableFrom: {
      rows: data.authGroups as any,
      tableName: AUTH_GROUPS,
      partitionKeyProp: 'name',
    },
    edge: 'groups-users',
    edgeType: 'oneToMany',
    tableTo: {
      tableName: AUTH_USERS,
      rows: [{ username, id: data.id }] as any,
      partitionKeyProp: 'username',
    },
  })) as any;

  return {
    authGroups: res.map((el) => el.to) as AuthGroupDashboardRef[],
    id: data.id,
    username,
  };
};
export const authUserGroupsDelete = async (
  data: AuthUserGroupsDeleteReq,
): Promise<AuthUserGroupsDeleteRes> => {
  const sqlStr = `DELETE FROM ${GROUPS_USERS} WHERE table_to__id = '${
    data.id
  }' AND ${data.authGroups
    .map((group) => `table_from__id = '${group.id}'`)
    .join(' OR ')}`;

  const sql = await db.executeQuery(sqlStr, conn);
  const affectedRows = +sql[0]['num_affected_rows'];

  if (affectedRows === 0) {
    throw new NotFoundError('no rows deleted.');
  }
  return '';
};

export const checkUserPermissions = async (data: {
  userId: string;
  username?: string;
  authTable: 'table' | 'dashboard' | 'tableData';
}): Promise<{
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}> => {
  const authUserContainer = await initiateAuthUserContainer();
  const authGroupContainer = await initiateAuthGroupContainer();

  const user = await authUserContainer.item(data.userId, data.username).read();

  const userGroups = user.resource.authGroups as AuthGroupRef[];

  if (userGroups.some((el) => el.name === ADMIN_GROUP_NAME)) {
    return {
      create: true,
      read: true,
      update: true,
      delete: true,
    };
  }

  let create = false;
  let read = false;
  let update = false;
  let del = false;

  for (const group of userGroups) {
    const res = (await authGroupContainer
      .item(group.id, group.name)
      .read()) as ItemResponse<AuthGroupRef>;
    const permissions = res.resource.tableMetadata;

    if (permissions.create) {
      create = true;
    }
    if (permissions.read) {
      read = true;
    }
    if (permissions.update) {
      update = true;
    }
    if (permissions.delete) {
      del = true;
    }
  }

  return {
    create,
    read,
    update,
    delete: del,
  };
};

interface IAuthUser extends AuthUserAndGroupsRef {
  password: string;
}

export const checkAdmin = async (userId) => {
  const res = await db.executeQuery(
    `SELECT COUNT(*) FROM ${GROUPS_USERS} WHERE table_from__name = 'Admin' AND table_to__id = '${userId}'`,
    conn,
  );

  if (res.length === 0) {
    throw new UnauthorizedError('User does not belong to the admin group.');
  } else {
    return true;
  }
};

export const loginUser = async (data: LoginReq): Promise<LoginRes> => {
  const query = `SELECT * from auth_users WHERE username = "${data.username}"`;

  const res = await db.executeQuery(query, conn);

  if (res.length === 0) {
    throw new NotFoundError(`${data.username} not found.`);
  }
  const user = res[0] as IAuthUser;
  const password = user.password;
  const username = user.username;

  const isPasswordValid = await bcrypt.compare(data.password, password);

  if (!isPasswordValid) {
    throw new BadRequestError('Wrong password');
  }

  const accessToken = generateAccessToken({ userId: user.id, username });

  const refreshToken = jwt.sign(
    { userId: user.id, username },
    process.env.REFRESH_JWT_SECRET_KEY,
  );

  const res212 = await createSql(
    'refresh_token',
    'user_id STRING, refresh_token STRING',
    { user_id: user.id, refresh_token: refreshToken },
  );

  return { accessToken, refreshToken: res212[0]['refresh_token'] };
};

export const logout = async (data: LogoutReq): Promise<LogoutRes> => {
  const claims = getJwtClaims(data.token);
  const username = claims.username;
  const userId = claims.userId;

  const sql = await db.executeQuery(
    `DELETE FROM refresh_token WHERE user_id = '${userId}'`,
    conn,
  );

  const affectedRows = +sql[0]['num_affected_rows'];
  if (affectedRows === 0) {
    throw new NotFoundError(
      'There is no such refresh token stored in the database',
    );
  }

  return 'Token deleted.';
};

export const refreshToken = async (data: TokenReq): Promise<TokenRes> => {
  const authUserContainer = await initiateAuthUserContainer();

  const claims = getJwtClaims(data.token.split(' ')[1]);
  const username = claims.username;
  const userId = claims.userId;

  const refreshToken = data.token;

  const refreshTokens = (await authUserContainer.item(userId, username).read())
    .resource.refreshTokens;

  if (refreshToken == null) throw new BadRequestError('Please insert a token.');
  if (!refreshTokens.includes(refreshToken))
    throw new NotFoundError('refresh token not found.');
  let res;
  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET_KEY, (err, user) => {
    if (err) throw new BadRequestError('Wrong token inserted.');
    const accessToken = generateAccessToken({ name: user.name });
    res = accessToken;
  });
  return res;
};

export const authenticateToken = async (
  req,
  res,
): Promise<{ username: string; userId: string }> => {
  await setup();

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    throw { code: 400, message: 'No token was detected in the input.' };
  }
  const claims = getJwtClaims(token);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    console.log(err);
    if (err) throw new BadRequestError(`token needed.`);
    req.user = user;
    return true;
  });
  return claims;
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h',
  });
}

function base64UrlDecode(str) {
  // Replace '-' with '+' and '_' with '/'
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad the string with '=' to make its length a multiple of 4
  while (str.length % 4) {
    str += '=';
  }
  // Decode the Base64 string
  return atob(str);
}

function getJwtClaims(token) {
  // Split the token into parts
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token');
  }
  // Decode the payload
  const payload = base64UrlDecode(parts[1]);
  // Parse the JSON string to get the claims
  const claims = JSON.parse(payload);
  return claims;
}
