import {
  AuthGroupCreateReq,
  AuthGroupRef,
  AuthUserAndGroupsRef,
  AuthUserCreateReq,
  AuthUserCreateRes,
  AuthUserDeleteReq,
  AuthUserDeleteRes,
  AuthUserGroupsCreateReq,
  AuthUserGroupsCreateRes,
  AuthUserGroupsDeleteReq,
  AuthUserGroupsDeleteRes,
  AuthUserGroupsReadReq,
  AuthUserGroupsReadRes,
  AuthUserReadReq,
  AuthUserReadRes,
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
  AuthGroupUsersCreateReq,
  AuthGroupUsersCreateRes,
} from '../../typescript/api';
// import {
//   cosmosDbName,
//   fetchContainer,
//   fetchData,
//   fetchDatabase,
// } from '../../cosmos-utils';
import { createSql, filterToQuery, generateUUIDv6, runQuery, updateSql } from '../../db-utils';

import {
  BadRequestError,
  NotFoundError,
  TemporaryRedirect,
  UnauthorizedError,
} from '../../generated/api';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  createTableDataEdge,
  readTableDataEdge,
} from './EdgeService';
import { ADMIN_GROUP_NAME, AUTH_GROUPS, AUTH_USERS, GROUPS_USERS } from '../../consts';

const createAuthGroup = async (data: AuthGroupCreateReq) => {
  let id;
  if (!data.id) {
    id = generateUUIDv6();
  } else {
    id = data.id;
  }

  const res = await runQuery(
    `CREATE TABLE IF NOT EXISTS ${AUTH_GROUPS} (id STRING, name STRING, create_table BOOLEAN , read_table BOOLEAN , update_table BOOLEAN , delete_table BOOLEAN ) USING DELTA LOCATION '/data/pv/${AUTH_GROUPS}';`,
    
  );
  const res4 = await runQuery(
    `SELECT COUNT(*) FROM ${AUTH_GROUPS} WHERE name = '${data.name}'`,
    
  );
  if (+res4[0]['count(1)'] > 0) {
    throw new ConflictEntityError(`group name: ${data.name} already taken.`);
  }

  const res2 = await runQuery(
    `INSERT INTO ${AUTH_GROUPS} (id, name, create_table , read_table , update_table , delete_table ) VALUES ("${id}", "${data.name}", false, false, false, false)`,
    
  );

  const res3 = await runQuery(
    `SELECT * FROM ${AUTH_GROUPS} WHERE id = ${
      typeof id === 'string' ? `'${id}'` : id
    }`,
    
  );

  return {
    name: res3[0]['name'],
    id,
    tableMetadata: {
      create: res3[0]['create_table'],
      read: res3[0]['read_table'],
      update: res3[0]['update_table'],
      delete: res3[0]['delete_table'],
    },
  };
};

const createAuthUserGroup = async (
  data: AuthGroupUsersCreateReq,
): Promise<AuthGroupUsersCreateRes> => {
  const { authUsers, id, name } = data;

  const res = (await createTableDataEdge({
    tableFrom: {
      tableName: AUTH_GROUPS,

      rows: data.authUsers.map(() => {
        return {
          id: data.id,
          name: data.name,
        };
      }),
      partitionKeyProp: 'name',
    },
    edge: '',
    jointTableName: GROUPS_USERS,
    edgeType: 'oneToMany',
    tableTo: {
      rows: data.authUsers.map((user) => {
        return {
          id: user.id,
          username: user.username,
        };
      }) as Record<string, any>[],
      tableName: AUTH_USERS,
    },
  })) as any;

  const authUsersRes = res.map((el) => {
    return {
      username: el['to']['table_to__username'],
      id: el['to']['table_to__id'],
    };
  });

  return {
    id: data.id,
    name: data.name,
    authUsers: authUsersRes,
    // authUsers: res.map((el) => el.to) as UsernameAndIdRef[],
  };
};

export const setup = async (): Promise<InitiateRes> => {
  try {
    const query = `SELECT * from auth_users`;

   const res = await runQuery(query);
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

    console.log({admin:data})
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
): Promise<string> => {
  const count = await runQuery(
    `SELECT count(1) FROM delta.\`/data/${table}\``,
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
  const res = (await runQuery(
    `SELECT * FROM ${AUTH_USERS} WHERE id = '${data.id}'`,
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
  const sql = await runQuery(
    `DELETE FROM ${AUTH_USERS} WHERE id = '${data.id}'`,
  );
  const affectedRows = +sql[0]['num_affected_rows'];
  if (affectedRows === 0) {
    throw new NotFoundError(`No user found at id: ${data.id}`);
  }

  try {
    const sql = await runQuery(
      `DELETE FROM ${GROUPS_USERS} WHERE table_to__id = '${data.id}'`,
    );
  } catch (error) {}
  return `User at id "${data.id}" deleted!`;
};

export const authUsersRead = async (
  data: AuthUsersReadReq,
): Promise<AuthUsersReadRes> => {
  const whereClause = filterToQuery(data);
  const sql = await runQuery(
    `SELECT * FROM ${AUTH_USERS} ${whereClause}`,
  );
  const whereClause2 = filterToQuery({ filters: data.filters });
  const sqlCount = await runQuery(
    `SELECT COUNT(*) FROM ${AUTH_USERS} ${whereClause2}`,
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

export const authUserGroupsDelete = async (
  data: AuthUserGroupsDeleteReq,
): Promise<AuthUserGroupsDeleteRes> => {
  const sqlStr = `DELETE FROM ${GROUPS_USERS} WHERE table_to__id = '${
    data.id
  }' AND ${data.authGroups
    .map((group) => `table_from__id = '${group.id}'`)
    .join(' OR ')}`;

  const sql = await runQuery(sqlStr);
  const affectedRows = +sql[0]['num_affected_rows'];

  if (affectedRows === 0) {
    throw new NotFoundError('no rows deleted.');
  }
  return '';
};

interface IAuthUser extends AuthUserAndGroupsRef {
  password: string;
}

export const checkAdmin = async (userId) => {
  const res = await runQuery(
    `SELECT COUNT(*) FROM ${GROUPS_USERS} WHERE table_from__name = 'Admin' AND table_to__id = '${userId}'`,
  );

  if (res.length === 0) {
    throw new UnauthorizedError('User does not belong to the admin group.');
  } else {
    return true;
  }
};

export const loginUser = async (data: LoginReq): Promise<LoginRes> => {
  const query = `SELECT * from auth_users WHERE username = "${data.username}"`;

  const res = await runQuery(query);

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

  const sql = await runQuery(
    `DELETE FROM refresh_token WHERE user_id = '${userId}'`,
  );

  const affectedRows = +sql[0]['num_affected_rows'];
  if (affectedRows === 0) {
    throw new NotFoundError(
      'There is no such refresh token stored in the database',
    );
  }

  return 'Token deleted.';
};



export const authenticateToken = async (
  req,
  res,
): Promise<{ username: string; userId: string }> => {
  await setup();

  const authHeader = req.headers['authorization'];
  
  const tokenArr = authHeader && authHeader?.split(' ');

  const token =  tokenArr[1]

  if (tokenArr.length !== 2) {
    throw { code: 400, message: 'wrong format of token' };
  }
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
