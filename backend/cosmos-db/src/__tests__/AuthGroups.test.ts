import {
  DashboardCreateReq,
  DashboardCreateRes,
  DashboardReadRes,
  DashboardRef,
  DashboardUpdateRes,
  DashboardUpdateReq,
  DashboardReadReq,
  DashboardGroupAuthReadRes,
  DashboardGroupAuthReadReq,
  DashboardGroupAuthCreateRes,
  DashboardGroupAuthUpdateReq,
  DashboardGroupAuthUpdateRes,
  DashboardGroupAuthDeleteReq,
  DashboardGroupAuthDeleteRes,
  AuthGroupCreateReq,
  AuthGroupUpdateReq,
  AuthGroupCreateRes,
  AuthGroupReadRes,
  AuthGroupReadReq,
  AuthGroupDeleteReq,
  AuthGroupDeleteRes,
  AuthGroupsReadReq,
  AuthGroupsReadRes,
  AuthGroupDashboardCreateReq,
  AuthGroupDashboardCreateRes,
  AuthGroupDashboardUpdateReq,
  AuthGroupDashboardDeleteReq,
  AuthGroupDashboardsReadReq,
  AuthGroupDashboardsReadRes,
  AuthGroupDashboardUpdateRes,
  AuthUserGroupsCreateReq,
  AuthGroupUsersCreateReq,
  AuthGroupUsersCreateRes,
  AuthGroupUsersReadReq,
  AuthGroupUsersReadRes,
  AuthGroupUsersUpdateReq,
  AuthGroupUsersUpdateRes,
  AuthGroupUsersDeleteReq,
  AuthUserCreateRes,
  AuthUserCreateReq,
  AuthUserGroupsCreateRes,
  TableCreateReq,
  TableCreateRes,
  AuthGroupTablesCreateRes,
  AuthGroupTablesCreateReq,
  AuthGroupTablesReadReq,
  AuthGroupTablesReadRes,
  AuthGroupTablesDeleteReq,
  AuthGroupTablesDeleteRes,
  AuthGroupDashboardDeleteRes,
  LoginReq,
  LoginRes,
  AuthGroupTableCreateReq,
} from '../typescript/api';
// import { sendHttpRequest } from '../http';
// import { method } from 'lodash';
// import axios from 'axios';
import { srv } from '../server';

import { post, stateObj } from './test-utils';
import { DashboardGroupAuthCreateReq } from '../generated/api';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { deleteContainer, deleteDatabase } from '../cosmos-utils';
import { AUTH_GROUPS, createAuthGroup } from '../service/AuthGroupService';
import { DASHBOARDS } from '../service/DashboardService';
import { AUTH_USERS } from '../service/AuthUserService';
import { TABLES } from '../service/TableService';

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
    await deleteContainer(AUTH_GROUPS);
    await deleteContainer(DASHBOARDS);
    await deleteContainer(AUTH_USERS);
    await deleteContainer(TABLES);

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
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    srv.close();
  });

  it('should create a group', async () => {
    const createBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postReq(
      '/auth/group/create',
      createBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createBody);

    const readBody: AuthGroupReadReq = {
      id: authGroupCreateRes.data.id,
      name: authGroupCreateRes.data.name,
    };

    const authGroupReadRes = (await postReq(
      '/auth/group/read',
      readBody,
    )) as AxiosResponse<AuthGroupReadRes>;

    expect(authGroupReadRes.status).toBe(200);

    expect(authGroupReadRes.data).toMatchObject(authGroupCreateRes.data);

    const deleteBody: AuthGroupDeleteReq = {
      id: authGroupCreateRes.data.id,

      name: authGroupCreateRes.data.name,
    };

    const authGroupDeleteRes = (await postReq(
      '/auth/group/delete',
      deleteBody,
    )) as AxiosResponse<AuthGroupDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);
  });
  it('should read many groups', async () => {
    const createBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postReq(
      'auth/group/create',
      createBody,
    )) as AxiosResponse<AuthGroupCreateRes>;

    const createBody2: AuthGroupCreateReq = {
      name: 'group2',
    };

    const authGroupCreateRes2 = (await postReq(
      'auth/group/create',
      createBody2,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createBody);

    const readGroupsBody: AuthGroupsReadReq = {
      from: 1,
      to: 20,
      filters: {
        name: {
          condition1: {
            filter: 'group1',
            filterType: 'text',
            type: 'contains',
          },
          operator: 'OR',
          filterType: 'text',
          condition2: {
            filter: 'group2',
            filterType: 'text',
            type: 'contains',
          },
        },
      },
    };

    const readGroups = (await postReq(
      'auth/groups/read',
      readGroupsBody,
    )) as AxiosResponse<AuthGroupsReadRes>;

    expect(readGroups.data.authGroups[0]).toMatchObject(
      authGroupCreateRes.data,
    );
    expect(readGroups.data.authGroups[1]).toMatchObject(
      authGroupCreateRes2.data,
    );
  });
  it('should do the sad path', async () => {
    const readBody: AuthGroupReadReq = {
      id: 'foo',

      name: 'bar',
    };

    const authGroupReadRes = (await postReq(
      'auth/group/read',
      readBody,
    )) as AxiosResponse<AuthGroupReadRes>;
    expect(authGroupReadRes.status).toBe(404);

    const authGroupDeleteRes = (await postReq(
      '/auth/group/delete',
      readBody,
    )) as AxiosResponse<AuthGroupCreateRes>;

    expect(authGroupDeleteRes.status).toBe(404);

    const createBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postReq(
      '/auth/group/create',
      createBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    const authGroupCreateRes2 = (await postReq('/auth/group/create', {
      id: authGroupCreateRes.data.id,
      ...createBody,
    })) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes2.status).toBe(409);

    const readGroupsBody: AuthGroupsReadReq = {
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
      'auth/groups/read',
      readGroupsBody,
    )) as AxiosResponse<AuthGroupsReadRes>;

    expect(readGroups.status).toBe(404);

    const updateBody: AuthGroupDashboardUpdateReq = {
      dashboards: [
        {
          create: true,
          delete: true,
          read: true,
          update: true,
          id: 'foo',
          name: 'f',
        },
      ],
      id: 'foo',
      name: authGroupCreateRes.data.name,
    };

    const updateRetVal = (await postReq(
      'auth/group/dashboard/update',
      updateBody,
    )) as AxiosResponse<DashboardGroupAuthUpdateRes>;

    expect(updateRetVal.status).toBe(404);

    const deleteBody: AuthGroupDashboardDeleteReq = {
      dashboardIds: [],
      id: 'foo',
      name: 'bar',
    };
    const deleteRetVal = (await postReq(
      'auth/group/dashboard/delete',
      deleteBody,
    )) as AxiosResponse<DashboardGroupAuthDeleteRes>;

    expect(deleteRetVal.status).toBe(400);

    const deleteBody2: AuthGroupDashboardDeleteReq = {
      dashboardIds: ['foo', 'bar'],
      name: authGroupCreateRes.data.name,

      id: authGroupCreateRes.data.id,
    };

    const delete2RetVal = (await postReq(
      'auth/group/dashboard/delete',
      deleteBody2,
    )) as AxiosResponse<AuthGroupDashboardDeleteRes>;
    expect(delete2RetVal.status).toBe(404);
  });
  it('should create dashboards subdocuments', async () => {
    const body: DashboardCreateReq = {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: {},
    };

    const createRetVal = (await postReq(
      'dashboard/create',
      body,
    )) as AxiosResponse<DashboardCreateRes>;

    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postReq(
      'auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;

    const authGroupId = authGroupCreateRes.data.id;

    const createBody: AuthGroupDashboardCreateReq = {
      dashboards: [
        {
          name: createRetVal.data.name,
          id: createRetVal.data.id,
          create: false,
          delete: true,
          read: false,
          update: true,
        },
      ],
      id: authGroupId,
      name: authGroupCreateRes.data.name,
    };

    const groupDashCreateRes = (await postReq(
      'auth/group/dashboard/create',
      createBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(groupDashCreateRes.status).toBe(200);

    expect(groupDashCreateRes.data.dashboards).toMatchObject(
      createBody.dashboards,
    );

    expect(groupDashCreateRes.data.dashboards).toMatchObject(
      createBody.dashboards,
    );

    const readBody: DashboardGroupAuthReadReq = {
      id: createRetVal.data.id,
      filters: {
        // name: {
        //   condition1: {
        //     filter: 'group1',
        //     filterType: 'text',
        //     type: 'contains',
        //   },
        //   filterType: 'text',
        // },
      },
    };

    const readRetVal = (await postReq(
      'dashboard/group/auth/read',
      readBody,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;

    expect(readRetVal.data.authGroups[0]).toMatchObject({
      name: authGroupCreateRes.data.name,
      id: authGroupCreateRes.data.id,
      create: false,
      delete: true,
      read: false,
      update: true,
    });
  });
  it('should update dashboards subdocuments', async () => {
    const body: DashboardCreateReq = {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: {},
    };

    const createRetVal = (await postReq(
      'dashboard/create',
      body,
    )) as AxiosResponse<DashboardCreateRes>;

    const authGroupCreateRes = (await postReq('auth/group/create', {
      name: 'group1',
    })) as AxiosResponse<AuthGroupCreateRes>;

    const authGroupId = authGroupCreateRes.data.id;

    const createBody: AuthGroupDashboardCreateReq = {
      dashboards: [
        {
          name: createRetVal.data.name,
          id: createRetVal.data.id,
          create: false,
          delete: true,
          read: false,
          update: true,
        },
      ],
      id: authGroupId,
      name: authGroupCreateRes.data.name,
    };
    const groupDashCreateRes = (await postReq(
      'auth/group/dashboard/create',
      createBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(groupDashCreateRes.status).toBe(200);

    const updateBody: AuthGroupDashboardUpdateReq = {
      id: authGroupId,
      name: authGroupCreateRes.data.name,
      dashboards: [
        {
          name: createRetVal.data.name,
          id: createRetVal.data.id,
          create: true,
          delete: true,
          read: true,
          update: true,
        },
      ],
    };

    const groupDashUpdateRes = (await postReq(
      'auth/group/dashboard/update',
      updateBody,
    )) as AxiosResponse<AuthGroupDashboardUpdateRes>;

    expect(groupDashUpdateRes.status).toBe(200);

    expect(groupDashUpdateRes.data.dashboards).toMatchObject(
      updateBody.dashboards,
    );

    const readBody: DashboardGroupAuthReadReq = {
      id: createRetVal.data.id,
      from: 1,
      to: 20,
      filters: {
        // name: {
        //   // condition1: {
        //   filter: 'Pontus',
        //   filterType: 'text',
        //   type: 'contains',
        //   // },
        //   // filterType: 'text',
        // },
      },
    };

    const readRetVal2 = (await postReq(
      'dashboard/group/auth/read',
      readBody,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;
    expect(readRetVal2.data?.authGroups[0]).toMatchObject({
      name: authGroupCreateRes.data.name,
      id: authGroupCreateRes.data.id,
      create: true,
      delete: true,
      read: true,
      update: true,
    });

    const readBody2: AuthGroupDashboardsReadReq = {
      id: authGroupId,
      name: authGroupCreateRes.data.name,

      filters: {
        name: {
          condition1: {
            filter: createRetVal.data.name,
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal3 = (await postReq(
      '/auth/group/dashboards/read',
      readBody2,
    )) as AxiosResponse<AuthGroupDashboardsReadRes>;

    expect(readRetVal3.data.dashboards).toMatchObject(
      groupDashUpdateRes.data.dashboards,
    );
  });
  it('should update a authGroup and its reference in a dashboard', async () => {
    const body: DashboardCreateReq = {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: {},
    };

    const createRetVal = (await postReq(
      'dashboard/create',
      body,
    )) as AxiosResponse<DashboardCreateRes>;

    const authGroupCreateRes = (await postReq('auth/group/create', {
      name: 'group1',
    })) as AxiosResponse<AuthGroupCreateRes>;

    const createBody: AuthGroupDashboardCreateReq = {
      dashboards: [
        {
          name: createRetVal.data.name,
          id: createRetVal.data.id,
          create: false,
          delete: true,
          read: false,
          update: true,
        },
      ],
      id: authGroupCreateRes.data.id,
      name: authGroupCreateRes.data.name,
    };
    const groupDashCreateRes = (await postReq(
      'auth/group/dashboard/create',
      createBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(groupDashCreateRes.status).toBe(200);

    const readBody: AuthGroupReadReq = {
      id: authGroupCreateRes.data.id,
      name: authGroupCreateRes.data.name,
    };

    const authGroupReadRes = (await postReq(
      '/auth/group/read',
      readBody,
    )) as AxiosResponse<AuthGroupReadRes>;

    expect(authGroupReadRes.data.name).toBe(authGroupCreateRes.data.name);
  });
  it('should delete dashboards subdocuments', async () => {
    const body: DashboardCreateReq = {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: {},
    };

    const createRetVal = (await postReq(
      'dashboard/create',
      body,
    )) as AxiosResponse<DashboardCreateRes>;

    const authGroupCreateRes = (await postReq('auth/group/create', {
      name: 'group1',
    })) as AxiosResponse<AuthGroupCreateRes>;

    const authGroupId = authGroupCreateRes.data.id;

    const createBody: AuthGroupDashboardCreateReq = {
      dashboards: [
        {
          name: createRetVal.data.name,
          id: createRetVal.data.id,
          create: false,
          delete: true,
          read: false,
          update: true,
        },
      ],
      name: authGroupCreateRes.data.name,
      id: authGroupId,
    };

    const groupDashCreateRes = (await postReq(
      'auth/group/dashboard/create',
      createBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(groupDashCreateRes.data.dashboards).toMatchObject(
      createBody.dashboards,
    );

    expect(groupDashCreateRes.data.dashboards).toMatchObject(
      createBody.dashboards,
    );

    const readBody4: AuthGroupDashboardsReadReq = {
      id: groupDashCreateRes.data.id,
      name: authGroupCreateRes.data.name,
      filters: {
        name: {
          condition1: {
            filter: createRetVal.data.name,
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal4 = (await postReq(
      '/auth/group/dashboards/read',
      readBody4,
    )) as AxiosResponse<AuthGroupDashboardsReadRes>;

    const readBody5: DashboardGroupAuthReadReq = {
      id: createRetVal.data.id,
      from: 1,
      to: 10,
      filters: {
        name: {
          condition1: {
            filter: 'group1',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal5 = (await postReq(
      'dashboard/group/auth/read',
      readBody5,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;

    expect(readRetVal4.data.dashboards[0]).toMatchObject(
      createBody.dashboards[0],
    );
    expect(readRetVal5.data.authGroups[0]).toMatchObject({
      name: authGroupCreateRes.data.name,
      id: authGroupCreateRes.data.id,
      create: false,
      delete: true,
      read: false,
      update: true,
    });

    const deleteBody: AuthGroupDashboardDeleteReq = {
      dashboardIds: [createRetVal.data.id],
      id: authGroupId,
      name: authGroupCreateRes.data.name,
    };

    const readRetVal = (await postReq(
      'auth/group/dashboard/delete',
      deleteBody,
    )) as AxiosResponse<DashboardGroupAuthDeleteRes>;

    expect(readRetVal.status).toBe(200);

    const readBody: DashboardGroupAuthReadReq = {
      id: createRetVal.data.id,
      filters: {
        name: {
          condition1: {
            filter: 'group1',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal2 = (await postReq(
      'dashboard/group/auth/read',
      readBody,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;

    const readBody2: AuthGroupDashboardsReadReq = {
      id: authGroupId,
      name: authGroupCreateRes.data.name,
      filters: {
        name: {
          condition1: {
            filter: createRetVal.data.name,
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal3 = (await postReq(
      '/auth/group/dashboards/read',
      readBody2,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;

    expect(readRetVal2.status).toBe(404);
    expect(readRetVal3.status).toBe(404);
  });
  it('should create a an authgroup, associate a dashboard and delete it, and its reference in the dashboard', async () => {
    const body: DashboardCreateReq = {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: {},
    };

    const createRetVal = (await postReq(
      'dashboard/create',
      body,
    )) as AxiosResponse<DashboardCreateRes>;

    const authGroupCreateRes = (await postReq('auth/group/create', {
      name: 'group1',
    })) as AxiosResponse<AuthGroupCreateRes>;

    const authGroupId = authGroupCreateRes.data.id;

    const createBody: AuthGroupDashboardCreateReq = {
      dashboards: [
        {
          name: createRetVal.data.name,
          id: createRetVal.data.id,
          create: false,
          delete: true,
          read: false,
          update: true,
        },
      ],
      name: authGroupCreateRes.data.name,
      id: authGroupId,
    };

    const groupDashCreateRes = (await postReq(
      'auth/group/dashboard/create',
      createBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    const readBody: DashboardGroupAuthReadReq = {
      id: createRetVal.data.id,
      filters: {
        name: {
          condition1: {
            filter: 'group1',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal = (await postReq(
      'dashboard/group/auth/read',
      readBody,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;

    expect(readRetVal.data.authGroups[0].name).toBe(
      authGroupCreateRes.data.name,
    );

    const deleteBody: AuthGroupDeleteReq = {
      id: authGroupCreateRes.data.id,
      name: authGroupCreateRes.data.name,
    };

    const authGroupDeleteRes = (await postReq(
      '/auth/group/delete',
      deleteBody,
    )) as AxiosResponse<AuthGroupDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);

    const readRetVal2 = (await postReq(
      'dashboard/group/auth/read',
      readBody,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;

    expect(readRetVal2.status).toBe(404);
  });
  it('should UPDATE dashboards subdocuments incorreclty', async () => {
    const body: DashboardCreateReq = {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: {},
    };

    const createRetVal = (await postReq(
      'dashboard/create',
      body,
    )) as AxiosResponse<DashboardCreateRes>;

    const authGroupCreateRes = (await postReq('auth/group/create', {
      name: 'group1',
    })) as AxiosResponse<AuthGroupCreateRes>;

    const authGroupId = authGroupCreateRes.data.id;

    const deleteBody: AuthGroupDashboardUpdateReq = {
      dashboards: [
        {
          id: 'foo',
          create: true,
          read: true,
          update: true,
          delete: true,
          name: 'bar',
        },
      ],
      name: authGroupCreateRes.data.name,
      id: authGroupId,
    };

    const readRetVal = (await postReq(
      'auth/group/dashboard/update',
      deleteBody,
    )) as AxiosResponse<DashboardGroupAuthDeleteRes>;

    expect(readRetVal.status).toBe(404);
  });
  it('should associate a dashboard to an incorrect authGroup', async () => {
    const createBody: AuthGroupDashboardCreateReq = {
      dashboards: [
        {
          name: 'foo',
          id: 'bar',
          create: false,
          delete: true,
          read: false,
          update: true,
        },
      ],
      name: 'foo',
      id: 'bar',
    };

    const groupDashCreateRes = (await postReq(
      'auth/group/dashboard/create',
      createBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(groupDashCreateRes.status).toBe(404);
  });
  it('should create a an authgroup, associate an authuser and delete it, and its reference in the dashboard', async () => {
    const body: AuthGroupCreateReq = {
      name: 'group1',
    };

    const createRetVal = (await postReq(
      'auth/group/create',
      body,
    )) as AxiosResponse<AuthGroupCreateRes>;

    const createBody: AuthGroupUsersCreateReq = {
      authUsers: [
        {
          id: user.id,
          username: user.username,
        },
      ],
      id: createRetVal.data.id,
      name: createRetVal.data.name,
    };

    const groupUserCreateRes = (await postReq(
      'auth/group/users/create',
      createBody,
    )) as AxiosResponse<AuthGroupUsersCreateRes>;

    expect(groupUserCreateRes.status).toBe(200);

    const readBody: AuthGroupUsersReadReq = {
      id: createRetVal.data.id,
      filters: {
        // username: {
        //   condition1: {
        //     filter: 'user1',
        //     filterType: 'text',
        //     type: 'contains',
        //   },
        //   filterType: 'text',
        // },
      },
    };

    const readRetVal = (await postReq(
      'auth/group/users/read',
      readBody,
    )) as AxiosResponse<AuthGroupUsersReadRes>;

    expect(readRetVal.data.authUsers[0].username).toBe(user.username);

    const deleteBody: AuthGroupDeleteReq = {
      id: createRetVal.data.id,
      name: createRetVal.data.name,
    };

    const authGroupDeleteRes = (await postReq(
      '/auth/group/delete',
      deleteBody,
    )) as AxiosResponse<AuthGroupDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);

    const readRetVal2 = (await postReq(
      'auth/group/users/read',
      readBody,
    )) as AxiosResponse<AuthGroupUsersReadRes>;

    expect(readRetVal2.status).toBe(404);
  });
  it('should update a authGroup and its reference in a authUser', async () => {
    const body: AuthGroupCreateReq = {
      name: 'group1',
    };

    const createRetVal = (await postReq(
      'auth/group/create',
      body,
    )) as AxiosResponse<AuthGroupCreateRes>;

    const createBody: AuthGroupUsersCreateReq = {
      authUsers: [
        {
          id: user.id,
          username: user.username,
        },
      ],
      id: createRetVal.data.id,
      name: createRetVal.data.name,
    };

    const groupUserCreateRes = (await postReq(
      'auth/group/users/create',
      createBody,
    )) as AxiosResponse<AuthGroupUsersCreateRes>;

    expect(groupUserCreateRes.status).toBe(200);

    const readBody: AuthGroupUsersReadReq = {
      id: createRetVal.data.id,
      filters: {
        username: {
          condition1: {
            filter: 'user1',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal = (await postReq(
      'auth/group/users/read',
      readBody,
    )) as AxiosResponse<AuthGroupUsersReadRes>;

    expect(readRetVal.data.authUsers[0].username).toBe(user.username);

    const updateBody: AuthGroupUsersUpdateReq = {
      authUsers: [
        {
          id: user.id,
          username: user.username,
        },
      ],
      name: createRetVal.data.name,
      id: createRetVal.data.id,
    };

    const groupUserUpdateRes = (await postReq(
      'auth/group/users/update',
      updateBody,
    )) as AxiosResponse<AuthGroupUsersUpdateRes>;

    expect(groupUserUpdateRes.status).toBe(200);

    const deleteBody: AuthGroupDeleteReq = {
      id: createRetVal.data.id,
      name: createRetVal.data.name,
    };

    const authGroupDeleteRes = (await postReq(
      '/auth/group/delete',
      deleteBody,
    )) as AxiosResponse<AuthGroupDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);

    const readRetVal2 = (await postReq(
      'auth/group/users/read',
      readBody,
    )) as AxiosResponse<AuthGroupUsersReadRes>;

    expect(readRetVal2.status).toBe(404);
  });
  it('should create a an authgroup, associate an authuser and delete its reference', async () => {
    const body: AuthGroupCreateReq = {
      name: 'group1',
    };

    const createRetVal = (await postReq(
      'auth/group/create',
      body,
    )) as AxiosResponse<AuthGroupCreateRes>;

    const createBody: AuthGroupUsersCreateReq = {
      authUsers: [
        {
          id: user.id,
          username: user.username,
        },
      ],
      id: createRetVal.data.id,
      name: createRetVal.data.name,
    };

    const groupUserCreateRes = (await postReq(
      'auth/group/users/create',
      createBody,
    )) as AxiosResponse<AuthGroupUsersCreateRes>;

    const readBody: AuthGroupUsersReadReq = {
      id: createRetVal.data.id,
      filters: {
        username: {
          condition1: {
            filter: 'user1',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal = (await postReq(
      'auth/group/users/read',
      readBody,
    )) as AxiosResponse<AuthGroupUsersReadRes>;

    expect(readRetVal.data.authUsers[0].username).toBe(user.username);

    const deleteBody2: AuthGroupUsersDeleteReq = {
      id: createRetVal.data.id,
      name: createRetVal.data.name,
      authUsers: [{ id: user.id, username: user.username }],
    };

    const authGroupDeleteRes = (await postReq(
      '/auth/group/users/delete',
      deleteBody2,
    )) as AxiosResponse<AuthGroupDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);

    const readRetVal2 = (await postReq(
      'auth/group/users/read',
      readBody,
    )) as AxiosResponse<AuthGroupUsersReadRes>;

    expect(readRetVal2.status).toBe(404);
  });
  it('should create a an authgroup, associate a table and delete its reference', async () => {
    const body: AuthGroupCreateReq = {
      name: 'group1',
    };

    const createGroupRetVal = (await postReq(
      'auth/group/create',
      body,
    )) as AxiosResponse<AuthGroupCreateRes>;

    const tableBody: TableCreateReq = {
      name: 'person-natural',
      label: 'Person Natural',
      cols: [
        {
          field: 'Person_Natural_Full_Name',
          filter: true,
          headerName: 'Full Name',
          id: 'Person_Natural_Full_Name',
          name: 'full-name',
          sortable: true,
        },
        {
          field: 'Person_Natural_Customer_ID',
          filter: true,
          headerName: 'Customer ID',
          id: 'Person_Natural_Customer_ID',
          name: 'customer-id',
          sortable: true,
        },
      ],
    };

    const createTableRetVal = (await postReq(
      'table/create',
      tableBody,
    )) as AxiosResponse<TableCreateRes>;

    const createGroupTablesBody: AuthGroupTablesCreateReq = {
      id: createGroupRetVal.data.id,
      name: createGroupRetVal.data.name,
      tables: [
        { id: createTableRetVal.data.id, name: createTableRetVal.data.name },
      ],
    };

    const groupTablesCreateRes = (await postReq(
      'auth/group/tables/create',
      createGroupTablesBody,
    )) as AxiosResponse<AuthGroupTablesCreateRes>;

    const readBody: AuthGroupTablesReadReq = {
      id: createGroupRetVal.data.id,
      name: createGroupRetVal.data.name,
      filters: {
        name: {
          condition1: {
            filter: createTableRetVal.data.name,
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal = (await postReq(
      'auth/group/tables/read',
      readBody,
    )) as AxiosResponse<AuthGroupTablesReadRes>;

    expect(readRetVal.data.tables[0].id).toBe(createTableRetVal.data.id);

    const deleteBody2: AuthGroupTablesDeleteReq = {
      id: createGroupRetVal.data.id,
      name: createGroupRetVal.data.name,
      tables: [
        { name: createTableRetVal.data.name, id: createTableRetVal.data.id },
      ],
    };

    const authGroupDeleteRes = (await postReq(
      '/auth/group/tables/delete',
      deleteBody2,
    )) as AxiosResponse<AuthGroupTablesDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);

    const readRetVal2 = (await postReq(
      'auth/group/tables/read',
      readBody,
    )) as AxiosResponse<AuthGroupUsersReadRes>;

    expect(readRetVal2.status).toBe(404);
  });

});
