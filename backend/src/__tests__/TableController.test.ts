import {
  TablesReadRes,
  TableCreateRes,
  TableReadRes,
  TableUpdateReq,
  TableCreateReq,
  AuthUserCreateRes,
} from '../typescript/api';
import { prepareDbAndAuth, isSubset, cleanTables, expectAudit } from './test-utils';
import { AxiosResponse } from 'axios';


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
import { AUTH_GROUPS, AUTH_USERS, TABLES, DELTA_DB, GROUPS_USERS, AUDIT } from '../consts';
describe('tableControllerTest', () => {
  const OLD_ENV = process.env;

  let adminToken;

  let admin = {} as AuthUserCreateRes;
  let postAdmin;
  let tables = [AUTH_GROUPS, AUTH_USERS, TABLES, AUDIT];
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
  
    const createRetVal = await expectAudit(() =>
      postAdmin('table/create', body),
      'table/create'
    ) as AxiosResponse<TableCreateRes>;
  
    const resPayload: TableCreateRes = createRetVal.data;
    const id = resPayload.id;
  
    expect(createRetVal.status).toBe(200);
    expect(resPayload.name).toBe(snakeCase(body.name));
    expect(resPayload.cols[0].name).toBe(snakeCase(body.cols[0].name));
    expect(resPayload.cols[1].name).toBe(snakeCase(body.cols[1].name));
  
    const readRetVal = await expectAudit(() =>
      postAdmin('table/read', { id }),
      'table/read'
    );
  
    const resPayload2: TableReadRes = readRetVal.data;
  
    expect(readRetVal.status).toBe(200);
    expect(resPayload2.name).toBe(snakeCase(body.name));
    expect(resPayload2.cols[0].name).toBe(snakeCase(body.cols[0].name));
    expect(resPayload2.cols[1].name).toBe(snakeCase(body.cols[1].name));
  
    const body2: TableUpdateReq = {
      name: 'person-natural',
      label: 'name 2',
      id,
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
  
    const updateRetVal = await expectAudit(() =>
      postAdmin('table/update', body2),
      'table/update'
    );
  
    const resPayload3: TableUpdateReq = updateRetVal.data;
  
    expect(isSubset(body2, resPayload3)).toBe(true);
  
    const body3 = {
      id: resPayload3.id,
      name: resPayload3.name,
    };
  
    const deleteRetVal = await expectAudit(() =>
      postAdmin('table/delete', body3),
      'table/delete'
    );
  
    expect(deleteRetVal.status).toBe(200);
  
    const readRetVal2 = await expectAudit(() =>
      postAdmin('table/read', { id: body3.id }),
      'table/read',
      undefined,
      404
    );
  
    expect(readRetVal2.status).toBe(404);
  });
  
  it('should do the CRUD "sad path"', async () => {
    const createRetVal = await postAdmin('table/create', {})

    expect(createRetVal.status).toBe(422);
  
    const readRetVal = await expectAudit(() =>
      postAdmin('table/read', { id: 'foo' }),
      'table/read',
      undefined,
      404
    );
    expect(readRetVal.status).toBe(404);
  
    const updateRetVal = await postAdmin('table/update', { foo: 'bar' })

    expect(updateRetVal.status).toBe(422);
  
    const deleteRetVal = await postAdmin('table/delete', { foo: 'bar' })

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
  
    await expectAudit(() =>
      postAdmin('table/create', table),
      'table/create'
    );
  
    const createRetVal2 = await expectAudit(() =>
      postAdmin('table/create', table),
      'table/create',
      undefined,
      409
    );
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
  
    const createRetVal = await expectAudit(() =>
      postAdmin('table/create', body),
      'table/create'
    ) as AxiosResponse<TableCreateRes>;
    expect(createRetVal.status).toBe(200);
  
    const createRetVal2 = await expectAudit(() =>
      postAdmin('table/create', {
        ...body,
        name: 'person-natural2',
      }),
      'table/create'
    ) as AxiosResponse<TableCreateRes>;
    expect(createRetVal2.status).toBe(200);
  
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
  
    const readRetVal: { data: TablesReadRes } = await expectAudit(() =>
      postAdmin('tables/read', readBody),
      'tables/read'
    );
    expect(readRetVal.data.totalTables).toBe(2);
  
    const deleteVal = await expectAudit(() =>
      postAdmin('table/delete', {
        id: createRetVal.data.id,
        name: createRetVal.data.name,
      }),
      'table/delete'
    );
    expect(deleteVal.status).toBe(200);
  
    const deleteVal2 = await expectAudit(() =>
      postAdmin('table/delete', {
        id: createRetVal2.data.id,
        name: createRetVal2.data.name,
      }),
      'table/delete'
    );
    expect(deleteVal2.status).toBe(200);
  });
  
});
