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
} from '../typescript/api';
// import { sendHttpRequest } from '../http';
// import { method } from 'lodash';
// import axios from 'axios';
import { srv } from '../server';

import { post } from './test-utils';
import { AxiosResponse } from 'axios';
import { deleteContainer } from '../cosmos-utils';
import { AUTH_USERS, loginUser } from '../service/AuthUserService';
import { AUTH_GROUPS } from '../service/AuthGroupService';

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
  const OLD_ENV = process.env;
  let token;
  const postReq = async (
    endpoint: string,
    body: Record<string, any>,
  ): Promise<AxiosResponse> => {
    const res = (await post(endpoint, body, {
      Authorization: 'Bearer ' + token,
    })) as AxiosResponse<any, any>;

    return res;
  };

  let user = {} as AuthUserCreateRes;
  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    await deleteContainer(AUTH_USERS);
    await deleteContainer(AUTH_GROUPS);

    const createBody: AuthUserCreateReq = {
      username: 'user1',
      password: 'pontusvision',
    };
    const userCreateRes = (await postReq(
      '/auth/user/create',
      createBody,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(userCreateRes.status).toBe(200);

    user = userCreateRes.data;
    const loginBody: LoginReq = {
      username: 'user1',

      password: 'pontusvision',
    };
    const LoginRes = (await postReq(
      '/login',
      loginBody,
    )) as AxiosResponse<LoginRes>;
    expect(LoginRes.status).toBe(200);

    token = LoginRes.data.accessToken;
    // await deleteDatabase('pv_db');
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    srv.close();
  });

  it('should create a user', async () => {
    const createBody: AuthUserCreateReq = {
      username: 'user2',
      password: 'pontusvision',
    };

    const userCreateRes = (await postReq(
      '/auth/user/create',
      createBody,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(userCreateRes.status).toBe(200);

    expect(userCreateRes.data.username).toBe(createBody.username);

    const readBody: AuthUserReadReq = {
      id: userCreateRes.data.id,
      username: userCreateRes.data.username,
    };

    const authGroupReadRes = (await postReq(
      '/auth/user/read',
      readBody,
    )) as AxiosResponse<AuthUserReadRes>;

    expect(authGroupReadRes.status).toBe(200);

    expect(authGroupReadRes.data).toMatchObject(userCreateRes.data);

    const updateBody: AuthUserUpdateReq = {
      id: userCreateRes.data.id,
      username: userCreateRes.data.username,
    };

    const authGroupUpdateRes = (await postReq(
      '/auth/user/update',
      updateBody,
    )) as AxiosResponse<AuthUserCreateRes>;

    expect(authGroupUpdateRes.status).toBe(200);
    expect(authGroupUpdateRes.data).toMatchObject(updateBody);
    const deleteBody: AuthUserDeleteReq = {
      id: userCreateRes.data.id,
      username: userCreateRes.data.username,
    };

    const authGroupDeleteRes = (await postReq(
      '/auth/user/delete',
      deleteBody,
    )) as AxiosResponse<AuthUserDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);

    const authGroupReadRes2 = (await postReq(
      '/auth/user/read',
      readBody,
    )) as AxiosResponse<AuthUserReadRes>;

    expect(authGroupReadRes2.status).toBe(404);
  });
  it('should read many users', async () => {
    const createBody: AuthUserCreateReq = {
      username: 'group1',
      password: 'pontusvision',
    };

    const authGroupCreateRes = (await postReq(
      'auth/user/create',
      createBody,
    )) as AxiosResponse<AuthUserCreateRes>;

    const createBody2: AuthUserCreateReq = {
      username: 'user2',
      password: 'pontusvision',
    };

    const authGroupCreateRes2 = (await postReq(
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

    const readUsers = (await postReq(
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

    const authGroupReadRes = (await postReq(
      'auth/user/read',
      readBody,
    )) as AxiosResponse<AuthUserReadRes>;
    expect(authGroupReadRes.status).toBe(404);
    const authGroupUpdateRes = (await postReq('/auth/user/update', {
      username: 'bar',
      id: 'foo',
    })) as AxiosResponse<AuthUserCreateRes>;

    expect(authGroupUpdateRes.status).toBe(404);

    const authGroupDeleteRes = (await postReq(
      '/auth/user/delete',
      readBody,
    )) as AxiosResponse<AuthUserCreateRes>;

    expect(authGroupDeleteRes.status).toBe(404);

    const readGroupsBody: AuthUsersReadReq = {
      from: 1,
      to: 20,
      filters: {
        name: {
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

    const readGroups = (await postReq(
      'auth/users/read',
      readGroupsBody,
    )) as AxiosResponse<AuthUsersReadRes>;

    expect(readGroups.status).toBe(404);
  });
  it('should create authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postReq(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: user.id,
      username: user.username,

      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupCreateRes = (await postReq(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);
  });
  it('should create INCORRECTLY authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postReq(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: user.id,
      username: user.username,
      authGroupsIds: [
        'foo',
        // authGroupCreateRes.data.id
      ],
    };

    const authUserGroupCreateRes = (await postReq(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(404);

    const createUserGroups: AuthUserGroupsCreateReq = {
      id: 'foo',
      username: 'bar',
      authGroupsIds: [
        'foo',
        // authGroupCreateRes.data.id
      ],
    };

    const authUserGroupCreateRes2 = (await postReq(
      '/auth/user/groups/create',
      createUserGroups,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes2.status).toBe(404);
  });
  it('should read authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postReq(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: user.id,
      username: user.username,
      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupCreateRes = (await postReq(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);

    const readUserGroupsBody: AuthUserGroupsReadReq = {
      id: user.id,
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

    const authUserGroupReadRes = (await postReq(
      '/auth/user/groups/read',
      readUserGroupsBody,
    )) as AxiosResponse<AuthUserGroupsReadRes>;

    expect(authUserGroupReadRes.data.authGroups[0]).toMatchObject(
      authGroupCreateRes.data,
    );
  });
  it('should read INCORRECTLY authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postReq(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: user.id,

      username: user.username,
      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupCreateRes = (await postReq(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);

    const readUserGroupsBody: AuthUserGroupsReadReq = {
      id: user.id,
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

    const authUserGroupReadRes = (await postReq(
      '/auth/user/groups/read',
      readUserGroupsBody,
    )) as AxiosResponse<AuthUserGroupsReadRes>;

    expect(authUserGroupReadRes.status).toBe(404);
  });
  it('should delete authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postReq(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: user.id,
      username: user.username,
      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupCreateRes = (await postReq(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);

    const authUserGroupDeleteBody: AuthUserGroupsDeleteReq = {
      id: user.id,
      username: user.username,
      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupDeleteRes = (await postReq(
      '/auth/user/groups/delete',
      authUserGroupDeleteBody,
    )) as AxiosResponse<AuthUserGroupsDeleteRes>;

    expect(authUserGroupDeleteRes.status).toBe(200);
  });
  it('should delete INCORRECTLY authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postReq(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const authUserGroupDeleteBody: AuthUserGroupsDeleteReq = {
      id: 'foo',
      username: 'bar',
      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupDeleteRes = (await postReq(
      '/auth/user/groups/delete',
      authUserGroupDeleteBody,
    )) as AxiosResponse<AuthUserGroupsDeleteRes>;

    expect(authUserGroupDeleteRes.status).toBe(404);
    const authUserGroupDeleteBody2: AuthUserGroupsDeleteReq = {
      id: user.id,
      username: user.username,
      authGroupsIds: ['foo'],
    };

    const authUserGroupDeleteRes2 = (await postReq(
      '/auth/user/groups/delete',
      authUserGroupDeleteBody2,
    )) as AxiosResponse<AuthUserGroupsDeleteRes>;

    expect(authUserGroupDeleteRes2.status).toBe(404);
  });
  it('should create authgroup subdocuments', async () => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postReq(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: user.id,
      username: user.username,
      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupCreateRes = (await postReq(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);

    const readGroupsBody2: AuthGroupReadReq = {
      id: authGroupCreateRes.data.id,
    };

    const readGroup2 = await postReq('auth/group/read', readGroupsBody2);

    const deleteGroupBody: AuthUserDeleteReq = {
      id: user.id,
      username: user.username,
    };

    const authGroupDeleteRes = (await postReq(
      '/auth/user/delete',
      deleteGroupBody,
    )) as AxiosResponse<AuthUserDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);

    const readGroupsBody: AuthGroupReadReq = {
      id: authGroupCreateRes.data.id,
    };

    const readGroup = await postReq('auth/group/read', readGroupsBody);

    expect(readGroup.data?.authUsers.length).toBe(0);
  });
  it('should login and authorize', async () => {
    const loginBody: LoginReq = {
      username: 'user1',

      password: 'pontusvision',
    };
    const LoginRes = (await postReq(
      '/login',
      loginBody,
    )) as AxiosResponse<LoginRes>;
    expect(LoginRes.status).toBe(200);

    const logoutBody: LogoutReq = {
      token: LoginRes.data.refreshToken,
    };
    const createGroupBody: AuthGroupCreateReq = {
      id: 'foo',
      name: 'bar',
    };

    const createGroup = await postReq('auth/group/create', createGroupBody);

    expect(createGroup.status).toBe(200);
    const LogoutRes = (await postReq(
      'logout',
      logoutBody,
    )) as AxiosResponse<LoginRes>;
    expect(LogoutRes.status).toBe(200);
  });
  it('should login incorrectly', async () => {
    const loginBody: LoginReq = {
      username: 'user1',

      password: 'foo',
    };
    const LoginRes = (await postReq(
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
  it('should check dashboard permissions incorrectly', async () => {
    const loginBody: LoginReq = {
      username: 'user1',

      password: 'foo',
    };

    const LoginRes = (await postReq(
      '/login',
      loginBody,
    )) as AxiosResponse<LoginRes>;
    expect(LoginRes.status).toBe(400);

    const createGroupBody: AuthGroupCreateReq = {
      name: 'bar',
    };

    const createGroup = (await postReq(
      'auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateReq>;

    const dashBody: DashboardCreateReq = {
      name: 'dashboard1',
    };

    const createDash = (await postReq(
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

    const createGroupDash = (await postReq(
      'auth/group/dashboard/create',
      createGroupDashBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(createGroupDash.status).toBe(200);

    const createGroupUserBody: AuthGroupUsersCreateReq = {
      id: createGroup.data.id,
      authUsers: [{ id: user.id, username: user.username }],
      name: createGroup.data.name,
    };

    const createGroupUser = (await postReq(
      'auth/group/users/create',
      createGroupUserBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(createGroupUser.status).toBe(200);

    const dashDelBody: DashboardDeleteReq = {
      id: createDash.data.id,
    };

    const delDash = (await postReq(
      'dashboard/delete',
      dashDelBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(delDash.status).toBe(200);
  });
});
