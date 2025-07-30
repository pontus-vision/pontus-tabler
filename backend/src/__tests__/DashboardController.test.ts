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

import { prepareDbAndAuth, post, cleanTables, removeDeltaTables, expectAudit } from './test-utils';
import {
  AuthGroupUsersCreateReq,
  DashboardGroupAuthCreateReq,
} from '../generated/api/resources';
import { AxiosResponse } from 'axios';
import { AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES, DELTA_DB, GROUPS_DASHBOARDS, GROUPS_USERS, WEBHOOKS_SUBSCRIPTIONS, AUDIT } from '../consts';
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
  let tables = [AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES, WEBHOOKS_SUBSCRIPTIONS, AUDIT];
  if (process.env.DB_SOURCE === DELTA_DB) {
    tables = [...tables, GROUPS_DASHBOARDS, GROUPS_USERS, 'person_natural'];
  }

  beforeAll(async () => {
    await removeDeltaTables(['person_natural'])
    await cleanTables(tables)
  })
  beforeEach(async () => {
    const dbUtils = await prepareDbAndAuth(tables);
    postAdmin = dbUtils.postAdmin;
    admin = dbUtils.admin;
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(async () => {
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

  const authGroupCreateRes = await expectAudit(() =>
    postAdmin('/auth/group/create', createBody),
    '/auth/group/create'
  );

  const authGroupUserBody: AuthGroupUsersCreateReq = {
    id: authGroupCreateRes.data.id,
    name: authGroupCreateRes.data.name,
    authUsers: [{ id: admin.id, username: admin.username }],
  };

  await expectAudit(() =>
    postAdmin('auth/group/users/create', authGroupUserBody),
    'auth/group/users/create'
  );

  const createRetVal = await expectAudit(() =>
    postAdmin('dashboard/create', body),
    'dashboard/create'
  );

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

  await expectAudit(() =>
    postAdmin('dashboard/group/auth/create', dashboardGroupBody),
    'dashboard/group/auth/create'
  );

  const readRetVal = await expectAudit(() =>
    postAdmin('dashboard/read', { id: createRetVal.data.id }),
    'dashboard/read'
  );

  const body2: DashboardUpdateReq = {
    id: readRetVal.data.id,
    owner: readRetVal.data.owner,
    name: 'Pontus 2',
    folder: readRetVal.data.folder,
    state: readRetVal.data.state,
  };

  const updateRetVal = await expectAudit(() =>
    postAdmin('dashboard/update', body2),
    'dashboard/update'
  );

  const deleteRetVal = await expectAudit(() =>
    postAdmin('dashboard/delete', { id: updateRetVal.data.id }),
    'dashboard/delete'
  );

  const dashread2 = await expectAudit(() =>
    postAdmin('dashboard/read', { id: updateRetVal.data.id }),
    'dashboard/read',
    ['Admin'],
    404
  );

  console.log({dashread2: JSON.stringify(dashread2)})
});


it('should do the CRUD "happy path" with from NO authorized to authorized', async () => {
  const body: DashboardRef = {
    name: 'string',
    folder: 'string',
    owner: 'string',
    state: {},
  };

  const createUserBody = {
    username: 'foo',
    password: 'foobar',
    passwordConfirmation: 'foobar',
  };

  const authUserCreateRes = await expectAudit(() =>
    postAdmin('/auth/user/create', createUserBody),
    '/auth/user/create'
  );

  const login = await expectAudit(() =>
    post('login', {
      username: authUserCreateRes.data.username,
      password: createUserBody.password,
    }),
    'login',
    []
  );

  const bearerToken = 'Bearer ' + login.data.accessToken;

  const createGroupRes = await expectAudit(() =>
    postAdmin('/auth/group/create', {
      name: 'group1',
      dashboardCrud: {
        create: true,
        delete: true,
        read: true,
        update: true,
      },
    }),
    '/auth/group/create'
  ) as AxiosResponse<AuthGroupCreateRes>

  const authGroupUserBody: AuthGroupUsersCreateReq = {
    id: createGroupRes.data.id,
    name: createGroupRes.data.name,
    authUsers: [{ id: authUserCreateRes.data.id, username: authUserCreateRes.data.username }],
  };

  await expectAudit(() =>
    postAdmin('auth/group/users/create', authGroupUserBody),
    'auth/group/users/create'
  );

  const createRetVal = await expectAudit(() =>
    post('dashboard/create', body, { Authorization: bearerToken }),
    'dashboard/create', [createGroupRes.data.name]
  );

  await expectAudit(() =>
    postAdmin('dashboard/group/auth/create', {
      authGroups: [
        {
          id: createGroupRes.data.id,
          name: createGroupRes.data.name,
          create: false,
          delete: false,
          read: false,
          update: false,
        },
      ],
      id: createRetVal.data.id,
    }),
    'dashboard/group/auth/create'
  );

  await expectAudit(() =>
    post('dashboard/read', { id: 'foo' }, { Authorization: bearerToken }),
    'dashboard/read',
    [createGroupRes.data.name],
    401
  );

  await expectAudit(() =>
    post('dashboard/update', {
      id: 'foo',
      owner: 'bar',
      name: 'Pontus 2',
      folder: 'foo2',
      state: {},
    }, { Authorization: bearerToken }),
    'dashboard/update',
    [createGroupRes.data.name],
    401
  );

  await expectAudit(() =>
    post('dashboard/delete', { id: 'foo' }, { Authorization: bearerToken }),
    'dashboard/delete',
    [createGroupRes.data.name],
    401
  );

  await expectAudit(() =>
    postAdmin('dashboard/group/auth/update', {
      authGroups: [{
        id: createGroupRes.data.id,
        name: createGroupRes.data.name,
        create: false,
        delete: false,
        read: true,
        update: false,
      }],
      id: createRetVal.data.id,
    }),
    'dashboard/group/auth/update'
  );

  await expectAudit(() =>
    postAdmin('dashboard/read', { id: createRetVal.data.id }),
    'dashboard/read'
  );

  await expectAudit(() =>
    postAdmin('dashboard/group/auth/update', {
      authGroups: [{
        id: createGroupRes.data.id,
        name: createGroupRes.data.name,
        create: false,
        delete: false,
        read: true,
        update: true,
      }],
      id: createRetVal.data.id,
    }),
    'dashboard/group/auth/update'
  );

  await expectAudit(() =>
    postAdmin('dashboard/update', {
      id: createRetVal.data.id,
      state: { foo: 'bar' },
    }),
    'dashboard/update'
  );

  await expectAudit(() =>
    postAdmin('dashboard/group/auth/update', {
      authGroups: [{
        id: createGroupRes.data.id,
        name: createGroupRes.data.name,
        create: false,
        delete: true,
        read: true,
        update: true,
      }],
      id: createRetVal.data.id,
    }),
    'dashboard/group/auth/update'
  );

  await expectAudit(() =>
    postAdmin('dashboard/delete', {
      id: createRetVal.data.id,
    }),
    'dashboard/delete'
  );
});


it('should do the CRUD "sad path"', async () => {
  await expectAudit(() =>
    postAdmin('dashboard/create', {}),
    'dashboard/create',
    ['Admin'],
    400
  );

  await expectAudit(() =>
    postAdmin('dashboard/read', { id: 'foo' }),
    'dashboard/read',
    ['Admin'],
    404
  );

  // await expectAudit(() =>
  //   postAdmin('dashboard/update', { foo: 'bar' }),
  //   'dashboard/update',
  //   ['Admin'],
  //   422
  // );

  // await expectAudit(() =>
  //   postAdmin('dashboard/delete', { foo: 'bar' }),
  //   'dashboard/delete',
  //   ['Admin'],
  //   422
  // );
});


it('should read dashboards', async () => {
  const dashboard1 = await expectAudit(() =>
    postAdmin('dashboard/create', {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: { global: {}, borders: [], layout: { type: 'row', id: '#id1', children: [] } },
    }),
    'dashboard/create'
  );

  const dashboard2 = await expectAudit(() =>
    postAdmin('dashboard/create', {
      owner: 'Joe',
      name: 'PontusVision2',
      folder: 'folder 1',
      state: { global: {}, borders: [], layout: { type: 'row', id: '#id2', children: [] } },
    }),
    'dashboard/create'
  );

  await expectAudit(() =>
    postAdmin('dashboards/read', {
      filters: {
        name: {
          condition1: { filter: 'PontusVision', filterType: 'text', type: 'contains' },
          filterType: 'text',
        },
      },
    }),
    'dashboards/read'
  );

  await expectAudit(() =>
    postAdmin('dashboard/delete', { id: dashboard1.data.id }),
    'dashboard/delete'
  );

  await expectAudit(() =>
    postAdmin('dashboard/delete', { id: dashboard2.data.id }),
    'dashboard/delete'
  );
});


it('should create auth incorrectly in dashboard', async () => {
  const dashboard = await expectAudit(() =>
    postAdmin('dashboard/create', {
      folder: 'folder',
      name: 'dashboard1',
      owner: 'foo',
      state: {},
    }),
    'dashboard/create'
  );

  await expectAudit(() =>
    postAdmin('dashboard/group/auth/update', {
      id: dashboard.data.id,
      authGroups: [{
        id: 'foo',
        name: 'bar',
        create: true,
        delete: true,
        read: false,
        update: true,
      }],
    }),
    'dashboard/group/auth/update',
    ['Admin'],
    404
  );

  await expectAudit(() =>
    postAdmin('dashboard/group/auth/read', {
      id: dashboard.data.id,
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
    }),
    'dashboard/group/auth/read',
    ['Admin'],
    404
  );
});

});
