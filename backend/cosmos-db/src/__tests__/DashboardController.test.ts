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
} from '../typescript/api';
// import { sendHttpRequest } from '../http';
// import { method } from 'lodash';
// import axios from 'axios';
import { srv } from '../server';

import { post, stateObj } from './test-utils';
import { DashboardGroupAuthCreateReq } from '../generated/api';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { deleteContainer, deleteDatabase } from '../cosmos-utils';

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
    await deleteContainer('dashboards');
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
    srv.close();
  });

  it('should do the CRUD "happy path"', async () => {
    const body: DashboardRef = {
      name: 'string',
      folder: 'string',
      owner: 'string',
      state: {},
    };

    const createRetVal = await post('dashboard/create', body);

    let resPayload: DashboardCreateRes = createRetVal.data;
    let id = resPayload.id;

    expect(createRetVal.data.name).toBe(body.name);

    const readRetVal = await post('dashboard/read', {
      id,
    });
    let resPayload2: DashboardReadRes = readRetVal.data;

    console.log(`res2: ${JSON.stringify(resPayload2)}`);

    expect(readRetVal.data.name).toBe(body.name);

    const body2: DashboardUpdateReq = {
      id: resPayload2.id,
      owner: resPayload2.owner,
      name: 'Pontus 2',
      folder: resPayload2.folder,
      state: resPayload2.state,
    };

    const updateRetVal = await post('dashboard/update', body2);

    let resPayload3: DashboardUpdateRes = updateRetVal.data;

    expect(resPayload3.name).toBe(body2.name);

    const body3 = {
      id: resPayload3.id,
    };

    const deleteRetVal = await post('dashboard/delete', body3);

    let resPayload4 = deleteRetVal.data;

    expect(deleteRetVal.status).toBe(200);

    const readRetVal2 = await post('dashboard/read', body3);

    expect(readRetVal2.status).toBe(404);
  });
  it('should do the CRUD "sad path"', async () => {
    const createRetVal = await post('dashboard/create', {});

    expect(createRetVal.status).toBe(400);

    const readRetVal = await post('dashboard/read', {
      id: 'foo',
    });

    expect(readRetVal.status).toBe(404);

    const updateRetVal = await post('dashboard/update', { foo: 'bar' });

    expect(updateRetVal.status).toBe(422);

    const deleteRetVal = await post('dashboard/delete', { foo: 'bar' });

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

    const createRetVal = await post('dashboard/create', body);

    const createRetVal2 = await post('dashboard/create', {
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

    const readRetVal = await post('dashboards/read', readBody);

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

    const deleteVal = await post('dashboard/delete', {
      id: createRetVal.data.id,
    });

    expect(deleteVal.status).toBe(200);
    const deleteVal2 = await post('dashboard/delete', {
      id: createRetVal2.data.id,
    });

    expect(deleteVal2.status).toBe(200);
  });
  it('should create auth correctly in dashboard', async () => {
    const dashboardBody: DashboardCreateReq = {
      folder: 'folder',
      name: 'dashboard1',
      owner: 'foo',
      state: stateObj,
    };
    const createDashboard = (await post(
      'dashboard/create',
      dashboardBody,
    )) as AxiosResponse<DashboardCreateRes>;

    const createDashboard2 = (await post('dashboard/create', {
      ...dashboardBody,
      name: 'dashboard2',
    })) as AxiosResponse<DashboardCreateRes>;

    const createGroupAuthBody: DashboardGroupAuthCreateReq = {
      id: createDashboard.data.id,
      authGroups: [
        {
          create: true,
          delete: true,
          read: false,
          update: true,
          id: 'SomeGroupId',
          name: 'some title',
        },
      ],
    };

    const createGroupAuth = await post(
      'dashboard/group/auth/create',
      createGroupAuthBody,
    );

    expect(createGroupAuth.status).toBe(200);

    const createGroupAuth2Body: DashboardGroupAuthCreateReq = {
      ...createGroupAuthBody,
      authGroups: [
        {
          create: true,
          delete: true,
          read: false,
          update: true,
          name: 'foo',
          id: 'Pontus Vision 2',
        },
        {
          create: true,
          delete: true,
          read: false,
          update: true,
          name: 'bar',
          id: 'Pontus Vision',
        },
      ],
    };

    const createGroupAuth2 = await post(
      'dashboard/group/auth/create',
      createGroupAuth2Body,
    );
    expect(createGroupAuth2.status).toBe(200);

    // const createGroupAuthBody3: DashboardGroupAuthCreateReq = {
    //   id: createDashboard.data.id,
    //   authGroups: [
    //     {
    //       create: true,
    //       delete: true,
    //       read: false,
    //       update: true,
    //       id: createDashboard2.data.id,
    //       name: createDashboard2.data.name,
    //     },
    //   ],
    // };
    // const createGroupAuth3 = await post(
    //   'dashboard/group/auth/create',
    //   createGroupAuthBody3,
    // );

    // expect(createGroupAuth3.status).toBe(200);

    const readGroupAuthBody: DashboardGroupAuthReadReq = {
      id: createDashboard.data.id,
      filters: {
        name: {
          filter: 'foo',
          filterType: 'text',
          type: 'contains',
        },
      },
    };

    const readGroupAuthResponse = (await post(
      'dashboard/group/auth/read',
      readGroupAuthBody,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;

    expect(readGroupAuthResponse.data.authGroups).toContainEqual(
      createGroupAuth2Body.authGroups[0],
    );

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
          operator: 'OR',
          condition2: {
            filter: 'bar',
            filterType: 'text',
            type: 'contains',
          },
        },
      },
    };

    const readGroupAuthResponse2 = (await post(
      'dashboard/group/auth/read',
      readGroupAuthBody2,
    )) as AxiosResponse<DashboardGroupAuthReadRes>;

    expect(readGroupAuthResponse2.data.authGroups).toMatchObject(
      createGroupAuth2Body.authGroups,
    );
    expect(readGroupAuthResponse2.data.authGroups).toContainEqual({
      create: true,
      delete: true,
      read: false,
      update: true,
      name: 'foo',
      id: 'Pontus Vision 2',
    });

    const updateAuthGroupBody: DashboardGroupAuthUpdateReq = {
      id: readGroupAuthResponse.data.id,
      authGroups: [
        {
          create: true,
          delete: true,
          id: 'Pontus Vision 2',
          name: 'foo',
          read: false,
          update: false,
        },
        {
          create: true,
          delete: false,
          id: 'Pontus Vision',
          name: 'bar',
          read: false,
          update: true,
        },
      ],
    };

    const updateGroupAuthResponse = (await post(
      'dashboard/group/auth/update',
      updateAuthGroupBody,
    )) as AxiosResponse<DashboardGroupAuthUpdateRes>;

    expect(updateGroupAuthResponse.status).toBe(200);

    expect(updateGroupAuthResponse.data.authGroups).toContainEqual(
      updateAuthGroupBody.authGroups[0],
    );
    expect(updateGroupAuthResponse.data.authGroups).toContainEqual(
      updateAuthGroupBody.authGroups[1],
    );

    // expect(updateGroupAuthResponse.data.authGroups).toContainEqual(
    //   createGroupAuthBody3.authGroups[0],
    // );

    expect(updateGroupAuthResponse.data.id).toBe(
      updateAuthGroupBody.id,
    );

    expect(updateGroupAuthResponse.data.name).toBe(
      createDashboard.data.name,
    );

    const deleteGroupAuthBody: DashboardGroupAuthDeleteReq = {
      id: updateAuthGroupBody.id,
      authGroups: [updateAuthGroupBody.authGroups[0].id],
    };

    const deleteGroupAuthResponse = (await post(
      'dashboard/group/auth/delete',
      deleteGroupAuthBody,
    )) as AxiosResponse<DashboardGroupAuthDeleteRes>;

    expect(deleteGroupAuthResponse.data.authGroups.length).toBe(2);

    const updateAuthGroup2Body: DashboardGroupAuthUpdateReq = {
      id: readGroupAuthResponse.data.id,
      authGroups: [
        {
          create: false,
          delete: true,
          read: false,
          update: true,
          id: 'Pontus Vision',
          name: 'foo',
        },
      ],
    };

    const updateGroupAuth2Response = (await post(
      'dashboard/group/auth/update',
      updateAuthGroup2Body,
    )) as AxiosResponse<DashboardGroupAuthUpdateRes>;

    expect(updateGroupAuth2Response.data.authGroups).toContainEqual(
      updateAuthGroup2Body.authGroups[0],
    );
  });

  it('should create auth incorrectly in dashboard', async () => {
    const dashboardBody: DashboardCreateReq = {
      folder: 'folder',
      name: 'dashboard1',
      owner: 'foo',
      state: {},
    };
    const createDashboard = (await post(
      'dashboard/create',
      dashboardBody,
    )) as AxiosResponse<DashboardCreateRes>;

    const updateDashboardGroupAuthResponse2 = (await post(
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

    const readDashboardGroupAuthResponse2 = (await post(
      'dashboard/group/auth/read',
      readGroupAuthBody2,
    )) as AxiosResponse<DashboardGroupAuthUpdateRes>;

    expect(readDashboardGroupAuthResponse2.status).toBe(404);
  });
});
