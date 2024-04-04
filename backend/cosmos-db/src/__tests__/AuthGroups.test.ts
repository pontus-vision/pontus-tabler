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
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    srv.close();
  });

  it('should create a group', async () => {
    const createBody: AuthGroupCreateReq = {
      name: 'group1',
      parents: ['foo'],
      symlinks: ['foo'],
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
      parents: ['foo1'],
      symlinks: ['foo2'],
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
      parents: ['foo'],
      symlinks: ['foo'],
    };

    const authGroupCreateRes = (await post(
      'auth/group/create',
      createBody,
    )) as AxiosResponse<AuthGroupCreateRes>;

    const createBody2: AuthGroupCreateReq = {
      name: 'group2',
      parents: ['foo'],
      symlinks: ['foo'],
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

    expect(readGroups.data.authGroups).toContainEqual(authGroupCreateRes.data);
    expect(readGroups.data.authGroups).toContainEqual(authGroupCreateRes2.data);
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
      parents: ['foo'],
      symlinks: ['foo'],
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
  });
});
