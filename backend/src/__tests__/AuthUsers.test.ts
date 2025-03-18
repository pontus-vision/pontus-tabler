import {
  AuthUserRef,
  AuthUserCreateReq,
  AuthUserUpdateReq,
  AuthUserCreateRes,
  AuthUserReadRes,
  AuthUserReadReq,
  AuthUserDeleteReq,
  AuthUserDeleteRes,
  AuthUsersReadReq,
  AuthUsersReadRes,
  AuthUserGroupsCreateReq,
  AuthGroupCreateReq,
  AuthGroupCreateRes,
  AuthUserGroupsCreateRes,
  AuthUserGroupsReadRes,
  AuthUserGroupsReadReq,
  AuthUserGroupsDeleteRes,
  AuthUserGroupsDeleteReq,
  AuthGroupsReadRes,
  AuthGroupsReadReq,
  AuthGroupReadReq,
  AuthGroupReadRes,
  LoginReq,
  LoginRes,
  DashboardReadReq,
  DashboardCreateReq,
  DashboardCreateRes,
  AuthGroupUsersCreateReq,
  AuthGroupUsersCreateRes,
  LogoutReq,
  AuthGroupDashboardCreateReq,
  AuthGroupDashboardCreateRes,
  DashboardDeleteReq,
  RegisterAdminRes,
  RegisterAdminReq,
  AuthGroupUsersReadReq,
  RegisterUserReq,
} from '../typescript/api';
// import { sendHttpRequest } from '../http';
// import { method } from 'lodash';
// import axios from 'axios';
import { srv } from '../server';

import { prepareDbAndAuth, post } from './test-utils';
import { AxiosResponse } from 'axios';
import { AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES, DELTA_DB, GROUPS_DASHBOARDS, GROUPS_USERS } from '../consts';

// // Mock the utils.writeJson function
// jest.mock('../utils/writer', () => ({
//   writeJson: jest.fn(),
// }));

// // Mock the Default service functions
// jest.mock('../service/DefaultService', () => ({
//   dashboardUpdatePOST: jest.fn(),
//   dashboardsReadPOST: jest.fn(),
// }));
jest.setTimeout(1000000);

describe('dashboardCreatePOST', () => {
  let adminToken;
  const OLD_ENV = process.env;
  let admin = {} as AuthUserCreateRes;
  let postAdmin;
  beforeEach(async () => {
    let tables = [AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES];
    if (process.env.DB_SOURCE === DELTA_DB) {
      tables = [...tables, GROUPS_DASHBOARDS, 'person_natural', GROUPS_USERS];
    }
    const dbUtils = await prepareDbAndAuth(tables);
    postAdmin = dbUtils.postAdmin;
    admin = dbUtils.admin;
    adminToken = dbUtils.adminToken;
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });
  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    srv.close();
  });

  it('should create a user', async () => {

    const createBody: AuthUserCreateReq = {
      username: 'user2',
      password: 'pontusvision',
      passwordConfirmation: 'pontusvision',
    };

    const userCreateRes = (await postAdmin(
      '/auth/user/create',
      createBody,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(userCreateRes.status).toBe(200);

    expect(userCreateRes.data.username).toBe(createBody.username);

    const readBody: AuthUserReadReq = {
      id: userCreateRes.data.id,
      username: userCreateRes.data.username,
    };

    const authGroupReadRes = (await postAdmin(
      '/auth/user/read',
      readBody,
    )) as AxiosResponse<AuthUserReadRes>;

    expect(authGroupReadRes.status).toBe(200);

    expect(authGroupReadRes.data).toMatchObject(userCreateRes.data);

    const updateBody: AuthUserUpdateReq = {
      id: userCreateRes.data.id,
      username: userCreateRes.data.username,
    };

    const authGroupUpdateRes = (await postAdmin(
      '/auth/user/update',
      updateBody,
    )) as AxiosResponse<AuthUserCreateRes>;

    expect(authGroupUpdateRes.status).toBe(200);
    expect(authGroupUpdateRes.data).toMatchObject(updateBody);
    const deleteBody: AuthUserDeleteReq = {
      id: userCreateRes.data.id,
      username: userCreateRes.data.username,
    };

    const authGroupDeleteRes = (await postAdmin(
      '/auth/user/delete',
      deleteBody,
    )) as AxiosResponse<AuthUserDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);

    const authGroupReadRes2 = (await postAdmin(
      '/auth/user/read',
      readBody,
    )) as AxiosResponse<AuthUserReadRes>;

    expect(authGroupReadRes2.status).toBe(404);
  });
  it('should read many users', async () => {
    const createBody: AuthUserCreateReq = {
      username: 'group1',
      password: 'pontusvision',
      passwordConfirmation: 'pontusvision',
    };

    const authGroupCreateRes = (await postAdmin(
      'auth/user/create',
      createBody,
    )) as AxiosResponse<AuthUserCreateRes>;

    const createBody2: AuthUserCreateReq = {
      username: 'user2',
      password: 'pontusvision',
      passwordConfirmation: 'pontusvision',
    };

    const authGroupCreateRes2 = (await postAdmin(
      'auth/user/create',
      createBody2,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes2.data.username).toBe(createBody2.username);
    expect(authGroupCreateRes.data.username).toBe(createBody.username);

    const readGroupsBody: AuthUsersReadReq = {
      from: 1,
      to: 20,
      filters: {
        username: {
          condition1: {
            filter: 'user2',
            filterType: 'text',
            type: 'contains',
          },
          operator: 'OR',
          filterType: 'text',
          condition2: {
            filter: 'group1',
            filterType: 'text',
            type: 'contains',
          },
        },
      },
    };

    const readUsers = (await postAdmin(
      'auth/users/read',
      readGroupsBody,
    )) as AxiosResponse<AuthUsersReadRes>;

    expect(readUsers.data.authUsers).toContainEqual(authGroupCreateRes.data);
    expect(readUsers.data.authUsers).toContainEqual(authGroupCreateRes2.data);
  });
  it('should do the sad path', async () => {
    const readBody: AuthUserReadReq = {
      id: 'foo',
      username: 'bar',
    };

    const authGroupReadRes = (await postAdmin(
      'auth/user/read',
      readBody,
    )) as AxiosResponse<AuthUserReadRes>;
    expect(authGroupReadRes.status).toBe(404);
    const authGroupUpdateRes = (await postAdmin('/auth/user/update', {
      username: 'bar',
      id: 'foo',
    })) as AxiosResponse<AuthUserCreateRes>;

    expect(authGroupUpdateRes.status).toBe(404);

    const authGroupDeleteRes = (await postAdmin(
      '/auth/user/delete',
      readBody,
    )) as AxiosResponse<AuthUserCreateRes>;

    expect(authGroupDeleteRes.status).toBe(404);

    const readGroupsBody: AuthUsersReadReq = {
      from: 1,
      to: 20,
      filters: {
        username: {
          condition1: {
            filter: 'foo',
            filterType: 'text',
            type: 'contains',
          },
          operator: 'AND',
          filterType: 'text',
          condition2: {
            filter: 'bar',
            filterType: 'text',
            type: 'contains',
          },
        },
      },
    };

    const readGroups = (await postAdmin(
      'auth/users/read',
      readGroupsBody,
    )) as AxiosResponse<AuthUsersReadRes>;

    expect(readGroups.status).toBe(404);
  });
  it('should create authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postAdmin(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: admin.id,
      username: admin.username,

      authGroups: [
        { id: authGroupCreateRes.data.id, name: authGroupCreateRes.data.name },
      ],
    };

    const authUserGroupCreateRes = (await postAdmin(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);
  });
  it('should create INCORRECTLY authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postAdmin(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroups: AuthUserGroupsCreateReq = {
      id: 'foo',
      username: 'bar',
      authGroups: [
        { id: authGroupCreateRes.data.id, name: authGroupCreateRes.data.name },
        // authGroupCreateRes.data.id
      ],
    };

    const authUserGroupCreateRes2 = (await postAdmin(
      '/auth/user/groups/create',
      createUserGroups,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes2.status).toBe(404);
  });
  it('should read authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postAdmin(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: admin.id,
      username: admin.username,
      authGroups: [
        { id: authGroupCreateRes.data.id, name: authGroupCreateRes.data.name },
      ],
    };

    const authUserGroupCreateRes = (await postAdmin(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);

    const readUserGroupsBody: AuthUserGroupsReadReq = {
      id: admin.id,
      filters: {
        name: {
          filter: 'group',
          filterType: 'text',
          type: 'contains',
        },
      },
      from: 1,
      to: 20,
    };

    const authUserGroupReadRes = (await postAdmin(
      '/auth/user/groups/read',
      readUserGroupsBody,
    )) as AxiosResponse<AuthUserGroupsReadRes>;

    expect(authUserGroupReadRes.data.authGroups[0]).toMatchObject({
      name: authGroupCreateRes.data.name,
      id: authGroupCreateRes.data.id,
    });
  });
  it('should read INCORRECTLY authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postAdmin(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: admin.id,

      username: admin.username,
      authGroups: [
        { id: authGroupCreateRes.data.id, name: authGroupCreateRes.data.name },
      ],
    };

    const authUserGroupCreateRes = (await postAdmin(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);

    const readUserGroupsBody: AuthUserGroupsReadReq = {
      id: admin.id,
      filters: {
        name: {
          filter: 'foo',
          filterType: 'text',
          type: 'contains',
        },
      },
      from: 1,
      to: 20,
    };

    const authUserGroupReadRes = (await postAdmin(
      '/auth/user/groups/read',
      readUserGroupsBody,
    )) as AxiosResponse<AuthUserGroupsReadRes>;

    expect(authUserGroupReadRes.status).toBe(404);
  });
  it('should delete authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postAdmin(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: admin.id,
      username: admin.username,
      authGroups: [
        { id: authGroupCreateRes.data.id, name: authGroupCreateRes.data.name },
      ],
    };

    const authUserGroupCreateRes = (await postAdmin(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);

    const authUserGroupDeleteBody: AuthUserGroupsDeleteReq = {
      id: admin.id,
      username: admin.username,
      authGroups: [
        { id: authGroupCreateRes.data.id, name: authGroupCreateRes.data.name },
      ],
    };

    const authUserGroupDeleteRes = (await postAdmin(
      '/auth/user/groups/delete',
      authUserGroupDeleteBody,
    )) as AxiosResponse<AuthUserGroupsDeleteRes>;

    expect(authUserGroupDeleteRes.status).toBe(200);
  });
  it('should delete INCORRECTLY authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postAdmin(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const authUserGroupDeleteBody: AuthUserGroupsDeleteReq = {
      id: 'foo',
      username: 'bar',
      authGroups: [
        { id: authGroupCreateRes.data.id, name: authGroupCreateRes.data.name },
      ],
    };

    const authUserGroupDeleteRes = (await postAdmin(
      '/auth/user/groups/delete',
      authUserGroupDeleteBody,
    )) as AxiosResponse<AuthUserGroupsDeleteRes>;

    expect(authUserGroupDeleteRes.status).toBe(404);
    const authUserGroupDeleteBody2: AuthUserGroupsDeleteReq = {
      id: admin.id,
      username: admin.username,
      authGroups: [
        { id: authGroupCreateRes.data.id, name: authGroupCreateRes.data.name },
      ],
    };

    const authUserGroupDeleteRes2 = (await postAdmin(
      '/auth/user/groups/delete',
      authUserGroupDeleteBody2,
    )) as AxiosResponse<AuthUserGroupsDeleteRes>;

    expect(authUserGroupDeleteRes2.status).toBe(404);
  });
  it('should create authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postAdmin(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const newAuthUser: AuthUserCreateReq = {
      username: 'User 1',
      password: '1234567',
      passwordConfirmation: '1234567'
    }

    const authUserCreateRes = await postAdmin('/auth/user/create', newAuthUser) as AxiosResponse<AuthUserCreateRes>

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: authUserCreateRes.data.id,
      username: authUserCreateRes.data.username,
      authGroups: [
        { id: authGroupCreateRes.data.id, name: authGroupCreateRes.data.name },
      ],
    };

    const authUserGroupCreateRes = (await postAdmin(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);

    const readGroupsBody2: AuthGroupReadReq = {
      id: authGroupCreateRes.data.id,
      name: authGroupCreateRes.data.name,
    };

    const readGroup2 = await postAdmin('auth/group/read', readGroupsBody2);

    const deleteGroupBody: AuthUserDeleteReq = {
      id: authUserCreateRes.data.id,
      username: authUserCreateRes.data.username,
    };

    const authGroupDeleteRes = (await postAdmin(
      '/auth/user/delete',
      deleteGroupBody,
    )) as AxiosResponse<AuthUserDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);

    const readGroupsBody: AuthGroupUsersReadReq = {
      id: authGroupCreateRes.data.id,
      // name: authGroupCreateRes.data.name,
      filters: {},
    };

    const readGroupUsers = await postAdmin(
      'auth/group/users/read',
      readGroupsBody,
    );

    expect(readGroupUsers.status).toBe(404);
  });
  it('should login and authorize', async () => {
    const logoutBody: LogoutReq = {
      token: adminToken,
    };

    const createGroupBody: AuthGroupCreateReq = {
      id: 'foo',
      name: 'bar',
    };

    const createGroup = await postAdmin('auth/group/create', createGroupBody);

    expect(createGroup.status).toBe(200);
    const LogoutRes = (await postAdmin(
      'logout',
      logoutBody,
    )) as AxiosResponse<LoginRes>;
    expect(LogoutRes.status).toBe(200);
  });
  it('should login incorrectly', async () => {
    const loginBody: LoginReq = {
      username: admin.username,

      password: 'foo',
    };
    const LoginRes = (await postAdmin(
      '/login',
      loginBody,
    )) as AxiosResponse<LoginRes>;
    expect(LoginRes.status).toBe(400);

    const createGroupBody: AuthGroupCreateReq = {
      id: 'foo',
      name: 'bar',
    };

    const createGroup = await post('auth/group/create', createGroupBody, {
      Authorization: 'foo',
    });

    expect(createGroup.status).toBe(400);
  });
  it('should check dashboard permissions ', async () => {
    const loginBody: LoginReq = {
      username: admin.username,

      password: 'foo',
    };

    const LoginRes = (await postAdmin(
      '/login',
      loginBody,
    )) as AxiosResponse<LoginRes>;
    expect(LoginRes.status).toBe(400);

    const createGroupBody: AuthGroupCreateReq = {
      name: 'bar',
    };

    const createGroup = (await postAdmin(
      'auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateReq>;

    const dashBody: DashboardCreateReq = {
      name: 'dashboard1',
    };

    const createDash = (await postAdmin(
      'dashboard/create',
      dashBody,
    )) as AxiosResponse<DashboardCreateRes>;

    expect(createDash.status).toBe(200);
    const createGroupDashBody: AuthGroupDashboardCreateReq = {
      id: createGroup.data.id,
      name: createGroup.data.name,
      dashboards: [
        {
          delete: true,
          create: false,
          read: false,
          update: false,
          name: createDash.data.name,
          id: createDash.data.id,
        },
      ],
    };

    const createGroupDash = (await postAdmin(
      'auth/group/dashboard/create',
      createGroupDashBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(createGroupDash.status).toBe(200);

    const createGroupUserBody: AuthGroupUsersCreateReq = {
      id: createGroup.data.id,
      authUsers: [{ id: admin.id, username: admin.username }],
      name: createGroup.data.name,
    };

    const createGroupUser = (await postAdmin(
      'auth/group/users/create',
      createGroupUserBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(createGroupUser.status).toBe(200);

    const dashDelBody: DashboardDeleteReq = {
      id: createDash.data.id,
    };

    const delDash = (await postAdmin(
      'dashboard/delete',
      dashDelBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(delDash.status).toBe(200);
  });
  it('should check dashboard permissions from regular User', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'bar',
    };
    const createGroup = (await postAdmin(
      'auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateReq>;

    const dashBody: DashboardCreateReq = {
      name: 'dashboard1',
    };

    const createDash = (await postAdmin(
      'dashboard/create',
      dashBody,
    )) as AxiosResponse<DashboardCreateRes>;

    expect(createDash.status).toBe(200);

    const createGroupDashBody: AuthGroupDashboardCreateReq = {
      id: createGroup.data.id,
      name: createGroup.data.name,
      dashboards: [
        {
          delete: true,
          create: false,
          read: false,
          update: false,
          name: createDash.data.name,
          id: createDash.data.id,
        },
      ],
    };

    const createGroupDash = (await postAdmin(
      'auth/group/dashboard/create',
      createGroupDashBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(createGroupDash.status).toBe(200);

    const createUserBody: RegisterUserReq = {
      username: 'user1',
      password: 'pontusvision',
      passwordConfirmation: 'pontusvision',
    };

    const userCreateRes = (await post(
      '/register/user',
      createUserBody,
    )) as AxiosResponse<RegisterAdminRes>;

    expect(userCreateRes.status).toBe(200);

    const authUserRead: AuthUserReadReq = {
      username: createUserBody.username,
      id: userCreateRes.data.id
    }

    const userReadRes = await postAdmin('/auth/user/read', authUserRead) as AxiosResponse<AuthUserReadRes>

    expect(userReadRes.status).toBe(200)

    admin = userCreateRes.data;

    const loginUserBody: LoginReq = {
      username: 'user1',
      password: 'pontusvision',
    };

    const user = userCreateRes.data;

    const createGroupUserBody: AuthGroupUsersCreateReq = {
      id: createGroup.data.id,
      authUsers: [{ id: user.id, username: user.username }],
      name: createGroup.data.name,
    };

    const createGroupUser = (await postAdmin(
      'auth/group/users/create',
      createGroupUserBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(createGroupUser.status).toBe(200);

    const logoutBody: LogoutReq = {
      token: adminToken,
    };

    const LogoutRes = (await postAdmin(
      'logout',
      logoutBody,
    )) as AxiosResponse<LoginRes>;
    expect(LogoutRes.status).toBe(200);

    const LoginUserRes = (await post(
      '/login',
      loginUserBody,
    )) as AxiosResponse<LoginRes>;

    expect(LoginUserRes.status).toBe(200);

    const token = LoginUserRes.data.accessToken;

    onsole.log({ token })

    const dashDelBody: DashboardDeleteReq = {
      id: createDash.data.id,
    };

    const delDash = (await post('dashboard/delete', dashDelBody, {
      Authorization: 'Bearer ' + token,
    })) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(delDash.status).toBe(200);

    const readDash = (await post('dashboard/read', dashDelBody, {
      Authorization: 'Bearer ' + token,
    })) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(readDash.status).toBe(401);
  });
});
