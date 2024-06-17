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
import { createTableDataEdge, deleteTableDataEdge, readTableDataEdge } from './EdgeService';
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
      rows: [{id: data.id, username: data.username}],
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
      edgeLabel: 'groups-dashboards',
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
    authGroups: res.edges as AuthUserIdAndUsername[],
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
    const permissions = res.resource.auth?.[data.authTable];

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
