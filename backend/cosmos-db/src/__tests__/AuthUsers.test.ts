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
} from '../typescript/api';
// import { sendHttpRequest } from '../http';
// import { method } from 'lodash';
// import axios from 'axios';
import { srv } from '../server';

import { post } from './test-utils';
import { AxiosResponse } from 'axios';
import { deleteContainer } from '../cosmos-utils';

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
    await deleteContainer('auth_users');
    // await deleteContainer('auth_groups');
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
  // it('should create dashboards subdocuments', async () => {
  //   const body: DashboardCreateReq = {
  //     owner: 'Joe',
  //     name: 'PontusVision',
  //     folder: 'folder 1',
  //     state: {},
  //   };

  //   const createRetVal = (await post(
  //     'dashboard/create',
  //     body,
  //   )) as AxiosResponse<DashboardCreateRes>;

  //   const authGroupCreateRes = (await post('auth/group/create', {
  //     name: 'group1',
  //   })) as AxiosResponse<AuthUserCreateRes>;

  //   const authGroupId = authGroupCreateRes.data.id;

  //   const createBody: AuthUserDashboardCreateReq = {
  //     dashboards: [
  //       {
  //         name: createRetVal.data.name,
  //         id: createRetVal.data.id,
  //         create: false,
  //         delete: true,
  //         read: false,
  //         update: true,
  //       },
  //     ],
  //     id: authGroupId,
  //     name: authGroupCreateRes.data.name,
  //   };

  //   const groupDashCreateRes = (await post(
  //     'auth/group/dashboard/create',
  //     createBody,
  //   )) as AxiosResponse<AuthUserDashboardCreateRes>;

  //   expect(groupDashCreateRes.data.dashboards).toMatchObject(
  //     createBody.dashboards,
  //   );

  //   expect(groupDashCreateRes.data.dashboards).toMatchObject(
  //     createBody.dashboards,
  //   );

  //   const readBody: DashboardGroupAuthReadReq = {
  //     dashboardId: createRetVal.data.id,
  //     filters: {
  //       groupName: {
  //         condition1: {
  //           filter: 'group1',
  //           filterType: 'text',
  //           type: 'contains',
  //         },
  //         filterType: 'text',
  //       },
  //     },
  //   };

  //   const readRetVal = (await post(
  //     'dashboard/group/auth/read',
  //     readBody,
  //   )) as AxiosResponse<DashboardGroupAuthReadRes>;

  //   expect(readRetVal.data.authGroups[0]).toMatchObject({
  //     groupName: authGroupCreateRes.data.name,
  //     groupId: authGroupCreateRes.data.id,
  //     create: false,
  //     delete: true,
  //     read: false,
  //     update: true,
  //   });
  // });
  // it('should update dashboards subdocuments', async () => {
  //   const body: DashboardCreateReq = {
  //     owner: 'Joe',
  //     name: 'PontusVision',
  //     folder: 'folder 1',
  //     state: {},
  //   };

  //   const createRetVal = (await post(
  //     'dashboard/create',
  //     body,
  //   )) as AxiosResponse<DashboardCreateRes>;

  //   const authGroupCreateRes = (await post('auth/group/create', {
  //     name: 'group1',
  //   })) as AxiosResponse<AuthUserCreateRes>;

  //   const authGroupId = authGroupCreateRes.data.id;

  //   const createBody: AuthUserDashboardCreateReq = {
  //     dashboards: [
  //       {
  //         name: createRetVal.data.name,
  //         id: createRetVal.data.id,
  //         create: false,
  //         delete: true,
  //         read: false,
  //         update: true,
  //       },
  //     ],
  //     id: authGroupId,
  //     name: authGroupCreateRes.data.name,
  //   };
  //   const groupDashCreateRes = (await post(
  //     'auth/group/dashboard/create',
  //     createBody,
  //   )) as AxiosResponse<AuthUserDashboardCreateRes>;

  //   expect(groupDashCreateRes.status).toBe(200);

  //   const updateBody: AuthUserDashboardUpdateReq = {
  //     id: authGroupId,
  //     dashboards: [
  //       {
  //         name: createRetVal.data.name,
  //         id: createRetVal.data.id,
  //         create: true,
  //         delete: true,
  //         read: true,
  //         update: true,
  //       },
  //     ],
  //   };

  //   const groupDashUpdateRes = (await post(
  //     'auth/group/dashboard/update',
  //     updateBody,
  //   )) as AxiosResponse<AuthUserDashboardCreateRes>;

  //   expect(groupDashUpdateRes.status).toBe(200);

  //   expect(groupDashUpdateRes.data.dashboards).toMatchObject(
  //     updateBody.dashboards,
  //   );

  //   const readBody: DashboardGroupAuthReadReq = {
  //     dashboardId: createRetVal.data.id,
  //     from: 1,
  //     to: 20,
  //     filters: {
  //       // groupName: {
  //       //   // condition1: {
  //       //   filter: 'Pontus',
  //       //   filterType: 'text',
  //       //   type: 'contains',
  //       //   // },
  //       //   // filterType: 'text',
  //       // },
  //     },
  //   };

  //   const readRetVal2 = (await post(
  //     'dashboard/group/auth/read',
  //     readBody,
  //   )) as AxiosResponse<DashboardGroupAuthReadRes>;
  //   expect(readRetVal2.data?.authGroups[0]).toMatchObject({
  //     groupName: authGroupCreateRes.data.name,
  //     groupId: authGroupCreateRes.data.id,
  //     create: true,
  //     delete: true,
  //     read: true,
  //     update: true,
  //   });

  //   const readBody2: AuthUserDashboardsReadReq = {
  //     id: authGroupId,

  //     filters: {
  //       name: {
  //         condition1: {
  //           filter: createRetVal.data.name,
  //           filterType: 'text',
  //           type: 'contains',
  //         },
  //         filterType: 'text',
  //       },
  //     },
  //   };

  //   const readRetVal3 = (await post(
  //     '/auth/group/dashboards/read',
  //     readBody2,
  //   )) as AxiosResponse<AuthUserDashboardsReadRes>;

  //   expect(readRetVal3.data.dashboards).toMatchObject(
  //     groupDashUpdateRes.data.dashboards,
  //   );
  // });
  // it('should update a authGroup and its reference in a dashboard', async () => {
  //   const body: DashboardCreateReq = {
  //     owner: 'Joe',
  //     name: 'PontusVision',
  //     folder: 'folder 1',
  //     state: {},
  //   };

  //   const createRetVal = (await post(
  //     'dashboard/create',
  //     body,
  //   )) as AxiosResponse<DashboardCreateRes>;

  //   const authGroupCreateRes = (await post('auth/group/create', {
  //     name: 'group1',
  //   })) as AxiosResponse<AuthUserCreateRes>;

  //   const createBody: AuthUserDashboardCreateReq = {
  //     dashboards: [
  //       {
  //         name: createRetVal.data.name,
  //         id: createRetVal.data.id,
  //         create: false,
  //         delete: true,
  //         read: false,
  //         update: true,
  //       },
  //     ],
  //     id: authGroupCreateRes.data.id,
  //     name: authGroupCreateRes.data.name,
  //   };
  //   const groupDashCreateRes = (await post(
  //     'auth/group/dashboard/create',
  //     createBody,
  //   )) as AxiosResponse<AuthUserDashboardCreateRes>;

  //   expect(groupDashCreateRes.status).toBe(200);

  //   const updateBody: AuthUserUpdateReq = {
  //     id: authGroupCreateRes.data.id,
  //     name: 'foo',
  //   };

  //   const authGroupUpdateRes = (await post(
  //     '/auth/group/update',
  //     updateBody,
  //   )) as AxiosResponse<AuthUserCreateRes>;

  //   expect(authGroupUpdateRes.status).toBe(200);

  //   const readBody: AuthUserReadReq = {
  //     id: authGroupCreateRes.data.id,
  //   };

  //   const authGroupReadRes = (await post(
  //     '/auth/group/read',
  //     readBody,
  //   )) as AxiosResponse<AuthUserReadRes>;

  //   expect(authGroupReadRes.data.name).toBe(updateBody.name);
  // });
  // it('should delete dashboards subdocuments', async () => {
  //   const body: DashboardCreateReq = {
  //     owner: 'Joe',
  //     name: 'PontusVision',
  //     folder: 'folder 1',
  //     state: {},
  //   };

  //   const createRetVal = (await post(
  //     'dashboard/create',
  //     body,
  //   )) as AxiosResponse<DashboardCreateRes>;

  //   const authGroupCreateRes = (await post('auth/group/create', {
  //     name: 'group1',
  //   })) as AxiosResponse<AuthUserCreateRes>;

  //   const authGroupId = authGroupCreateRes.data.id;

  //   const createBody: AuthUserDashboardCreateReq = {
  //     dashboards: [
  //       {
  //         name: createRetVal.data.name,
  //         id: createRetVal.data.id,
  //         create: false,
  //         delete: true,
  //         read: false,
  //         update: true,
  //       },
  //     ],
  //     name: authGroupCreateRes.data.name,
  //     id: authGroupId,
  //   };

  //   const groupDashCreateRes = (await post(
  //     'auth/group/dashboard/create',
  //     createBody,
  //   )) as AxiosResponse<AuthUserDashboardCreateRes>;

  //   expect(groupDashCreateRes.data.dashboards).toMatchObject(
  //     createBody.dashboards,
  //   );

  //   expect(groupDashCreateRes.data.dashboards).toMatchObject(
  //     createBody.dashboards,
  //   );

  //   const readBody4: AuthUserDashboardsReadReq = {
  //     id: groupDashCreateRes.data.id,
  //     filters: {
  //       name: {
  //         condition1: {
  //           filter: createRetVal.data.name,
  //           filterType: 'text',
  //           type: 'contains',
  //         },
  //         filterType: 'text',
  //       },
  //     },
  //   };

  //   const readRetVal4 = (await post(
  //     '/auth/group/dashboards/read',
  //     readBody4,
  //   )) as AxiosResponse<AuthUserDashboardsReadRes>;

  //   const readBody5: DashboardGroupAuthReadReq = {
  //     dashboardId: createRetVal.data.id,
  //     from: 1,
  //     to: 10,
  //     filters: {
  //       groupName: {
  //         condition1: {
  //           filter: 'group1',
  //           filterType: 'text',
  //           type: 'contains',
  //         },
  //         filterType: 'text',
  //       },
  //     },
  //   };

  //   const readRetVal5 = (await post(
  //     'dashboard/group/auth/read',
  //     readBody5,
  //   )) as AxiosResponse<DashboardGroupAuthReadRes>;

  //   expect(readRetVal4.data.dashboards[0]).toMatchObject(
  //     createBody.dashboards[0],
  //   );
  //   expect(readRetVal5.data.authGroups[0]).toMatchObject({
  //     groupName: authGroupCreateRes.data.name,
  //     groupId: authGroupCreateRes.data.id,
  //     create: false,
  //     delete: true,
  //     read: false,
  //     update: true,
  //   });

  //   const deleteBody: AuthUserDashboardDeleteReq = {
  //     dashboardIds: [createRetVal.data.id],
  //     id: authGroupId,
  //   };

  //   const readRetVal = (await post(
  //     'auth/group/dashboard/delete',
  //     deleteBody,
  //   )) as AxiosResponse<DashboardGroupAuthDeleteRes>;

  //   expect(readRetVal.status).toBe(200);

  //   const readBody: DashboardGroupAuthReadReq = {
  //     dashboardId: createRetVal.data.id,
  //     filters: {
  //       groupName: {
  //         condition1: {
  //           filter: 'group1',
  //           filterType: 'text',
  //           type: 'contains',
  //         },
  //         filterType: 'text',
  //       },
  //     },
  //   };

  //   const readRetVal2 = (await post(
  //     'dashboard/group/auth/read',
  //     readBody,
  //   )) as AxiosResponse<DashboardGroupAuthReadRes>;

  //   const readBody2: AuthUserDashboardsReadReq = {
  //     id: authGroupId,
  //     filters: {
  //       name: {
  //         condition1: {
  //           filter: createRetVal.data.name,
  //           filterType: 'text',
  //           type: 'contains',
  //         },
  //         filterType: 'text',
  //       },
  //     },
  //   };

  //   const readRetVal3 = (await post(
  //     '/auth/group/dashboards/read',
  //     readBody2,
  //   )) as AxiosResponse<DashboardGroupAuthReadRes>;

  //   expect(readRetVal2.status).toBe(404);
  //   expect(readRetVal3.status).toBe(404);
  // });
  // it('should create a an authgroup, associate a dashboard and delete it, and its reference in the dashboard', async () => {
  //   const body: DashboardCreateReq = {
  //     owner: 'Joe',
  //     name: 'PontusVision',
  //     folder: 'folder 1',
  //     state: {},
  //   };

  //   const createRetVal = (await post(
  //     'dashboard/create',
  //     body,
  //   )) as AxiosResponse<DashboardCreateRes>;

  //   const authGroupCreateRes = (await post('auth/group/create', {
  //     name: 'group1',
  //   })) as AxiosResponse<AuthUserCreateRes>;

  //   const authGroupId = authGroupCreateRes.data.id;

  //   const createBody: AuthUserDashboardCreateReq = {
  //     dashboards: [
  //       {
  //         name: createRetVal.data.name,
  //         id: createRetVal.data.id,
  //         create: false,
  //         delete: true,
  //         read: false,
  //         update: true,
  //       },
  //     ],
  //     name: authGroupCreateRes.data.name,
  //     id: authGroupId,
  //   };

  //   const groupDashCreateRes = (await post(
  //     'auth/group/dashboard/create',
  //     createBody,
  //   )) as AxiosResponse<AuthUserDashboardCreateRes>;

  //   const readBody: DashboardGroupAuthReadReq = {
  //     dashboardId: createRetVal.data.id,
  //     filters: {
  //       groupName: {
  //         condition1: {
  //           filter: 'group1',
  //           filterType: 'text',
  //           type: 'contains',
  //         },
  //         filterType: 'text',
  //       },
  //     },
  //   };

  //   const readRetVal = (await post(
  //     'dashboard/group/auth/read',
  //     readBody,
  //   )) as AxiosResponse<DashboardGroupAuthReadRes>;

  //   expect(readRetVal.data.authGroups[0].groupName).toBe(
  //     authGroupCreateRes.data.name,
  //   );

  //   const deleteBody: AuthUserDeleteReq = {
  //     id: authGroupCreateRes.data.id,
  //   };

  //   const authGroupDeleteRes = (await post(
  //     '/auth/group/delete',
  //     deleteBody,
  //   )) as AxiosResponse<AuthUserDeleteRes>;

  //   expect(authGroupDeleteRes.status).toBe(200);

  //   const readRetVal2 = (await post(
  //     'dashboard/group/auth/read',
  //     readBody,
  //   )) as AxiosResponse<DashboardGroupAuthReadRes>;

  //   expect(readRetVal2.status).toBe(404);
  // });
  // it('should UPDATE dashboards subdocuments incorreclty', async () => {
  //   const body: DashboardCreateReq = {
  //     owner: 'Joe',
  //     name: 'PontusVision',
  //     folder: 'folder 1',
  //     state: {},
  //   };

  //   const createRetVal = (await post(
  //     'dashboard/create',
  //     body,
  //   )) as AxiosResponse<DashboardCreateRes>;

  //   const authGroupCreateRes = (await post('auth/group/create', {
  //     name: 'group1',
  //   })) as AxiosResponse<AuthUserCreateRes>;

  //   const authGroupId = authGroupCreateRes.data.id;

  //   const deleteBody: AuthUserDashboardUpdateReq = {
  //     dashboards: [
  //       {
  //         id: 'foo',
  //         create: true,
  //         read: true,
  //         update: true,
  //         delete: true,
  //         name: 'bar',
  //       },
  //     ],
  //     id: authGroupId,
  //   };

  //   const readRetVal = (await post(
  //     'auth/group/dashboard/update',
  //     deleteBody,
  //   )) as AxiosResponse<DashboardGroupAuthDeleteRes>;

  //   expect(readRetVal.status).toBe(404);
  // });
  // it('should associate a dashboard to an incorrect authGroup', async () => {
  //   const createBody: AuthUserDashboardCreateReq = {
  //     dashboards: [
  //       {
  //         name: 'foo',
  //         id: 'bar',
  //         create: false,
  //         delete: true,
  //         read: false,
  //         update: true,
  //       },
  //     ],
  //     name: 'foo',
  //     id: 'bar',
  //   };

  //   const groupDashCreateRes = (await post(
  //     'auth/group/dashboard/create',
  //     createBody,
  //   )) as AxiosResponse<AuthUserDashboardCreateRes>;

  //   expect(groupDashCreateRes.status).toBe(404);
  // });
});
