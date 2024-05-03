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
    await deleteContainer(AUTH_GROUPS);
    await deleteContainer(DASHBOARDS);
    await deleteDatabase('pv_db');
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    srv.close();
  });

  it('should create a group', async () => {
    const createBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await post(
      '/auth/group/create',
      createBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    expect(authGroupCreateRes.data).toMatchObject(createBody);

    const readBody: AuthGroupReadReq = {
      id: authGroupCreateRes.data.id,
    };

    const authGroupReadRes = (await post(
      '/auth/group/read',
      readBody,
    )) as AxiosResponse<AuthGroupReadRes>;

    expect(authGroupReadRes.status).toBe(200);

    expect(authGroupReadRes.data).toMatchObject(authGroupCreateRes.data);

    const updateBody: AuthGroupUpdateReq = {
      id: authGroupCreateRes.data.id,
      name: 'foo',
    };

    const authGroupUpdateRes = (await post(
      '/auth/group/update',
      updateBody,
    )) as AxiosResponse<AuthGroupCreateRes>;

    expect(authGroupUpdateRes.status).toBe(200);
    expect(authGroupUpdateRes.data).toMatchObject(updateBody);
    const deleteBody: AuthGroupDeleteReq = {
      id: authGroupCreateRes.data.id,
    };

    const authGroupDeleteRes = (await post(
      '/auth/group/delete',
      deleteBody,
    )) as AxiosResponse<AuthGroupDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);
  });
  it('should read many groups', async () => {
    const createBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await post(
      'auth/group/create',
      createBody,
    )) as AxiosResponse<AuthGroupCreateRes>;

    const createBody2: AuthGroupCreateReq = {
      name: 'group2',
    };

    const authGroupCreateRes2 = (await post(
      'auth/group/create',
      createBody,
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

    const readGroups = (await post(
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
    };

    const authGroupReadRes = (await post(
      'auth/group/read',
      readBody,
    )) as AxiosResponse<AuthGroupReadRes>;
    expect(authGroupReadRes.status).toBe(404);
    const authGroupUpdateRes = (await post(
      '/auth/group/update',
      readBody,
    )) as AxiosResponse<AuthGroupCreateRes>;

    expect(authGroupUpdateRes.status).toBe(404);

    const authGroupDeleteRes = (await post(
      '/auth/group/delete',
      readBody,
    )) as AxiosResponse<AuthGroupCreateRes>;

    expect(authGroupDeleteRes.status).toBe(404);

    const createBody: AuthGroupCreateReq = {
      name: 'group1',
    };

    const authGroupCreateRes = (await post(
      '/auth/group/create',
      createBody,
    )) as AxiosResponse<AuthGroupCreateRes>;
    expect(authGroupCreateRes.status).toBe(200);

    const authGroupCreateRes2 = (await post('/auth/group/create', {
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

    const readGroups = (await post(
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
    };

    const updateRetVal = (await post(
      'auth/group/dashboard/update',
      updateBody,
    )) as AxiosResponse<DashboardGroupAuthUpdateRes>;

    expect(updateRetVal.status).toBe(404);

    const deleteBody: AuthGroupDashboardDeleteReq = {
      dashboardIds: [],
      id: 'foo',
    };
    const deleteRetVal = (await post(
      'auth/group/dashboard/delete',
      deleteBody,
    )) as AxiosResponse<DashboardGroupAuthDeleteRes>;

    expect(deleteRetVal.status).toBe(400);

    const delete2RetVal = (await post('auth/group/dashboard/delete', {
      dashboardIds: ['foo', 'bar'],
      id: authGroupCreateRes.data.id,
    })) as AxiosResponse<DashboardGroupAuthDeleteRes>;
    expect(delete2RetVal.status).toBe(404);
  });
  it('should create dashboards subdocuments', async () => {
    const body: DashboardCreateReq = {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: {},
    };

    const createRetVal = (await post(
      'dashboard/create',
      body,
    )) as AxiosResponse<DashboardCreateRes>;

    const authGroupCreateRes = (await post('auth/group/create', {
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

    const groupDashCreateRes = (await post(
      'auth/group/dashboard/create',
      createBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(groupDashCreateRes.data.dashboards).toMatchObject(
      createBody.dashboards,
    );

    expect(groupDashCreateRes.data.dashboards).toMatchObject(
      createBody.dashboards,
    );

    const readBody: DashboardGroupAuthReadReq = {
      dashboardId: createRetVal.data.id,
      filters: {
        groupName: {
          condition1: {
            filter: 'group1',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal = (await post(
      'dashboard/group/auth/read',
      readBody,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;

    expect(readRetVal.data.authGroups[0]).toMatchObject({
      groupName: authGroupCreateRes.data.name,
      groupId: authGroupCreateRes.data.id,
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

    const createRetVal = (await post(
      'dashboard/create',
      body,
    )) as AxiosResponse<DashboardCreateRes>;

    const authGroupCreateRes = (await post('auth/group/create', {
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
    const groupDashCreateRes = (await post(
      'auth/group/dashboard/create',
      createBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(groupDashCreateRes.status).toBe(200);

    const updateBody: AuthGroupDashboardUpdateReq = {
      id: authGroupId,
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

    const groupDashUpdateRes = (await post(
      'auth/group/dashboard/update',
      updateBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(groupDashUpdateRes.status).toBe(200);

    expect(groupDashUpdateRes.data.dashboards).toMatchObject(
      updateBody.dashboards,
    );

    const readBody: DashboardGroupAuthReadReq = {
      dashboardId: createRetVal.data.id,
      from: 1,
      to: 20,
      filters: {
        // groupName: {
        //   // condition1: {
        //   filter: 'Pontus',
        //   filterType: 'text',
        //   type: 'contains',
        //   // },
        //   // filterType: 'text',
        // },
      },
    };

    const readRetVal2 = (await post(
      'dashboard/group/auth/read',
      readBody,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;
    expect(readRetVal2.data?.authGroups[0]).toMatchObject({
      groupName: authGroupCreateRes.data.name,
      groupId: authGroupCreateRes.data.id,
      create: true,
      delete: true,
      read: true,
      update: true,
    });

    const readBody2: AuthGroupDashboardsReadReq = {
      id: authGroupId,

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

    const readRetVal3 = (await post(
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

    const createRetVal = (await post(
      'dashboard/create',
      body,
    )) as AxiosResponse<DashboardCreateRes>;

    const authGroupCreateRes = (await post('auth/group/create', {
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
    const groupDashCreateRes = (await post(
      'auth/group/dashboard/create',
      createBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(groupDashCreateRes.status).toBe(200);

    const updateBody: AuthGroupUpdateReq = {
      id: authGroupCreateRes.data.id,
      name: 'foo',
    };

    const authGroupUpdateRes = (await post(
      '/auth/group/update',
      updateBody,
    )) as AxiosResponse<AuthGroupCreateRes>;

    expect(authGroupUpdateRes.status).toBe(200);

    const readBody: AuthGroupReadReq = {
      id: authGroupCreateRes.data.id,
    };

    const authGroupReadRes = (await post(
      '/auth/group/read',
      readBody,
    )) as AxiosResponse<AuthGroupReadRes>;

    expect(authGroupReadRes.data.name).toBe(updateBody.name);
  });
  it('should delete dashboards subdocuments', async () => {
    const body: DashboardCreateReq = {
      owner: 'Joe',
      name: 'PontusVision',
      folder: 'folder 1',
      state: {},
    };

    const createRetVal = (await post(
      'dashboard/create',
      body,
    )) as AxiosResponse<DashboardCreateRes>;

    const authGroupCreateRes = (await post('auth/group/create', {
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

    const groupDashCreateRes = (await post(
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

    const readRetVal4 = (await post(
      '/auth/group/dashboards/read',
      readBody4,
    )) as AxiosResponse<AuthGroupDashboardsReadRes>;

    const readBody5: DashboardGroupAuthReadReq = {
      dashboardId: createRetVal.data.id,
      from: 1,
      to: 10,
      filters: {
        groupName: {
          condition1: {
            filter: 'group1',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal5 = (await post(
      'dashboard/group/auth/read',
      readBody5,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;

    expect(readRetVal4.data.dashboards[0]).toMatchObject(
      createBody.dashboards[0],
    );
    expect(readRetVal5.data.authGroups[0]).toMatchObject({
      groupName: authGroupCreateRes.data.name,
      groupId: authGroupCreateRes.data.id,
      create: false,
      delete: true,
      read: false,
      update: true,
    });

    const deleteBody: AuthGroupDashboardDeleteReq = {
      dashboardIds: [createRetVal.data.id],
      id: authGroupId,
    };

    const readRetVal = (await post(
      'auth/group/dashboard/delete',
      deleteBody,
    )) as AxiosResponse<DashboardGroupAuthDeleteRes>;

    expect(readRetVal.status).toBe(200);

    const readBody: DashboardGroupAuthReadReq = {
      dashboardId: createRetVal.data.id,
      filters: {
        groupName: {
          condition1: {
            filter: 'group1',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal2 = (await post(
      'dashboard/group/auth/read',
      readBody,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;

    const readBody2: AuthGroupDashboardsReadReq = {
      id: authGroupId,
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

    const readRetVal3 = (await post(
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

    const createRetVal = (await post(
      'dashboard/create',
      body,
    )) as AxiosResponse<DashboardCreateRes>;

    const authGroupCreateRes = (await post('auth/group/create', {
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

    const groupDashCreateRes = (await post(
      'auth/group/dashboard/create',
      createBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    const readBody: DashboardGroupAuthReadReq = {
      dashboardId: createRetVal.data.id,
      filters: {
        groupName: {
          condition1: {
            filter: 'group1',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal = (await post(
      'dashboard/group/auth/read',
      readBody,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;

    expect(readRetVal.data.authGroups[0].groupName).toBe(
      authGroupCreateRes.data.name,
    );

    const deleteBody: AuthGroupDeleteReq = {
      id: authGroupCreateRes.data.id,
    };

    const authGroupDeleteRes = (await post(
      '/auth/group/delete',
      deleteBody,
    )) as AxiosResponse<AuthGroupDeleteRes>;

    expect(authGroupDeleteRes.status).toBe(200);

    const readRetVal2 = (await post(
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

    const createRetVal = (await post(
      'dashboard/create',
      body,
    )) as AxiosResponse<DashboardCreateRes>;

    const authGroupCreateRes = (await post('auth/group/create', {
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
      id: authGroupId,
    };

    const readRetVal = (await post(
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

    const groupDashCreateRes = (await post(
      'auth/group/dashboard/create',
      createBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(groupDashCreateRes.status).toBe(404);
  });
});
