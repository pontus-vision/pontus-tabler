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
import { prepareDbAndAuth, isSubset, post, cleanTables } from './test-utils';
import { deleteContainer, deleteDatabase } from '../cosmos-utils';
import { app } from '../server';
import axios, { AxiosResponse } from 'axios';
import { execSync } from 'child_process';
import fs from 'fs';


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

import { snakeCase } from 'lodash';
import { AUTH_GROUPS, AUTH_USERS, TABLES, DELTA_DB, GROUPS_USERS } from '../consts';
describe('tableControllerTest', () => {
  const OLD_ENV = process.env;

  let adminToken;

  let admin = {} as AuthUserCreateRes;
  let postAdmin;
  let tables = [AUTH_GROUPS, AUTH_USERS, TABLES];
  if (process.env.DB_SOURCE === DELTA_DB) {
    tables = [...tables, GROUPS_USERS];
  }

  beforeEach(async () => {
    const dbUtils = await prepareDbAndAuth(tables);
    postAdmin = dbUtils.postAdmin;
    admin = dbUtils.admin;
    adminToken = dbUtils.adminToken;
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(async() => {
    await cleanTables(tables)
    process.env = OLD_ENV; // Restore old environment
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
          kind: 'text',
          pivotIndex: 1,

        },
        {
          field: 'Person_Natural_Customer_ID',
          filter: true,
          headerName: 'Customer ID',
          id: 'Person_Natural_Customer_ID',
          name: 'customer-id',
          sortable: true,
          kind: 'text',
          pivotIndex: 2,
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
          kind: 'text',
          pivotIndex: 1,
        },
        {
          filter: true,
          headerName: 'headerName',
          field: 'field',
          name: 'name',
          id: 'id',
          sortable: true,
          kind: 'text',
          pivotIndex: 2,
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

    console.log({updateRetVal: JSON.stringify(updateRetVal), body3})

    const deleteRetVal = await postAdmin('table/delete', body3);

    console.log({deleteRetVal: JSON.stringify(deleteRetVal)})

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
      name: 'mapeamento-de-processos',
      label: 'Mapeamento de Processos',
      cols: [
        {
          field: 'column 1',
          filter: false,
          sortable: false,
          headerName: 'column 1',
          name: 'column1',
          kind: 'checkboxes',
          pivotIndex: 1,
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
          kind: 'checkboxes',
          pivotIndex: 1,
        },
        {
          field: 'Person_Natural_Customer_ID',
          filter: true,
          headerName: 'Customer ID',
          id: 'Person_Natural_Customer_ID',
          name: 'customer-id',
          sortable: true,
          kind: 'checkboxes',
          pivotIndex: 2,
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

    console.log({createRetVal: JSON.stringify(createRetVal.data)})

    console.log({createRetVal2: JSON.stringify(createRetVal2.data)})
    const deleteVal = await postAdmin('table/delete', {
      id: createRetVal.data.id,
      name: createRetVal.data.name,
    });
    console.log({deleteVal: JSON.stringify(deleteVal.data)})

    expect(deleteVal.status).toBe(200);
    const deleteVal2 = await postAdmin('table/delete', {
      id: createRetVal2.data.id,
      name: createRetVal2.data.name,
    });

    expect(deleteVal2.status).toBe(200);
  });
});
