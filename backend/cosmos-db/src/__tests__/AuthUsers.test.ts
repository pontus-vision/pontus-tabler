import {
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
} from '../typescript/api';
// import { sendHttpRequest } from '../http';
// import { method } from 'lodash';
// import axios from 'axios';
import { srv } from '../server';

import { post } from './test-utils';
import { AxiosResponse } from 'axios';
import { deleteContainer } from '../cosmos-utils';
import { AUTH_USERS } from '../service/AuthUserService';
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

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    await deleteContainer(AUTH_USERS);
    await deleteContainer(AUTH_GROUPS);
    // await deleteDatabase('pv_db');
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    srv.close();
  });

  it('should create a user', async () => {
    const createBody: AuthUserCreateReq = {
      name: 'user1',
    };

    const userCreateRes = (await post(
      '/auth/user/create',
      createBody,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(userCreateRes.status).toBe(200);

    expect(userCreateRes.data).toMatchObject(createBody);

    const readBody: AuthUserReadReq = {
      id: userCreateRes.data.id,
    };

    const authGroupReadRes = (await post(
      '/auth/user/read',
      readBody,
    )) as AxiosResponse<AuthUserReadRes>;

    expect(authGroupReadRes.status).toBe(200);

    expect(authGroupReadRes.data).toMatchObject(userCreateRes.data);

    const updateBody: AuthUserUpdateReq = {
      id: userCreateRes.data.id,
      name: 'foo',
    };

    const authGroupUpdateRes = (await post(
      '/auth/user/update',
      updateBody,
    )) as AxiosResponse<AuthUserCreateRes>;

    expect(authGroupUpdateRes.status).toBe(200);
    expect(authGroupUpdateRes.data).toMatchObject(updateBody);
    const deleteBody: AuthUserDeleteReq = {
      id: userCreateRes.data.id,
    };

    const authGroupDeleteRes = (await post(
      '/auth/user/delete',
      deleteBody,
    )) as AxiosResponse<AuthUserDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);

    const authGroupReadRes2 = (await post(
      '/auth/user/read',
      readBody,
    )) as AxiosResponse<AuthUserReadRes>;

    expect(authGroupReadRes2.status).toBe(404);
  });
  it('should read many groups', async () => {
    const createBody: AuthUserCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await post(
      'auth/user/create',
      createBody,
    )) as AxiosResponse<AuthUserCreateRes>;

    const createBody2: AuthUserCreateReq = {
      name: 'user2',
    };

    const authGroupCreateRes2 = (await post(
      'auth/user/create',
      createBody2,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes2.data.name).toBe(createBody2.name);
    expect(authGroupCreateRes.data.name).toBe(createBody.name);

    const readGroupsBody: AuthUsersReadReq = {
      from: 1,
      to: 20,
      filters: {
        name: {
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

    const readUsers = (await post(
      'auth/users/read',
      readGroupsBody,
    )) as AxiosResponse<AuthUsersReadRes>;

    expect(readUsers.data.authUsers).toContainEqual(authGroupCreateRes.data);
    expect(readUsers.data.authUsers).toContainEqual(authGroupCreateRes2.data);
  });
  it('should do the sad path', async () => {
    const readBody: AuthUserReadReq = {
      id: 'foo',
    };

    const authGroupReadRes = (await post(
      'auth/user/read',
      readBody,
    )) as AxiosResponse<AuthUserReadRes>;
    expect(authGroupReadRes.status).toBe(404);
    const authGroupUpdateRes = (await post('/auth/user/update', {
      name: 'bar',
      id: 'foo',
    })) as AxiosResponse<AuthUserCreateRes>;

    expect(authGroupUpdateRes.status).toBe(404);

    const authGroupDeleteRes = (await post(
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

    const readGroups = (await post(
      'auth/users/read',
      readGroupsBody,
    )) as AxiosResponse<AuthUsersReadRes>;

    expect(readGroups.status).toBe(404);
  });
  it.only('should create authgroup subdocuments', async () => {
    const createUserBody: AuthUserCreateReq = {
      name: 'user1',
    };

    const userCreateRes = (await post(
      '/auth/user/create',
      createUserBody,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(userCreateRes.status).toBe(200);

    expect(userCreateRes.data).toMatchObject(createUserBody);

    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await post(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: userCreateRes.data.id,
      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupCreateRes = (await post(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);
  });
  it('should create INCORRECTLY authgroup subdocuments', async () => {
    const createUserBody: AuthUserCreateReq = {
      name: 'user1',
    };

    const userCreateRes = (await post(
      '/auth/user/create',
      createUserBody,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(userCreateRes.status).toBe(200);

    expect(userCreateRes.data).toMatchObject(createUserBody);

    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await post(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: userCreateRes.data.id,
      authGroupsIds: [
        'foo',
        // authGroupCreateRes.data.id
      ],
    };

    const authUserGroupCreateRes = (await post(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(404);

    const authUserGroupCreateRes2 = (await post('/auth/user/groups/create', {
      id: 'foo',
      authGroupsIds: [
        'foo',
        // authGroupCreateRes.data.id
      ],
    })) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes2.status).toBe(404);
  });
  it('should read authgroup subdocuments', async () => {
    const createUserBody: AuthUserCreateReq = {
      name: 'user1',
    };

    const userCreateRes = (await post(
      '/auth/user/create',
      createUserBody,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(userCreateRes.status).toBe(200);

    expect(userCreateRes.data).toMatchObject(createUserBody);

    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await post(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: userCreateRes.data.id,
      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupCreateRes = (await post(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);

    const readUserGroupsBody: AuthUserGroupsReadReq = {
      id: userCreateRes.data.id,
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

    const authUserGroupReadRes = (await post(
      '/auth/user/groups/read',
      readUserGroupsBody,
    )) as AxiosResponse<AuthUserGroupsReadRes>;

    expect(authUserGroupReadRes.data.authGroups[0]).toMatchObject(
      authGroupCreateRes.data,
    );
  });
  it('should read INCORRECTLY authgroup subdocuments', async () => {
    const createUserBody: AuthUserCreateReq = {
      name: 'user1',
    };

    const userCreateRes = (await post(
      '/auth/user/create',
      createUserBody,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(userCreateRes.status).toBe(200);

    expect(userCreateRes.data).toMatchObject(createUserBody);

    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await post(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: userCreateRes.data.id,
      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupCreateRes = (await post(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);

    const readUserGroupsBody: AuthUserGroupsReadReq = {
      id: userCreateRes.data.id,
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

    const authUserGroupReadRes = (await post(
      '/auth/user/groups/read',
      readUserGroupsBody,
    )) as AxiosResponse<AuthUserGroupsReadRes>;

    expect(authUserGroupReadRes.status).toBe(404);
  });
  it('should delete authgroup subdocuments', async () => {
    const createUserBody: AuthUserCreateReq = {
      name: 'user1',
    };

    const userCreateRes = (await post(
      '/auth/user/create',
      createUserBody,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(userCreateRes.status).toBe(200);

    expect(userCreateRes.data).toMatchObject(createUserBody);

    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await post(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: userCreateRes.data.id,
      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupCreateRes = (await post(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);

    const authUserGroupDeleteBody: AuthUserGroupsDeleteReq = {
      id: userCreateRes.data.id,
      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupDeleteRes = (await post(
      '/auth/user/groups/delete',
      authUserGroupDeleteBody,
    )) as AxiosResponse<AuthUserGroupsDeleteRes>;

    expect(authUserGroupDeleteRes.status).toBe(200);
  });
  it('should delete INCORRECTLY authgroup subdocuments', async () => {
    const createUserBody: AuthUserCreateReq = {
      name: 'user1',
    };

    const userCreateRes = (await post(
      '/auth/user/create',
      createUserBody,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(userCreateRes.status).toBe(200);

    expect(userCreateRes.data).toMatchObject(createUserBody);

    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await post(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const authUserGroupDeleteBody: AuthUserGroupsDeleteReq = {
      id: 'foo',
      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupDeleteRes = (await post(
      '/auth/user/groups/delete',
      authUserGroupDeleteBody,
    )) as AxiosResponse<AuthUserGroupsDeleteRes>;

    expect(authUserGroupDeleteRes.status).toBe(404);
    const authUserGroupDeleteBody2: AuthUserGroupsDeleteReq = {
      id: userCreateRes.data.id,
      authGroupsIds: ['foo'],
    };

    const authUserGroupDeleteRes2 = (await post(
      '/auth/user/groups/delete',
      authUserGroupDeleteBody2,
    )) as AxiosResponse<AuthUserGroupsDeleteRes>;

    expect(authUserGroupDeleteRes2.status).toBe(404);
  });
  it('should create authgroup subdocuments', async () => {
    const createUserBody: AuthUserCreateReq = {
      name: 'user1',
    };

    const userCreateRes = (await post(
      '/auth/user/create',
      createUserBody,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(userCreateRes.status).toBe(200);

    expect(userCreateRes.data).toMatchObject(createUserBody);

    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await post(
      '/auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createGroupBody);

    const createUserGroupBody: AuthUserGroupsCreateReq = {
      id: userCreateRes.data.id,
      authGroupsIds: [authGroupCreateRes.data.id],
    };

    const authUserGroupCreateRes = (await post(
      '/auth/user/groups/create',
      createUserGroupBody,
    )) as AxiosResponse<AuthUserGroupsCreateRes>;

    expect(authUserGroupCreateRes.status).toBe(200);

    const readGroupsBody2: AuthGroupReadReq = {
      id: authGroupCreateRes.data.id,
    };

    const readGroup2 = await post('auth/group/read', readGroupsBody2);

    const deleteGroupBody: AuthUserDeleteReq = {
      id: userCreateRes.data.id,
    };

    const authGroupDeleteRes = (await post(
      '/auth/user/delete',
      deleteGroupBody,
    )) as AxiosResponse<AuthUserDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);

    const readGroupsBody: AuthGroupReadReq = {
      id: authGroupCreateRes.data.id,
    };

    const readGroup = await post('auth/group/read', readGroupsBody);

    expect(readGroup.data?.authUsers.length).toBe(0);
  });
});
