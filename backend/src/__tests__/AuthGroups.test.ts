import {
  DashboardCreateReq,
  DashboardCreateRes,
  DashboardGroupAuthReadRes,
  DashboardGroupAuthReadReq,
  DashboardGroupAuthUpdateRes,
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
  AuthGroupUsersCreateReq,
  AuthGroupUsersCreateRes,
  AuthGroupUsersReadReq,
  AuthGroupUsersReadRes,
  AuthGroupUsersDeleteReq,
  TableCreateReq,
  TableCreateRes,
  AuthGroupTablesCreateRes,
  AuthGroupTablesCreateReq,
  AuthGroupTablesReadReq,
  AuthGroupTablesReadRes,
  AuthGroupTablesDeleteReq,
  AuthGroupTablesDeleteRes,
  AuthGroupDashboardDeleteRes,
  AuthGroupUpdateRes,
  LoginReq,
  RegisterAdminReq,
  LoginRes,
  RegisterAdminRes,
} from '../typescript/api';
// import { sendHttpRequest } from '../http';
// import { method } from 'lodash';
// import axios from 'axios';
import { AxiosResponse } from 'axios';
import { AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES, DELTA_DB, GROUPS_DASHBOARDS, GROUPS_USERS, WEBHOOKS_SUBSCRIPTIONS, GROUPS_TABLES } from '../consts';
import { cleanTables, expectAudit, prepareDbAndAuth, removeDeltaTables } from './test-utils';
// import { deleteContainer } from '../cosmos-utils';
// import { deleteContainer } from '../cosmos-utils';

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

  let admin;
  let adminToken
  let postAdmin
  let tables = [AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES, WEBHOOKS_SUBSCRIPTIONS];
  if (process.env.DB_SOURCE === DELTA_DB) {
    tables = [...tables, GROUPS_DASHBOARDS, GROUPS_USERS];
  }

  beforeEach(async () => { 
    const dbUtils = await prepareDbAndAuth(tables);
    postAdmin = dbUtils.postAdmin;
    admin = dbUtils.admin;
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });
  const createDeltaTables = async() => {
  for (const table of tables) {
        switch (table) {
          case AUTH_GROUPS:
            await postAdmin(
              `CREATE TABLE IF NOT EXISTS ${AUTH_GROUPS} (id STRING, name STRING, create_table BOOLEAN , read_table BOOLEAN , update_table BOOLEAN , delete_table BOOLEAN, create_dashboard BOOLEAN , read_dashboard BOOLEAN , update_dashboard BOOLEAN , delete_dashboard BOOLEAN ) USING DELTA LOCATION '/data/pv/${AUTH_GROUPS}';`,
            )
          case GROUPS_TABLES:
            await postAdmin(
              `CREATE TABLE IF NOT EXISTS ${AUTH_GROUPS} (id STRING, name STRING, create_table BOOLEAN , read_table BOOLEAN , update_table BOOLEAN , delete_table BOOLEAN, create_dashboard BOOLEAN , read_dashboard BOOLEAN , update_dashboard BOOLEAN , delete_dashboard BOOLEAN ) USING DELTA LOCATION '/data/pv/${AUTH_GROUPS}';`,
            )
        }
      }
  }

  beforeAll(async()=>{
    await removeDeltaTables(['person_natural', 'person_natural_2'])
  })

  afterAll(async () => {
    await cleanTables(tables)
    process.env = OLD_ENV; // Restore old environment
  });


   it('should create a group', async () => {
    const createBody: AuthGroupCreateReq = {
      name: 'group1',
    };
  
    const authGroupCreateRes = await expectAudit(() =>
      postAdmin('/auth/group/create', createBody),
      '/auth/group/create'
    ) as AxiosResponse<AuthGroupCreateRes>;
  
    expect(authGroupCreateRes.data).toMatchObject(createBody);
  
    const readBody: AuthGroupReadReq = {
      id: authGroupCreateRes.data.id,
      name: authGroupCreateRes.data.name,
    };
  
    const authGroupReadRes = await expectAudit(() =>
      postAdmin('/auth/group/read', readBody),
      '/auth/group/read'
    ) as AxiosResponse<AuthGroupReadRes>;
  
    const deleteBody: AuthGroupDeleteReq = {
      id: authGroupCreateRes.data.id,
      name: authGroupCreateRes.data.name,
    };
  
    const authGroupDeleteRes = await expectAudit(() =>
      postAdmin('/auth/group/delete', deleteBody),
      '/auth/group/delete'
    ) as AxiosResponse<AuthGroupDeleteRes>;
   });
   it('should create dashboards subdocuments', async () => {
    const body: DashboardCreateReq = {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: {},
    };
  
    const createRetVal = await expectAudit(
      () => postAdmin('dashboard/create', body),
      'dashboard/create'
    );
  
    const createGroupBody: AuthGroupCreateReq = {
      name: 'group1',
    };
  
    const authGroupCreateRes = await expectAudit(
      () => postAdmin('auth/group/create', createGroupBody),
      'auth/group/create'
    );
  
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
  
    const groupDashCreateRes = await expectAudit(
      () => postAdmin('auth/group/dashboard/create', createBody),
      'auth/group/dashboard/create'
    );
  
    expect(groupDashCreateRes.data.dashboards).toMatchObject(
      createBody.dashboards
    );
  
    const readBody: DashboardGroupAuthReadReq = {
      id: createRetVal.data.id,
      filters: {},
    };
  
    const readRetVal = await expectAudit(
      () => postAdmin('dashboard/group/auth/read', readBody),
      'dashboard/group/auth/read'
    );
  
    expect(readRetVal.data.authGroups[0]).toMatchObject({
      name: authGroupCreateRes.data.name,
      id: authGroupCreateRes.data.id,
      create: false,
      delete: true,
      read: false,
      update: true,
    });
   });
   it('should do the sad path', async () => {
    const readBody: AuthGroupReadReq = {
      id: 'foo',
      name: 'bar',
    };
  
    const authGroupReadRes = await expectAudit(() =>
      postAdmin('auth/group/read', readBody),
      'auth/group/read',
      ['Admin'],
      404
    );
  
    const authGroupDeleteRes = await expectAudit(() =>
      postAdmin('/auth/group/delete', readBody),
      '/auth/group/delete',
      ['Admin'],
      404
    );
  
    const createBody: AuthGroupCreateReq = {
      name: 'group1',
    };
  
    const authGroupCreateRes = await expectAudit(() =>
      postAdmin('/auth/group/create', createBody),
      '/auth/group/create'
    );
  
    const authGroupCreateRes2 = await expectAudit(() =>
      postAdmin('/auth/group/create', {
        id: authGroupCreateRes.data.id,
        ...createBody,
      }),
      '/auth/group/create',
      ['Admin'],
      409
    );
  
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
  
    const readGroups = await expectAudit(() =>
      postAdmin('auth/groups/read', readGroupsBody),
      'auth/groups/read',
      ['Admin'],
      404
    );
  
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
  
    const updateRetVal = await expectAudit(() =>
      postAdmin('auth/group/dashboard/update', updateBody),
      'auth/group/dashboard/update',
      ['Admin'],
      404
    );
  
    const deleteBody: AuthGroupDashboardDeleteReq = {
      dashboardIds: [],
      id: 'foo',
      name: 'bar',
    };
  
    const deleteRetVal = await expectAudit(() =>
      postAdmin('auth/group/dashboard/delete', deleteBody),
      'auth/group/dashboard/delete',
      ['Admin'],
      400
    );
  
    const deleteBody2: AuthGroupDashboardDeleteReq = {
      dashboardIds: ['foo', 'bar'],
      name: authGroupCreateRes.data.name,
      id: authGroupCreateRes.data.id,
    };
  
    const delete2RetVal = await expectAudit(() =>
      postAdmin('auth/group/dashboard/delete', deleteBody2),
      'auth/group/dashboard/delete',
      ['Admin'],
      404
    );
  });
  
  it('should update dashboards subdocuments', async () => {
    const body: DashboardCreateReq = {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: {},
    };
  
    const createRetVal = await expectAudit(
      () => postAdmin('dashboard/create', body),
      'dashboard/create'
    );
  
    const authGroupCreateRes = await expectAudit(
      () => postAdmin('auth/group/create', { name: 'group1' }),
      'auth/group/create'
    );
  
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
  
    const groupDashCreateRes = await expectAudit(
      () => postAdmin('auth/group/dashboard/create', createBody),
      'auth/group/dashboard/create'
    );
  
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
  
    const groupDashUpdateRes = await expectAudit(
      () => postAdmin('auth/group/dashboard/update', updateBody),
      'auth/group/dashboard/update'
    );

    expect(groupDashUpdateRes.data.dashboards).toMatchObject(updateBody.dashboards);
  
    const readBody: DashboardGroupAuthReadReq = {
      id: createRetVal.data.id,
      from: 1,
      to: 20,
      filters: {},
    };
  
    const readRetVal2 = await expectAudit(
      () => postAdmin('dashboard/group/auth/read', readBody),
      'dashboard/group/auth/read'
    );
  
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
  
    const readRetVal3 = await expectAudit(
      () => postAdmin('/auth/group/dashboards/read', readBody2),
      '/auth/group/dashboards/read'
    );
  
    expect(readRetVal3.data.dashboards).toMatchObject(groupDashUpdateRes.data.dashboards);
  });
  
   it('should update a authGroup and its reference in a dashboard', async () => {
     const body: DashboardCreateReq = {
       owner: 'Joe',
       name: 'PontusVision',
       folder: 'folder 1',
       state: {},
     };

     const createRetVal = (await postAdmin(
       'dashboard/create',
       body,
     )) as AxiosResponse<DashboardCreateRes>;

     const authGroupCreateRes = (await postAdmin('auth/group/create', {
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
     const groupDashCreateRes = (await postAdmin(
       'auth/group/dashboard/create',
       createBody,
     )) as AxiosResponse<AuthGroupDashboardCreateRes>;

     const readBody: AuthGroupReadReq = {
       id: authGroupCreateRes.data.id,
       name: authGroupCreateRes.data.name,
     };

     const authGroupReadRes = (await postAdmin(
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
  
    const createRetVal = await expectAudit(() =>
      postAdmin('dashboard/create', body),
      'dashboard/create'
    );
  
    const authGroupCreateRes = await expectAudit(() =>
      postAdmin('auth/group/create', { name: 'group1' }),
      'auth/group/create'
    );
  
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
  
    const groupDashCreateRes = await expectAudit(() =>
      postAdmin('auth/group/dashboard/create', createBody),
      'auth/group/dashboard/create'
    );
  
    const readBody4: AuthGroupDashboardsReadReq = {
      id: authGroupCreateRes.data.id,
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
  
    const readRetVal4 = await expectAudit(() =>
      postAdmin('/auth/group/dashboards/read', readBody4),
      '/auth/group/dashboards/read'
    );
  
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
  
    const readRetVal5 = await expectAudit(() =>
      postAdmin('dashboard/group/auth/read', readBody5),
      'dashboard/group/auth/read'
    );
  
    expect(readRetVal4.data.dashboards[0]).toMatchObject(
      createBody.dashboards[0]
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
  
    const readRetVal = await expectAudit(() =>
      postAdmin('auth/group/dashboard/delete', deleteBody),
      'auth/group/dashboard/delete'
    );
  
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
  
    const readRetVal2 = await expectAudit(() =>
      postAdmin('dashboard/group/auth/read', readBody),
      'dashboard/group/auth/read',
      ['Admin'],
      404
    );
  
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
  
    const readRetVal3 = await expectAudit(() =>
      postAdmin('/auth/group/dashboards/read', readBody2),
      '/auth/group/dashboards/read',
      ['Admin'],
      404
    );
  });
  
  it('should create a an authgroup, associate a dashboard and delete it, and its reference in the dashboard', async () => {
    const body: DashboardCreateReq = {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: {},
    };
  
    const createRetVal = await expectAudit(
      () => postAdmin('dashboard/create', body),
      'dashboard/create'
    );
  
    const authGroupCreateRes = await expectAudit(
      () => postAdmin('auth/group/create', { name: 'group1' }),
      'auth/group/create'
    );
  
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
  
    await expectAudit(
      () => postAdmin('auth/group/dashboard/create', createBody),
      'auth/group/dashboard/create'
    );
  
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
  
    const readRetVal = await expectAudit(
      () => postAdmin('dashboard/group/auth/read', readBody),
      'dashboard/group/auth/read'
    );
  
    expect(readRetVal.data.authGroups[0].name).toBe(authGroupCreateRes.data.name);
  
    const deleteBody: AuthGroupDeleteReq = {
      id: authGroupCreateRes.data.id,
      name: authGroupCreateRes.data.name,
    };
  
    await expectAudit(
      () => postAdmin('/auth/group/delete', deleteBody),
      '/auth/group/delete'
    );
  
    await expectAudit(
      () => postAdmin('dashboard/group/auth/read', readBody),
      'dashboard/group/auth/read', undefined, 404
    );
  });
  
  it('should UPDATE dashboards subdocuments incorreclty', async () => {
    const body: DashboardCreateReq = {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: {},
    };
  
    const createRetVal = await expectAudit(() =>
      postAdmin('dashboard/create', body),
      'dashboard/create'
    );
  
    const authGroupCreateRes = await expectAudit(() =>
      postAdmin('auth/group/create', { name: 'group1' }),
      'auth/group/create'
    );
  
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
  
    const readRetVal = await expectAudit(() =>
      postAdmin('auth/group/dashboard/update', deleteBody),
      'auth/group/dashboard/update',
      ['Admin'],
      404
    );
  });
  
  it('should associate a dashboard to an incorrect authGroup', async () => {
    const dashboardBody: DashboardCreateReq = {
      name: 'dashboard1',
      owner: 'foo',
    };
  
    const dashboardRes = await expectAudit(() =>
      postAdmin('dashboard/create', dashboardBody),
      'dashboard/create'
    );
  
    const groupBody: AuthGroupCreateReq = { name: 'group1' };
  
    const groupRes = await expectAudit(() =>
      postAdmin('auth/group/create', groupBody),
      'auth/group/create'
    );
  
    // Attempt invalid associations
    const invalidAssociations: AuthGroupDashboardCreateReq[] = [
      {
        dashboards: [{
          name: 'foo',
          id: 'bar',
          create: false,
          delete: true,
          read: false,
          update: true
        }],
        name: groupRes.data.name,
        id: groupRes.data.id,
      },
      {
        dashboards: [{
          name: 'foo',
          id: 'bar',
          create: false,
          delete: true,
          read: false,
          update: true
        }],
        name: 'foo',
        id: 'bar',
      },
      {
        dashboards: [{
          name: dashboardRes.data.name,
          id: dashboardRes.data.id,
          create: false,
          delete: true,
          read: false,
          update: true
        }],
        name: 'foo',
        id: 'bar',
      },
    ];
  
    for (const body of invalidAssociations) {
      await expectAudit(() =>
        postAdmin('auth/group/dashboard/create', body),
        'auth/group/dashboard/create',
        ['Admin'],
        404
      );
    }
  });
  
   
  it('should create an authgroup, associate an authuser and delete it, and its reference in the dashboard', async () => {
    const body: AuthGroupCreateReq = {
      name: 'group1',
    };
  
    const createRetVal = await expectAudit(() =>
      postAdmin('auth/group/create', body),
      'auth/group/create'
    );
  
    const createBody: AuthGroupUsersCreateReq = {
      authUsers: [
        {
          id: admin.id,
          username: admin.username,
        },
      ],
      id: createRetVal.data.id,
      name: createRetVal.data.name,
    };
  
    const groupUserCreateRes = await expectAudit(() =>
      postAdmin('auth/group/users/create', createBody),
      'auth/group/users/create'
    );
  
    const readBody: AuthGroupUsersReadReq = {
      id: createRetVal.data.id,
      filters: {},
    };
  
    const readRetVal = await expectAudit(() =>
      postAdmin('auth/group/users/read', readBody),
      'auth/group/users/read'
    );
  
    expect(readRetVal.data.authUsers[0].username).toBe(admin.username);
  
    const deleteBody: AuthGroupDeleteReq = {
      id: createRetVal.data.id,
      name: createRetVal.data.name,
    };
  
    await expectAudit(() =>
      postAdmin('/auth/group/delete', deleteBody),
      '/auth/group/delete'
    );
  
    await expectAudit(() =>
      postAdmin('auth/group/users/read', readBody),
      'auth/group/users/read',
      ['Admin'],
      404
    );
  });
  
  it('should update a authGroup and its reference in a authUser', async () => {
    const body: AuthGroupCreateReq = {
      name: 'group1',
    };
  
    const createRetVal = await expectAudit(
      () => postAdmin('auth/group/create', body),
      'auth/group/create'
    );
  
    const createBody: AuthGroupUsersCreateReq = {
      authUsers: [
        {
          id: admin.id,
          username: admin.username,
        },
      ],
      id: createRetVal.data.id,
      name: createRetVal.data.name,
    };
  
    const groupUserCreateRes = await expectAudit(
      () => postAdmin('auth/group/users/create', createBody),
      'auth/group/users/create'
    );
  
    const readBody: AuthGroupUsersReadReq = {
      id: createRetVal.data.id,
      filters: {
        username: {
          condition1: {
            filter: admin.username,
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };
  
    const readRetVal = await expectAudit(
      () => postAdmin('auth/group/users/read', readBody),
      'auth/group/users/read'
    );
  
    expect(readRetVal.data.authUsers[0].username).toBe(admin.username);
  
    const updateBody: AuthGroupUpdateReq = {
      name: createRetVal.data.name,
      id: createRetVal.data.id,
    };
  
    const groupUserUpdateRes = await expectAudit(
      () => postAdmin('auth/group/update', updateBody),
      'auth/group/update'
    );
  
    const deleteBody: AuthGroupDeleteReq = {
      id: createRetVal.data.id,
      name: createRetVal.data.name,
    };
  
    const authGroupDeleteRes = await expectAudit(
      () => postAdmin('auth/group/delete', deleteBody),
      'auth/group/delete'
    );
  
    const readRetVal2 = await expectAudit(
      () => postAdmin('auth/group/users/read', readBody),
      'auth/group/users/read',
      ['Admin'],
      404
    );
  });
  
  it('should create an authgroup, associate an authuser and delete its reference', async () => {
    const body: AuthGroupCreateReq = {
      name: 'group1',
    };
  
    const createRetVal = await expectAudit(
      () => postAdmin('auth/group/create', body),
      'auth/group/create'
    );
  
    const createBody: AuthGroupUsersCreateReq = {
      authUsers: [
        {
          id: admin.id,
          username: admin.username,
        },
      ],
      id: createRetVal.data.id,
      name: createRetVal.data.name,
    };
  
    const groupUserCreateRes = await expectAudit(
      () => postAdmin('auth/group/users/create', createBody),
      'auth/group/users/create'
    );
  
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
  
    const readRetVal = await expectAudit(
      () => postAdmin('auth/group/users/read', readBody),
      'auth/group/users/read'
    );
  
    expect(readRetVal.data.authUsers[0].username).toBe(admin.username);
  
    const deleteBody2: AuthGroupUsersDeleteReq = {
      id: createRetVal.data.id,
      name: createRetVal.data.name,
      authUsers: [{ id: admin.id, username: admin.username }],
    };
  
    const authGroupDeleteRes = await expectAudit(
      () => postAdmin('/auth/group/users/delete', deleteBody2),
      '/auth/group/users/delete'
    );
  
    const readRetVal2 = await expectAudit(
      () => postAdmin('auth/group/users/read', readBody),
      'auth/group/users/read',
      ['Admin'],
      404
    );
  });
  
  it('should create an authgroup, associate a table and delete its reference', async () => {
    const body: AuthGroupCreateReq = {
      name: 'group1',
    };
  
    const createGroupRetVal = await expectAudit(() =>
      postAdmin('auth/group/create', body),
      'auth/group/create'
    );
  
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
          pivotIndex: 1,
          kind: 'text',
        },
        {
          field: 'Person_Natural_Customer_ID',
          filter: true,
          headerName: 'Customer ID',
          id: 'Person_Natural_Customer_ID',
          name: 'customer-id',
          sortable: true,
          pivotIndex: 2,
          kind: 'text',
        },
      ],
    };
  
    const createTableRetVal = await expectAudit(() =>
      postAdmin('table/create', tableBody),
      'table/create'
    );
  
    const createGroupTablesBody: AuthGroupTablesCreateReq = {
      id: createGroupRetVal.data.id,
      name: createGroupRetVal.data.name,
      tables: [
        { id: createTableRetVal.data.id, name: createTableRetVal.data.name },
      ],
    };
  
    const groupTablesCreateRes = await expectAudit(() =>
      postAdmin('auth/group/tables/create', createGroupTablesBody),
      'auth/group/tables/create'
    );
  
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
  
    const readRetVal = await expectAudit(() =>
      postAdmin('auth/group/tables/read', readBody),
      'auth/group/tables/read'
    );
  
    expect(readRetVal.data.tables[0].id).toBe(createTableRetVal.data.id);
  
    const deleteBody2: AuthGroupTablesDeleteReq = {
      id: createGroupRetVal.data.id,
      name: createGroupRetVal.data.name,
      tables: [
        { name: createTableRetVal.data.name, id: createTableRetVal.data.id },
      ],
    };
  
    const authGroupDeleteRes = await expectAudit(() =>
      postAdmin('/auth/group/tables/delete', deleteBody2),
      '/auth/group/tables/delete'
    );
  
    await expectAudit(() =>
      postAdmin('auth/group/tables/read', readBody),
      'auth/group/tables/read',
      ['Admin'],
      404
    );
  });
  
  it('should do the crud of Dashboard Auth', async () => {
    const createAuthGroup: AuthGroupCreateReq = {
      name: 'group1',
      dashboardCrud: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      tableMetadataCrud: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    };
  
    const authGroupCreateRes = await expectAudit(() =>
      postAdmin('/auth/group/create', createAuthGroup),
      '/auth/group/create'
    );
  
    const readGroup: AuthGroupReadReq = {
      id: authGroupCreateRes.data.id,
      name: authGroupCreateRes.data.name,
    };
  
    const authGroupReadRes = await expectAudit(() =>
      postAdmin('/auth/group/read', readGroup),
      '/auth/group/read'
    );
  
    expect(authGroupReadRes.data.tableMetadataCrud).toMatchObject(createAuthGroup.tableMetadataCrud);
  });
  
});
