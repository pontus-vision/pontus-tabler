import {
  TablesReadRes,
  TableRef,
  TableCreateRes,
  TableReadRes,
  TableUpdateReq,
  TableCreateReq,
  AuthUserCreateRes,
  RegisterAdminReq,
  LoginReq,
  LoginRes,
} from '../typescript/api';
import { prepareDbAndAuth, isSubset, post } from './test-utils';
import { deleteContainer, deleteDatabase } from '../cosmos-utils';
import { app, srv } from '../server';
import { AxiosResponse } from 'axios';
import { DELTA_DB, GROUPS_USERS } from '../service/AuthGroupService';
import { GROUPS_DASHBOARDS } from '../service/EdgeService';
import { AUTH_USERS, DASHBOARDS, TABLES } from '../service/cosmosdb';
import { AUTH_GROUPS_USER_TABLE, AUTH_GROUPS } from '../service/delta';

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

import * as db from './../../delta-table/node/index-jdbc';
import { snakeCase } from 'lodash';
const conn: db.Connection = db.createConnection();
describe('tableControllerTest', () => {
  const OLD_ENV = process.env;

  let adminToken;

  let admin = {} as AuthUserCreateRes;
  let postAdmin;
  beforeEach(async () => {
    let tables = [AUTH_GROUPS, AUTH_USERS, TABLES];
    if (process.env.DB_SOURCE === DELTA_DB) {
      tables = [...tables, GROUPS_USERS];
    }
    const dbUtils = await prepareDbAndAuth(tables);
    postAdmin = dbUtils.postAdmin;
    admin = dbUtils.admin;
    adminToken = dbUtils.adminToken;
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
    srv.close();
  });

  it('should do the CRUD "happy path"', async () => {
    const body: TableCreateReq = {
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

    const createRetVal = (await postAdmin(
      'table/create',
      body,
    )) as AxiosResponse<TableCreateRes>;

    let resPayload: TableCreateRes = createRetVal.data;
    let id = resPayload.id;

    expect(createRetVal.status).toBe(200);
    expect(createRetVal.data.name).toBe(snakeCase(body.name));
    expect(createRetVal.data.cols[0].name).toBe(snakeCase(body.cols[0].name));
    expect(createRetVal.data.cols[1].name).toBe(snakeCase(body.cols[1].name));

    const readRetVal = await postAdmin('table/read', {
      id,
    });

    let resPayload2: TableReadRes = readRetVal.data;

    // console.log(`res2: ${JSON.stringify(resPayload2)}`);

    // expect(isSubset(body, readRetVal.data)).toBe(true);

    expect(readRetVal.status).toBe(200);
    expect(readRetVal.data.name).toBe(snakeCase(body.name));
    expect(readRetVal.data.cols[0].name).toBe(snakeCase(body.cols[0].name));
    expect(readRetVal.data.cols[1].name).toBe(snakeCase(body.cols[1].name));

    const body2: TableUpdateReq = {
      name: 'person-natural',
      label: 'name 2',
      id: id,
      cols: [
        {
          filter: true,
          headerName: 'headerName',
          field: 'field',
          name: 'name',
          id: 'id',
          sortable: true,
        },
        {
          filter: true,
          headerName: 'headerName',
          field: 'field',
          name: 'name',
          id: 'id',
          sortable: true,
        },
      ],
    };

    const updateRetVal = await postAdmin('table/update', body2);

    let resPayload3: TableUpdateReq = updateRetVal.data;

    expect(isSubset(body2, resPayload3)).toBe(true);

    const body3 = {
      id: resPayload3.id,
      name: resPayload3.name,
    };

    const deleteRetVal = await postAdmin('table/delete', body3);

    let resPayload4 = deleteRetVal.data;

    expect(deleteRetVal.status).toBe(200);

    const readRetVal2 = await postAdmin('table/read', { id: body3.id });

    expect(readRetVal2.status).toBe(404);
  });
  it('should do the CRUD "sad path"', async () => {
    const createRetVal = await postAdmin('table/create', {});

    expect(createRetVal.status).toBe(422);

    const readRetVal = await postAdmin('table/read', {
      id: 'foo',
    });

    expect(readRetVal.status).toBe(404);

    const updateRetVal = await postAdmin('table/update', { foo: 'bar' });

    expect(updateRetVal.status).toBe(422);

    const deleteRetVal = await postAdmin('table/delete', { foo: 'bar' });

    let resPayload4 = deleteRetVal.data;

    expect(deleteRetVal.status).toBe(422);

    const table: TableCreateReq = {
      name: 'person-natural',
      label: 'Person Natural',
      cols: [
        {
          field: 'column 1',
          filter: false,
          sortable: false,
          headerName: 'column 1',
          name: 'column1',
          kind: 'checkboxes',
        },
      ],
    };

    await postAdmin('table/create', table);

    const createRetVal2 = await postAdmin('table/create', table);

    expect(createRetVal2.status).toBe(409);
  });
  it('should read tables', async () => {
    const body: TableCreateReq = {
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

    const createRetVal = await postAdmin('table/create', body);

    const createRetVal2 = await postAdmin('table/create', {
      ...body,
      name: 'person-natural2',
    });

    const readBody = {
      from: 1,
      to: 20,
      filters: {
        name: {
          filter: 'person-natural',
          filterType: 'text',
          type: 'contains',
        },
      },
    };

    const readRetVal: { data: TablesReadRes } = await postAdmin(
      'tables/read',
      readBody,
    );

    expect(readRetVal.data.totalTables).toBe(2);

    const deleteVal = await postAdmin('table/delete', {
      id: createRetVal.data.id,
      name: createRetVal.data.name,
    });

    expect(deleteVal.status).toBe(200);
    const deleteVal2 = await postAdmin('table/delete', {
      id: createRetVal2.data.id,
      name: createRetVal2.data.name,
    });

    expect(deleteVal2.status).toBe(200);
  });
});
