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
  LoginReq,
  LoginRes,
  LogoutReq,
  LogoutRes,
  NameAndIdRef,
  TokenReq,
  TokenRes,
} from '../typescript/api';
import { fetchContainer, fetchData, filterToQuery } from '../cosmos-utils';
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
} from '../generated/api';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { ADMIN, initiateAuthGroupContainer } from './AuthGroupService';
import {
  createTableDataEdge,
  deleteTableDataEdge,
  readTableDataEdge,
} from './EdgeService';
import { DASHBOARDS } from './DashboardService';
dotenv.config();
export const AUTH_USERS = 'auth_users';
export const AUTH_GROUPS = 'auth_groups';

const partitionKey: string | PartitionKeyDefinition = {
  paths: ['/username'],
};

const uniqueKeyPolicy: UniqueKeyPolicy = {
  uniqueKeys: [{ paths: ['/username'] }],
};

const initialDocs: AuthUserCreateReq[] = [
  {
    username: 'ADMIN',
    password: 'admin',
  },
  {
    username: 'USER',
    password: 'user',
  },
];

export const initiateAuthUserContainer = async (): Promise<Container> => {
  for (const doc of initialDocs) {
    const hashedPassword = await bcrypt.hash(doc.password, 10);
    doc.password = hashedPassword;
  }

  const authUserContainer = await fetchContainer(
    AUTH_USERS,
    partitionKey,
    uniqueKeyPolicy,
    initialDocs,
  );

  return authUserContainer;
};

export const authUserCreate = async (
  data: AuthUserCreateReq,
): Promise<AuthUserCreateRes> => {
  if (data.password.length < 6) {
    throw new BadRequestError('Please, insert at least 6 characters.');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const authUserContainer = await initiateAuthUserContainer();

  const res = await authUserContainer.items.create({
    ...data,
    password: hashedPassword,
    authGroups: [],
    refreshTokens: [],
  });

  const { id, username } = res.resource;

  return {
    username,
    id,
  };
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
      rows: data.authGroups,
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
  const res = await readTableDataEdge({
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
  });

  if (res.count === 0) {
    throw new NotFoundError('No group auth found.');
  }
  return {
    count: res.count,
    authGroups: res.edges as NameAndIdRef[],
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

  if (userGroups.some((el) => el.name === ADMIN)) {
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

  return 'Token removed';
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

export const authenticateToken = (req, res) => {
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

//export const checkUserDashPermissions = async (data: {
//  userId: string;
//  username: string;
//  dashboardId: string;
//}): Promise<{
//  create: boolean;
//  read: boolean;
//  update: boolean;
//  delete: boolean;
//}> => {
//  const authUserContainer = await initiateAuthUserContainer();
//  const authGroupContainer = await fetchContainer(AUTH_GROUPS);
//
//  const user = await authUserContainer.item(data.userId, data.username).read();
//
//  const userGroups = user.resource.authGroups as AuthUserAndGroupsRef[];
//
//  const userGroupsFiltered = [];
//
//  for (const group of userGroups) {
//    const res = (await authGroupContainer
//      .item(group.id, group.id)
//      .read()) as ItemResponse<AuthGroupRef>;
//    const dashboards = res.resource.tableMetadata;
//
//    const index = dashboards.findIndex((el) => el.id === data.dashboardId);
//
//    if (index !== -1) {
//      userGroupsFiltered.push(dashboards[index]);
//    }
//  }
//
//  if (userGroupsFiltered.length === 0) {
//    throw new NotFoundError('Dashboard id not found');
//  }
//
//  let create = false;
//  let read = false;
//  let update = false;
//  let del = false;
//
//  userGroupsFiltered.forEach((el) => {
//    if (el.create) {
//      create = el.create;
//    }
//    if (el.read) {
//      read = el.read;
//    }
//    if (el.update) {
//      update = el.update;
//    }
//    if (el.delete) {
//      del = el.delete;
//    }
//  });
//
//  return {
//    create,
//    read,
//    update,
//    delete: del,
//  };
//};

// const checkUserPermissions = async (data: {
//   id: string;

//   docs: {
//     docs1: Record<string, any>[];
//     ommitPropsInContainer2?: string[];
//   };

//   container1: { container: Container; name: string };
//   container2: { container: Container; name: string; partitionKeyProp?: string };
//   partitionKey?: string;
// }) => {
//   const authUserContainer = await initiateAuthUserContainer();
//   const authGroupContainer = await initiateAuthUserContainer();

//   const user = await data.container1.container.item(data.id, data.partitionKey).read();

//   const userGroups = user.resource.authGroups as AuthGroupRef[];

//   if (userGroups.some((el) => el.name === ADMIN)) {
//     return {
//       create: true,
//       read: true,
//       update: true,
//       delete: true,
//     };
//   }

//   const userGroupsFiltered = [];

//   for (const group of userGroups) {
//     const res = (await data.container2.container
//       .item(group.id, group[data.container2.partitionKeyProp] || group.id)
//       .read()) as ItemResponse<AuthGroupRef>;
//     const dashboards = res.resource.dashboards;

//     const index = dashboards.findIndex((el) => el.id === data.dashboardId);

//     if (index !== -1) {
//       userGroupsFiltered.push(dashboards[index]);
//     }
//   }

//   if (userGroupsFiltered.length === 0) {
//     throw new NotFoundError('Dashboard id not found');
//   }

//   let create = false;
//   let read = false;
//   let update = false;
//   let del = false;

//   userGroupsFiltered.forEach((el) => {
//     if (el.create) {
//       create = el.create;
//     }
//     if (el.read) {
//       read = el.read;
//     }
//     if (el.update) {
//       update = el.update;
//     }
//     if (el.delete) {
//       del = el.delete;
//     }
//   });

//   return {
//     create,
//     read,
//     update,
//     delete: del,
//   };

// };
