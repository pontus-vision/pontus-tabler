
import {
    AuthGroupCreateReq,
    AuthGroupDashboardCreateRes,
    AuthGroupUsersCreateReq,
    AuthUserReadReq,
    AuthUserReadRes,
    LoginReq,
    RegisterAdminRes,
    RegisterUserReq,
    LogoutReq,
    LoginRes,
    DashboardCreateReq,
    DashboardCreateRes,
    AuthGroupDashboardCreateReq,
    DashboardReadReq,
    AuthGroupRef,
    DashboardDeleteReq
} from '../typescript/api';
// import { sendHttpRequest } from '../http';
// import { method } from 'lodash';
// import axios from 'axios';
import http from 'http';

import { cleanTables, post, prepareDbAndAuth, removeDeltaTables } from './test-utils';
import axios, { AxiosResponse } from 'axios';
import { AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES, DELTA_DB, GROUPS_DASHBOARDS, GROUPS_USERS, WEBHOOKS_SUBSCRIPTIONS, AUDIT, schemaSql } from '../consts';
import { ExecuteQueryReq } from '../../sql-app/src/typescript/api';
import { AuthGroupCreateRes, AuthGroupDashboardUpdateReq } from '../generated/api';

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

  const expectAudit = async (
    apiCall: () => Promise<AxiosResponse | {data: any, status: number}>,
    expectedPathEndsWith: string,
    expectedGroups: string[] = ['Admin'],
    errorCode?:number 
  ): Promise<AxiosResponse| {data: any, status: number}> => {
   
    const response = await apiCall();

    const getAudits = await axios.post('http://sql-app:3001/PontusTest/1.0.0/test/execute', {
      query: `SELECT * FROM ${schemaSql}${AUDIT}`
    });

    const audit = getAudits.data['results'].findLast(a => a['api_path']?.endsWith(expectedPathEndsWith));

    expect(audit).toBeTruthy();

    if(errorCode) {
      console.log({audit})
      const error = JSON.parse(audit['error'])
      expect(error['code']).toBe(errorCode)
    }

    const groupIds = JSON.parse(audit['group_ids'] || '[]');

    console.log({expectedGroups, groupIds, expectedPathEndsWith})
    // console.log({expectedPathEndsWith})
    expectedGroups.forEach(group => {
      expect(groupIds).toContain(group);
    });

    return response;
  };

  const createGroupsAndUsers = async () => {
    const groupRes = await expectAudit(
      () => postAdmin('auth/group/create', { name: 'bar' }),
      'auth/group/create'
    );
    group1 = groupRes.data;

    const userRes = await post('/register/user', {
      username: 'user1',
      password: 'pontusvision',
      passwordConfirmation: 'pontusvision',
    }) as AxiosResponse<RegisterAdminRes>;

    expect(userRes.status).toBe(200);
    user = userRes.data;

    await expectAudit(
      () => postAdmin('auth/group/users/create', {
        id: group1.id,
        authUsers: [{ id: user.id, username: user.username }],
        name: group1.name
      }),
      'auth/group/users/create'
    );

    const group2Res = await expectAudit(
      () => postAdmin('auth/group/create', { name: 'foo' }),
      'auth/group/create'
    );
    group2 = group2Res.data;

    await expectAudit(
      () => postAdmin('auth/group/users/create', {
        id: group2.id,
        authUsers: [{ id: user.id, username: user.username }],
        name: group2.name
      }),
      'auth/group/users/create'
    );
  };

  let postAdmin;
  let admin;
  let adminToken;
  let tables = [AUTH_GROUPS, AUTH_USERS, WEBHOOKS_SUBSCRIPTIONS, AUDIT, DASHBOARDS];
  let group1: AuthGroupRef;
  let group2: AuthGroupRef;
  let user;
  let user1Session: LoginRes;
  let dashboard: DashboardCreateRes;

  if (process.env.DB_SOURCE === DELTA_DB) {
    tables = [...tables, GROUPS_USERS, GROUPS_DASHBOARDS];
  }

  beforeAll(async () => {
    const dbUtils = await prepareDbAndAuth(tables);
    postAdmin = dbUtils.postAdmin;
    admin = dbUtils.admin;
    adminToken = dbUtils.adminToken;

    jest.resetModules();
    process.env = { ...OLD_ENV };

    await removeDeltaTables([WEBHOOKS_SUBSCRIPTIONS, 'table_foo']);
  });

  afterAll(async () => {
    await cleanTables(tables);
    process.env = OLD_ENV;
  });

  it('should create an audit record', async () => {
    const tableCreate: DashboardCreateReq = { name: 'dash1' };
    const dashboardCreateRes = await expectAudit(
      () => postAdmin('/dashboard/create', tableCreate),
      'dashboard/create'
    );
    expect(dashboardCreateRes.status).toBe(200);
    dashboard = dashboardCreateRes.data;
  });

  it('should check groups', async () => {
    await createGroupsAndUsers();

    const createGroupDashPermissions: AuthGroupDashboardCreateReq = {
      id: group1.id,
      name: group1.name,
      dashboards: [{ id: dashboard.id, name: dashboard.name, create: true, read: true, update: true, delete: false }]
    };

    const createGroupDashboardPermissionsRes = await expectAudit(
      () => postAdmin('auth/group/dashboard/create', createGroupDashPermissions),
      'auth/group/dashboard/create'
    );
    expect(createGroupDashboardPermissionsRes.status).toBe(200);

    const createGroupDashboardPermissions2Body: AuthGroupDashboardCreateReq = {
      id: group2.id,
      name: group2.name,
      dashboards: [{ id: dashboard.id, name: dashboard.name, create: true, read: true, update: true, delete: false }]
    };

    const createGroupDashboardPermissionsRes2 = await expectAudit(
      () => postAdmin('auth/group/dashboard/create', createGroupDashboardPermissions2Body),
      'auth/group/dashboard/create'
    );
    expect(createGroupDashboardPermissionsRes2.status).toBe(200);

    const LogoutRes = await expectAudit(
      () => postAdmin('logout', { token: adminToken }),
      'logout', []
    );
    expect(LogoutRes.status).toBe(200);

    const loginUserBody: LoginReq = { username: 'user1', password: 'pontusvision' };
    const LoginUserRes = await post('/login', loginUserBody) as AxiosResponse<LoginRes>;
    expect(LoginUserRes.status).toBe(200);
    user1Session = LoginUserRes.data;

    const dashboardRes: DashboardReadReq = { id: dashboard.id };
    const dashReadFromGroup1Res = await expectAudit(
      () => post('dashboard/read', dashboardRes, {
        Authorization: `Bearer ${LoginUserRes.data.accessToken}`
      }),
      'dashboard/read',
      ['bar', 'foo']
    );
    expect(dashReadFromGroup1Res.status).toBe(200);
  });
  it("should fail to delete without delete permission", async() => {
    const dashboardDelete: DashboardDeleteReq = { id: dashboard.id };

    const deleteAttempt = await expectAudit(()=> post(
      'dashboard/delete',
      dashboardDelete,
      { Authorization: `Bearer ${user1Session.accessToken}` }
    ), 'dashboard/delete', [], 401);
    expect(deleteAttempt.status).not.toBe(200);
  })
  it('should succeed after updating permissions', async () => {
    const dashboardDelete: DashboardDeleteReq = { id: dashboard.id };

    const updateGroupDash: AuthGroupDashboardUpdateReq = {
      name: group1.name,
      id: group1.id,
      dashboards: [{
        id: dashboard.id,
        name: dashboard.name,
        create: true,
        read: true,
        update: true,
        delete: true
      }]
    };

    const updateRes = await expectAudit(
      () => postAdmin('auth/group/dashboard/update', updateGroupDash),
      'auth/group/dashboard/update'
    );
    expect(updateRes.status).toBe(200);

    // 4. Try delete again, expect audit
    console.log('TRYING TO DELETE FOR REAL')
    const deleteAfterUpdate = await expectAudit(
      () => post('dashboard/delete', dashboardDelete, {
        Authorization: `Bearer ${user1Session.accessToken}`
      }),
      'dashboard/delete',
      [group1.name]
    );
    expect(deleteAfterUpdate.status).toBe(200);
  });
});

