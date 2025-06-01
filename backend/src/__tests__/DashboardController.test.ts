import {
  DashboardCreateReq,
  DashboardCreateRes,
  DashboardReadRes,
  DashboardRef,
  DashboardUpdateRes,
  DashboardUpdateReq,
  DashboardGroupAuthReadReq,
  DashboardGroupAuthCreateRes,
  DashboardGroupAuthUpdateReq,
  DashboardGroupAuthUpdateRes,
  AuthUserCreateRes,
  AuthUserCreateReq,
  LoginReq,
  LoginRes,
  AuthGroupCreateReq,
  AuthGroupCreateRes,
  DashboardDeleteReq,
} from '../typescript/api';
// import { sendHttpRequest } from '../http';
// import { method } from 'lodash';
// import axios from 'axios';

import { prepareDbAndAuth, post, cleanTables, removeDeltaTables } from './test-utils';
import {
  AuthGroupUsersCreateReq,
  DashboardGroupAuthCreateReq,
} from '../generated/api/resources';
import { AxiosResponse } from 'axios';
import { AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES, DELTA_DB, GROUPS_DASHBOARDS, GROUPS_USERS, WEBHOOKS_SUBSCRIPTIONS } from '../consts';
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

  let admin = {} as AuthUserCreateRes;
  let postAdmin;
  let tables = [AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES, WEBHOOKS_SUBSCRIPTIONS];
  if (process.env.DB_SOURCE === DELTA_DB) {
    tables = [...tables, GROUPS_DASHBOARDS, GROUPS_USERS, 'person_natural'];
  }

  beforeAll(async()=> {
    await removeDeltaTables(['person_natural'])
  })
  beforeEach(async () => {
    const dbUtils = await prepareDbAndAuth(tables);
    postAdmin = dbUtils.postAdmin;
    admin = dbUtils.admin;
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(async() => {
    await cleanTables(tables)
    process.env = OLD_ENV; // Restore old environment
    // srv.close();
  });

  it('should do the CRUD "happy path" with authorization', async () => {
    const body: DashboardRef = {
      name: 'string',
      folder: 'string',
      owner: 'string',
      state: {},
    };

    const createBody = {
      name: 'group1',
    };

    const authGroupCreateRes = (await postAdmin(
      '/auth/group/create',
      createBody,
    )) as AxiosResponse<AuthGroupCreateRes>;

    expect(authGroupCreateRes.status).toBe(200);

    const authGroupUserBody: AuthGroupUsersCreateReq = {
      id: authGroupCreateRes.data.id,
      name: authGroupCreateRes.data.name,
      authUsers: [{ id: admin.id, username: admin.username }],
    };

    const createGroupUser = await postAdmin(
      'auth/group/users/create',
      authGroupUserBody,
    );

    expect(createGroupUser.status).toBe(200);

    const createRetVal = await postAdmin('dashboard/create', body);

    const dashboardGroupBody: DashboardGroupAuthCreateReq = {
      authGroups: [
        {
          id: authGroupCreateRes.data.id,
          name: authGroupCreateRes.data.name,
          create: true,
          delete: true,
          read: true,
          update: true,
        },
      ],
      id: createRetVal.data.id,
    };

    const createRetVal2 = await postAdmin(
      'dashboard/group/auth/create',
      dashboardGroupBody,
    );

    expect(createRetVal2.status).toBe(200);

    let resPayload: DashboardCreateRes = createRetVal.data;
    let id = resPayload.id;

    expect(createRetVal.data.name).toBe(body.name);

    const readRetVal = await postAdmin('dashboard/read', {
      id,
    });
    let resPayload2: DashboardReadRes = readRetVal.data;

    console.log(`res2: ${JSON.stringify(resPayload2)}`);

    expect(readRetVal.status).toBe(200);
    expect(readRetVal.data.name).toBe(body.name);

    const body2: DashboardUpdateReq = {
      id: resPayload2.id,
      owner: resPayload2.owner,
      name: 'Pontus 2',
      folder: resPayload2.folder,
      state: resPayload2.state,
    };

    const updateRetVal = await postAdmin('dashboard/update', body2);

    let resPayload3: DashboardUpdateRes = updateRetVal.data;

    expect(updateRetVal.status).toBe(200);
    expect(resPayload3.name).toBe(body2.name);

    const body3 = {
      id: resPayload3.id,
    };

    const deleteRetVal = await postAdmin('dashboard/delete', body3);

    expect(deleteRetVal.status).toBe(200);

    const readRetVal2 = await postAdmin('dashboard/read', body3);

    expect(readRetVal2.status).toBe(404);
  });

  it('should do the CRUD "happy path" with from NO authorized to authorized', async () => {
    const body: DashboardRef = {
      name: 'string',
      folder: 'string',
      owner: 'string',
      state: {},
    };

    const createBody = {
      name: 'group1',
    };

    const createUserBody: AuthUserCreateReq = {
      username: 'foo',
      password: 'foobar',
      passwordConfirmation: 'foobar',
    };

    const authUserCreateRes = (await postAdmin(
      '/auth/user/create',
      createUserBody,
    )) as AxiosResponse<AuthUserCreateRes>;

    expect(authUserCreateRes.status).toBe(200);

    const loginBody: LoginReq = {
      username: authUserCreateRes.data.username,
      password: createUserBody.password,
    };

    const login = (await post('login', loginBody)) as AxiosResponse<LoginRes>;

    expect(login.status).toBe(200);

    const bearerToken = 'Bearer ' + login.data.accessToken;

    const authGroupCreateRes = (await postAdmin(
      '/auth/group/create',
      createBody,
    )) as AxiosResponse<AuthGroupCreateRes>;

    expect(authGroupCreateRes.status).toBe(200);

    const authGroupUserBody: AuthGroupUsersCreateReq = {
      id: authGroupCreateRes.data.id,
      name: authGroupCreateRes.data.name,
      authUsers: [
        {
          id: authUserCreateRes.data.id,
          username: authUserCreateRes.data.username,
        },
      ],
    };

    const createGroupUser = await postAdmin(
      'auth/group/users/create',
      authGroupUserBody,
    );

    expect(createGroupUser.status).toBe(200);

    const createRetVal = (await post('dashboard/create', body, {
      Authorization: bearerToken,
    })) as AxiosResponse<DashboardCreateReq>;

    const dashboardGroupBody: DashboardGroupAuthCreateReq = {
      authGroups: [
        {
          id: authGroupCreateRes.data.id,
          name: authGroupCreateRes.data.name,
          create: false,
          delete: false,
          read: false,
          update: false,
        },
      ],
      id: createRetVal.data.id,
    };

    const createRetVal2 = (await postAdmin(
      'dashboard/group/auth/create',
      dashboardGroupBody,
    )) as AxiosResponse<DashboardGroupAuthCreateRes>;

    expect(createRetVal2.status).toBe(200);

    expect(createRetVal2.data.authGroups).toMatchObject(
      dashboardGroupBody.authGroups,
    );

    const readRetVal = await post(
      'dashboard/read',
      {
        id: 'foo',
      },
      {
        Authorization: bearerToken,
      },
    );

    expect(readRetVal.status).toBe(401);

    const body2: DashboardUpdateReq = {
      id: 'foo',
      owner: 'bar',
      name: 'Pontus 2',
      folder: 'foo2',
      state: {},
    };

    const updateRetVal = await post('dashboard/update', body2, {
      Authorization: bearerToken,
    });

    expect(updateRetVal.status).toBe(401);

    const body3 = {
      id: 'foo',
    };

    const deleteRetVal = await post('dashboard/delete', body3, {
      Authorization: bearerToken,
    });

    expect(deleteRetVal.status).toBe(401);

    const updateGroupDashBody: DashboardGroupAuthUpdateReq = {
      authGroups: [
        {
          id: authGroupCreateRes.data.id,
          name: authGroupCreateRes.data.name,
          create: false,
          delete: false,
          read: true,
          update: false,
        },
      ],
      id: createRetVal.data.id,
    };

    const updateDashGroupRetVal = await postAdmin(
      'dashboard/group/auth/update',
      updateGroupDashBody,
    );

    expect(updateDashGroupRetVal.status).toBe(200);
    const readRetVal2 = await postAdmin('dashboard/read', {
      id: createRetVal.data.id,
    });

    expect(readRetVal2.status).toBe(200);

    const updateGroupDashBody2: DashboardGroupAuthUpdateReq = {
      authGroups: [
        {
          id: authGroupCreateRes.data.id,
          name: authGroupCreateRes.data.name,
          create: false,
          delete: false,
          read: true,
          update: true,
        },
      ],
      id: createRetVal.data.id,
    };
    const updateDashGroupRetVal2 = await postAdmin(
      'dashboard/group/auth/update',
      updateGroupDashBody2,
    );

    expect(updateDashGroupRetVal2.status).toBe(200);

    const updateDashBody: DashboardUpdateReq = {
      id: createRetVal.data.id,
      state: { foo: 'bar' },
    };

    const updateRetVal2 = await postAdmin('dashboard/update', updateDashBody);
    expect(updateRetVal2.status).toBe(200);

    const updateGroupDashBody3: DashboardGroupAuthUpdateReq = {
      authGroups: [
        {
          id: authGroupCreateRes.data.id,
          name: authGroupCreateRes.data.name,
          create: false,
          delete: true,
          read: true,
          update: true,
        },
      ],
      id: createRetVal.data.id,
    };
    const updateDashGroupRetVal3 = await postAdmin(
      'dashboard/group/auth/update',
      updateGroupDashBody3,
    );

    expect(updateDashGroupRetVal3.status).toBe(200);

    const dashDeleteBody: DashboardDeleteReq = {
      id: createRetVal.data.id,
    };

    const updateRetVal3 = await postAdmin('dashboard/delete', dashDeleteBody);
    expect(updateRetVal3.status).toBe(200);
  });
  it('should do the CRUD "sad path"', async () => {
    const createRetVal = await postAdmin('dashboard/create', {});

    expect(createRetVal.status).toBe(400);

    const readRetVal = await postAdmin('dashboard/read', {
      id: 'foo',
    });

    expect(readRetVal.status).toBe(404);

    const updateRetVal = await postAdmin('dashboard/update', { foo: 'bar' });

    expect(updateRetVal.status).toBe(422);

    const deleteRetVal = await postAdmin('dashboard/delete', { foo: 'bar' });

    let resPayload4 = deleteRetVal.data;

    expect(deleteRetVal.status).toBe(422);
  });
  it('should read dashboards', async () => {
    const body: DashboardCreateReq = {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: {
        global: {},
        borders: [],
        layout: {
          type: 'row',
          id: '#a880b6c8-8981-4ea8-93c4-810a7ac41e3f',
          children: [
            {
              type: 'row',
              id: '#63ec4f08-7081-4557-b2c0-6fe74bf2893e',
              children: [
                {
                  type: 'tabset',
                  id: '#3155bc6f-ea47-4e9b-822e-bc023ced5e60',
                  children: [
                    {
                      type: 'tab',
                      id: '#ba731bfa-a493-445b-a74f-dcf042b53593',
                      name: 'name',
                      component: 'PVGridWebiny2',
                      config: {
                        title: 'name',
                        tableId: 'tableId',
                        lastState: [],
                        height: 249,
                      },
                    },
                  ],
                },
                {
                  type: 'tabset',
                  id: '#f6d34c55-6a57-4266-bc09-ad5099853b89',
                  children: [
                    {
                      type: 'tab',
                      id: '#ca5bdcac-9cd2-4b7a-861a-034b6117af34',
                      name: 'name',
                      component: 'PVGridWebiny2',
                      config: {
                        title: 'name',
                        tableId: 'tableId',
                        lastState: [],
                        height: 249,
                      },
                    },
                  ],
                  active: true,
                },
              ],
            },
          ],
        },
      },
    };

    const createRetVal = await postAdmin('dashboard/create', body);

    const createRetVal2 = await postAdmin('dashboard/create', {
      ...body,
      name: 'PontusVision2',
    });

    const readBody = {
      filters: {
        name: {
          condition1: {
            filter: 'PontusVision',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal = await postAdmin('dashboards/read', readBody);

    expect(readRetVal.data.totalDashboards).toBe(2);

    const readBody2 = {
      filters: {
        name: {
          condition1: {
            filter: 'PontusVision',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
        folder: {
          condition1: {
            filter: 'folder 1',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const deleteVal = await postAdmin('dashboard/delete', {
      id: createRetVal.data.id,
    });

    expect(deleteVal.status).toBe(200);
    const deleteVal2 = await postAdmin('dashboard/delete', {
      id: createRetVal2.data.id,
    });

    expect(deleteVal2.status).toBe(200);
  });

  it('should create auth incorrectly in dashboard', async () => {
    const dashboardBody: DashboardCreateReq = {
      folder: 'folder',
      name: 'dashboard1',
      owner: 'foo',
      state: {},
    };
    const createDashboard = (await postAdmin(
      'dashboard/create',
      dashboardBody,
    )) as AxiosResponse<DashboardCreateRes>;

    const updateDashboardGroupAuthResponse2 = (await postAdmin(
      'dashboard/group/auth/update',
      {
        id: createDashboard.data.id,
        authGroups: [
          {
            create: true,
            delete: true,
            read: false,
            update: true,
            id: 'foo',
            name: 'bar',
          },
        ],
      },
    )) as AxiosResponse<DashboardGroupAuthUpdateRes>;

    expect(updateDashboardGroupAuthResponse2.status).toBe(404);

    const readGroupAuthBody2: DashboardGroupAuthReadReq = {
      id: createDashboard.data.id,
      filters: {
        name: {
          filterType: 'text',
          condition1: {
            filter: 'foo',
            filterType: 'text',
            type: 'contains',
          },
          operator: 'AND',
          condition2: {
            filter: 'bar',
            filterType: 'text',
            type: 'contains',
          },
        },
      },
    };

    const readDashboardGroupAuthResponse2 = (await postAdmin(
      'dashboard/group/auth/read',
      readGroupAuthBody2,
    )) as AxiosResponse<DashboardGroupAuthUpdateRes>;

    expect(readDashboardGroupAuthResponse2.status).toBe(404);
  });
});
