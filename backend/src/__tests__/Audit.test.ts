
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

  let postAdmin;
  let admin;
  let adminToken
  let tables = [AUTH_GROUPS, AUTH_USERS, 
    WEBHOOKS_SUBSCRIPTIONS, AUDIT, DASHBOARDS
  ] ;
  let group1: AuthGroupRef
  let group2: AuthGroupRef
  if (process.env.DB_SOURCE === DELTA_DB) {
    tables = [...tables,  GROUPS_USERS, GROUPS_DASHBOARDS];
  }
  let user1Session: LoginRes

  let dashboard: DashboardCreateRes

  beforeAll(async () => {
    const dbUtils = await prepareDbAndAuth(tables);
    postAdmin = dbUtils.postAdmin;
    admin = dbUtils.admin;
    adminToken = dbUtils.adminToken
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy

    await removeDeltaTables([WEBHOOKS_SUBSCRIPTIONS, 'table_foo'])
  });

  afterAll(async () => {
    await cleanTables(tables)

    process.env = OLD_ENV;
  });

  it('should create an audit record', async () => {
    const tableCreate: DashboardCreateReq = {
      name: 'dash1',
    }
    const dashboardCreateRes = await postAdmin('/dashboard/create', tableCreate) as AxiosResponse<DashboardCreateRes>

    expect(dashboardCreateRes.status).toBe(200)

    dashboard = dashboardCreateRes.data

    const readAudit:ExecuteQueryReq = {
      query: `SELECT * FROM ${schemaSql}${AUDIT}`
    }

    const getAudits = await axios.post('http://sql-app:3001/PontusTest/1.0.0/test/execute', readAudit)

    expect(getAudits.status).toBe(200)

    expect(getAudits.data['results'][0]['api_path']?.endsWith('dashboard/create')).toBe(true)
  }),
  it('should check groups', async() => {
    const createGroupBody: AuthGroupCreateReq = {
      name: 'bar',
    };
    const createGroup = (await postAdmin(
      'auth/group/create',
      createGroupBody,
    )) as AxiosResponse<AuthGroupCreateRes>;

    group1 = createGroup.data

    const createUserBody: RegisterUserReq = {
      username: 'user1',
      password: 'pontusvision',
      passwordConfirmation: 'pontusvision',
    };

    const userCreateRes = (await post(
      '/register/user',
      createUserBody,
    )) as AxiosResponse<RegisterAdminRes>;

    expect(userCreateRes.status).toBe(200);

    const authUserRead: AuthUserReadReq = {
      username: createUserBody.username,
      id: userCreateRes.data.id
    }

    const userReadRes = await postAdmin('/auth/user/read', authUserRead) as AxiosResponse<AuthUserReadRes>

    expect(userReadRes.status).toBe(200)

    admin = userCreateRes.data;

    const loginUserBody: LoginReq = {
      username: 'user1',
      password: 'pontusvision',
    };

    const user = userCreateRes.data;

    const createGroupUserBody: AuthGroupUsersCreateReq = {
      id: createGroup.data.id,
      authUsers: [{ id: user.id, username: user.username }],
      name: createGroup.data.name,
    };


    const createGroupUser = (await postAdmin(
      'auth/group/users/create',
      createGroupUserBody,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(createGroupUser.status).toBe(200);
    

    const createGroupDashPermissions: AuthGroupDashboardCreateReq = {
      id: createGroup.data.id,
      name: createGroup.data.name, 
      dashboards: [{id: dashboard.id, name: dashboard.name, create: true, read: true, update: true, delete: false}]
    } 

    const createGroupDashboardPermissionsRes = await postAdmin('auth/group/dashboard/create', createGroupDashPermissions) as AxiosResponse<AuthGroupDashboardCreateRes>  

    expect(createGroupDashboardPermissionsRes.status).toBe(200)

    const createGroupBody2: AuthGroupCreateReq = {
      name: 'foo',
    };
    const createGroup2 = (await postAdmin(
      'auth/group/create',
      createGroupBody2,
    )) as AxiosResponse<AuthGroupCreateRes>;

    group2 = createGroup2.data

    const createGroupUserBody2: AuthGroupUsersCreateReq = {
      id: createGroup2.data.id,
      authUsers: [{ id: user.id, username: user.username }],
      name: createGroup2.data.name,
    };

    const createGroupUser2 = (await postAdmin(
      'auth/group/users/create',
      createGroupUserBody2,
    )) as AxiosResponse<AuthGroupDashboardCreateRes>;

    expect(createGroupUser2.status).toBe(200);
    const createGroupDashboardPermissions2: AuthGroupDashboardCreateReq = {
      id: createGroup2.data.id,
      name: createGroup2.data.name, 
      dashboards: [{id: dashboard.id, name: dashboard.name, create: true, read: true, update: true, delete: false}]
    } 
    const logoutBody: LogoutReq = {
      token: adminToken,
    };

    const createGroupDashboardPermissionsRes2 = await postAdmin('auth/group/dashboard/create', createGroupDashboardPermissions2) as AxiosResponse<AuthGroupDashboardCreateRes>  

    expect(createGroupDashboardPermissionsRes2.status).toBe(200)

    const LogoutRes = (await postAdmin(
      'logout',
      logoutBody,
    )) as AxiosResponse<LoginRes>;

    expect(LogoutRes.status).toBe(200);

    const LoginUserRes = (await post(
      '/login',
      loginUserBody,
    )) as AxiosResponse<LoginRes>;

    expect(LoginUserRes.status).toBe(200);

    user1Session = LoginUserRes.data

    const dashboardRes: DashboardReadReq = {
      id: dashboard.id
    }

    const dashReadFromGroup1Res = await post('dashboard/read', dashboardRes, {Authorization:`Bearer ${LoginUserRes.data.accessToken}`}) 

    expect(dashReadFromGroup1Res.status).toBe(200)

    const readAudit: ExecuteQueryReq = {
      query: `SELECT * FROM ${schemaSql}${AUDIT}`
    }

    const getAudits = await axios.post('http://sql-app:3001/PontusTest/1.0.0/test/execute', readAudit)

    const dashboardReadAudit = getAudits.data?.['results']?.find(audit=> audit['api_path']?.endsWith('dashboard/read'))

    expect(JSON.parse(dashboardReadAudit?.['group_ids'])).toContain('bar')
    expect(JSON.parse(dashboardReadAudit?.['group_ids'])).toContain('foo')
  }),
  it('should fail to delete without delete permission, then succeed after updating permissions', async () => {
    const dashboardDelete: DashboardDeleteReq = {
      id: dashboard.id
    };
  
    const deleteAttempt = await post(
      'dashboard/delete',
      dashboardDelete,
      { Authorization: `Bearer ${user1Session.accessToken}` }
    );
  
    expect(deleteAttempt.status).not.toBe(200);
  
    let readAudit: ExecuteQueryReq = {
      query: `SELECT * FROM ${schemaSql}${AUDIT}`
    };
  
    let getAudits = await axios.post(
      'http://sql-app:3001/PontusTest/1.0.0/test/execute',
      readAudit
    );
  
    const deleteAuditBeforeUpdate = getAudits.data?.['results']?.find(audit =>
      audit['api_path']?.endsWith('dashboard/delete')
    );
  
    if (deleteAuditBeforeUpdate) {
      const groupIdsBefore = JSON.parse(deleteAuditBeforeUpdate?.['group_ids']);
      expect(groupIdsBefore).not.toContain(group1.name);
    }
  
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
  
    const updateRes = await postAdmin(
      'auth/group/dashboard/update',
      updateGroupDash
    ) as AxiosResponse<AuthGroupDashboardCreateRes>;
  
    expect(updateRes.status).toBe(200);
  
    const deleteAfterUpdate = await post(
      'dashboard/delete',
      dashboardDelete,
      { Authorization: `Bearer ${user1Session.accessToken}` }
    );
  
    expect(deleteAfterUpdate.status).toBe(200);
  
    getAudits = await axios.post(
      'http://sql-app:3001/PontusTest/1.0.0/test/execute',
      readAudit
    );
  
    const deleteAuditAfterUpdate = getAudits.data?.['results']?.findLast(audit =>
      audit['api_path']?.endsWith('dashboard/delete')
    );
  
    expect(deleteAuditAfterUpdate).toBeDefined();
    const groupIdsAfter = JSON.parse(deleteAuditAfterUpdate?.['group_ids']);
    expect(groupIdsAfter).toContain(group1.name);
  });
  
});
