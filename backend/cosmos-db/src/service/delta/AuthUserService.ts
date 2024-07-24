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
  filterToQuery,
} from '../../cosmos-utils';
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
  createAuthGroup,
  createAuthUserGroup,
  initiateAuthGroupContainer,
  objEntriesToStr,
} from './AuthGroupService';
import {
  createTableDataEdge,
  deleteTableDataEdge,
  readEdge,
  readTableDataEdge,
  updateTableDataEdge,
} from './EdgeService';
import { DASHBOARDS } from './DashboardService';
import { executeQuery } from '../../../../delta-table/node/index-jdbc';
import { has } from 'lodash';
dotenv.config();
export const AUTH_USERS = 'auth_users';
export const ADMIN_USER_USERNAME = 'ADMIN';
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
  const database = await fetchDatabase(cosmosDbName);
  try {
    const container = await database.container(AUTH_USERS).read();
  } catch (error) {
    if (error?.code === 404) {
      throw new TemporaryRedirect('/register/admin');
    }
  }

  const authUserContainer = await initiateAuthUserContainer();
  const res2 = await authUserContainer.items
    .query({
      query: 'select * from c',
      parameters: [],
    })
    .fetchAll();

  if (res2.resources.length === 0) {
    throw new TemporaryRedirect('/register/admin');
  }
  return '/login';
};

export const registerUser = async (
  data: RegisterUserReq,
): Promise<RegisterUserRes> => {
  if (data.password !== data.passwordConfirmation) {
    throw new BadRequestError('Password fields does not match.');
  }

  const res = await authUserCreate({
    username: data.username,
    password: data.password,
    passwordConfirmation: data.passwordConfirmation,
  });

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

  const res = await authUserCreate({
    username: data.username,
    password: data.password,
    passwordConfirmation: data.passwordConfirmation,
  });

  const group = await createAuthGroup({ name: ADMIN_GROUP_NAME });

  const userGroup = await createAuthUserGroup({
    id: group.id,
    name: group.name,
    authUsers: [{ id: res.id, username: res.username }],
  });

  return {
    id: res.id,
    username: res.username,
  };
};

export const authUserCreate = async (
  data: AuthUserCreateReq,
): Promise<AuthUserCreateRes> => {
  if (data.password.length < 6) {
    throw new BadRequestError('Please, insert at least 6 characters.');
  }

  if (data.password !== data.passwordConfirmation) {
    throw new BadRequestError(
      'Password and confirmation fields does not match.',
    );
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const { keysStr, valuesStr } = objEntriesToStr({...data, password: hashedPassword});


  try {
    const res = executeQuery(
      `CREATE TABLE IF NOT EXISTS ${AUTH_USERS} (id INT, username STRING, password STRING) USING DELTA LOCATION '/data/delta-test-2'`
    );
    
    const res2 = executeQuery(
    `INSERT INTO ${AUTH_USERS} (id, username, password) values (1, '${data.username}', '${hashedPassword}')`
    );

    const res3 = executeQuery(
      `SELECT * FROM delta.\`/data/delta-test-2\``
      );

    return {
      username: '',
      id: '',
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
  const authUserContainer = await initiateAuthUserContainer();

  const userId = data.id;
  const usernameInput = data.username;

  const res = (await authUserContainer
    .item(userId, usernameInput)
    .read()) as ItemResponse<AuthUserRef>;

  if (res.statusCode === 404) {
    throw new NotFoundError(`User not found at id: ${data.id}`);
  }

  const { id, username } = res.resource;

  return {
    id,
    username,
  };
};

export const authUserUpdate = async (
  data: AuthUserUpdateReq,
): Promise<AuthUserUpdateRes> => {
  const authUserContainer = await initiateAuthUserContainer();

  try {
    const res = (await authUserContainer
      .item(data.id, data.username)
      .patch([
        { op: 'replace', path: '/username', value: data.username },
      ])) as ItemResponse<AuthUserRef>;

    const { id, username } = res.resource;

    return {
      id,
      username,
    };
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError(`No user found at id: ${data.id}`);
    }
  }
};

export const authUserDelete = async (
  data: AuthUserDeleteReq,
): Promise<AuthUserDeleteRes> => {
  const authUserContainer = await initiateAuthUserContainer();
  const authGroupContainer = await initiateAuthGroupContainer();

  const authUserDoc = await authUserContainer.item(data.id, data.username);

  const res = (await authUserDoc.read()) as ItemResponse<AuthUserAndGroupsRef>;

  if (res.statusCode === 404) {
    throw new NotFoundError(`No user found at id: ${data.id}`);
  }

  for (const [index, authGroup] of res.resource.authGroups.entries()) {
    try {
      const authGroupDoc = await authGroupContainer.item(
        authGroup.id,
        authGroup.id,
      );
      const res = await authGroupDoc.read();

      const index = res.resource.authUsers.findIndex((el) => el.id === data.id);

      const res2 = await authGroupDoc.patch([
        { op: 'remove', path: `/authUsers/${index}` },
      ]);
    } catch (error) {}
  }

  const res2 = await authUserDoc.delete();

  if (res2.statusCode !== 204) {
    throw new InternalServerError(`Could not delete User at id '${data.id}'`);
  }

  return `User at id "${data.id}" deleted!`;
};

export const authUsersRead = async (
  data: AuthUsersReadReq,
): Promise<AuthUsersReadRes> => {
  try {
    const res = await fetchData(data, AUTH_USERS);
    return {
      authUsers: res.values,
      count: res.count,
    };
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError(`Auth User(s) not found.`);
    }
  }
};

export const authUserGroupsCreate = async (
  data: AuthUserGroupsCreateReq,
): Promise<AuthUserGroupsCreateRes> => {
  const res = await createTableDataEdge({
    edge: 'groups-users',
    edgeType: 'oneToMany',
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
  const res = (await readTableDataEdge({
    edge: {
      direction: 'from',
      edgeLabel: 'groups-users',
      tableName: AUTH_GROUPS,
    },
    tableName: AUTH_USERS,
    rowId: data.id,
    filters: data.filters,
    from: data.from,
    to: data.to,
  })) as any;

  if (res.count === 0) {
    throw new NotFoundError('No group auth found.');
  }
  return {
    count: res.count,
    authGroups: res.edges as NameAndIdRef[],
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
  const res = await deleteTableDataEdge({
    rowId: data.id,
    tableName: AUTH_USERS,
    edge: {
      direction: 'from',
      edgeLabel: 'groups-users',
      tableName: AUTH_GROUPS,
      rows: data.authGroups,
      partitionKeyProp: 'name',
    },

    rowPartitionKey: data.username,
  });

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
  const res = await readEdge({
    containerId: AUTH_USERS,
    edgeContainer: AUTH_GROUPS,
    direction: 'from',
    edgeLabel: 'groups-users',
    filters: {
      filters: {
        name: {
          filter: ADMIN_GROUP_NAME,
          filterType: 'text',
          type: 'equals',
        },
      },
    },
    rowId: userId,
  });
  if (res.length === 0) {
    throw new UnauthorizedError('User does not belong to the admin group.');
  } else {
    return true;
  }
};

export const loginUser = async (data: LoginReq): Promise<LoginRes> => {
  const query = `SELECT c.username, c.password, c.authGroups, c.id from authUsers c WHERE c.username = "${data.username}"`;

  const authUserContainer = await initiateAuthUserContainer();
  const res = await authUserContainer.items
    .query({
      query,
      parameters: [],
    })
    .fetchAll();

  if (res.resources.length === 0) {
    throw new NotFoundError(`${data.username} not found.`);
  }
  const user = res.resources[0] as IAuthUser;
  const password = user.password;
  const username = user.username;
  const authGroups = user.authGroups;

  const isPasswordValid = await bcrypt.compare(data.password, password);

  if (!isPasswordValid) {
    throw new BadRequestError('Wrong password');
  }

  const dashboardsAuth = [];

  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  for (const group of authGroups) {
    const res = (await authGroupContainer.item(group.id, group.id).read())
      .resource.dashboards as AuthGroupDashboardRef;

    dashboardsAuth.push(res);
  }
  const accessToken = generateAccessToken({ userId: user.id, username });

  const refreshToken = jwt.sign(
    { userId: user.id, username },
    process.env.REFRESH_JWT_SECRET_KEY,
  );
  const authUserRes = await authUserContainer
    .item(user.id, user.username)
    .patch([{ op: 'add', path: '/refreshTokens/-', value: refreshToken }]);

  return { accessToken, refreshToken };
};

export const logout = async (data: LogoutReq): Promise<LogoutRes> => {
  const claims = getJwtClaims(data.token);
  const username = claims.username;
  const userId = claims.userId;

  const authUserContainer = await initiateAuthUserContainer();

  const res = await authUserContainer.item(userId, username).read();

  const index = res.resource.refreshTokens.findIndex((el) => el === data.token);

  if (index === -1) {
    throw new NotFoundError(
      'There is no such refresh token stored in the database',
    );
  }

  const res2 = await authUserContainer
    .item(userId, username)
    .patch([{ op: 'remove', path: `/refreshTokens/${index}` }]);

  return;
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
  if (!token) throw new BadRequestError('No token was detected in the input.');

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
