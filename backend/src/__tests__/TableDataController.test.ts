import {
  TablesReadRes,
  TableRef,
  TableCreateRes,
  TableReadRes,
  TableUpdateReq,
  TableCreateReq,
  TableDataRowRef,
  TableDataCreateReq,
  ReadPaginationFilter,
  TableDataReadReq,
  TableDataUpdateReq,
  TableDataDeleteReq,
  TableDataReadRes,
  TableUpdateRes,
  AuthUserCreateRes,
  LoginReq,
  LoginRes,
  RegisterAdminReq,
} from '../typescript/api';

import { srv } from '../server';
import { isSubset, post } from './test-utils';
import { deleteContainer, deleteDatabase } from '../cosmos-utils';
import { AxiosResponse } from 'axios';
import { DELTA_DB } from '../service/AuthGroupService';
import { GROUPS_DASHBOARDS } from '../service/EdgeService';
import { AUTH_USERS, DASHBOARDS, TABLES } from '../service/cosmosdb';
import { AUTH_GROUPS_USER_TABLE, AUTH_GROUPS, TABLE_DATA } from '../service/delta';

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

import * as db from '../../../delta-table/node/index-jdbc';
const conn: db.Connection = db.createConnection();
describe('testing tabledata', () => {
  const OLD_ENV = process.env;

  let adminToken;
  const postAdmin = async (
    endpoint: string,
    body: Record<string, any>,
  ): Promise<AxiosResponse> => {
    const res = (await post(endpoint, body, {
      Authorization: 'Bearer ' + adminToken,
    })) as AxiosResponse<any, any>;

    return res;
  };
  let admin = {} as AuthUserCreateRes;
  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    if (process.env.DB_SOURCE === DELTA_DB) {
      const sql = await db.executeQuery(
        `DELETE FROM ${AUTH_GROUPS_USER_TABLE};`,
        conn,
      );
      const sql2 = await db.executeQuery(`DELETE FROM ${AUTH_GROUPS};`, conn);
      const sql3 = await db.executeQuery(`DELETE FROM ${AUTH_USERS};`, conn);
      const sql4 = await db.executeQuery(`DELETE FROM ${DASHBOARDS};`, conn);
      const sql6 = await db.executeQuery(`DELETE FROM ${TABLES};`, conn);
      // const sql7 = await db.executeQuery(`DELETE FROM ${TABLE_DATA};`, conn);
      const sql5 = await db.executeQuery(
        `DELETE FROM ${GROUPS_DASHBOARDS};`,
        conn,
      );
      const sql8 = await db.executeQuery(
        `DELETE FROM ${GROUPS_DASHBOARDS};`,
        conn,
      );
      const sql9 = await db.executeQuery(
        `DELETE FROM person_natural;`,
        conn,
      );
    } else {
      await deleteContainer(AUTH_GROUPS);
      await deleteContainer(DASHBOARDS);
      await deleteContainer(AUTH_USERS);
      await deleteContainer(TABLES);
    }
    const createBody: RegisterAdminReq = {
      username: 'user1',
      password: 'pontusvision',
      passwordConfirmation: 'pontusvision',
    };
    const adminCreateRes = (await postAdmin(
      'register/admin',
      createBody,
    )) as AxiosResponse<AuthUserCreateRes>;
    expect(adminCreateRes.status).toBe(200);

    admin = adminCreateRes.data;
    const loginBody: LoginReq = {
      username: 'user1',

      password: 'pontusvision',
    };
    const LoginRes = (await postAdmin(
      '/login',
      loginBody,
    )) as AxiosResponse<LoginRes>;
    expect(LoginRes.status).toBe(200);

    adminToken = LoginRes.data.accessToken;
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    srv.close();
    if (process.env.DB_SOURCE === DELTA_DB) {
      const sql = await db.executeQuery(
        `DELETE FROM ${AUTH_GROUPS_USER_TABLE};`,
        conn,
      );
      const sql2 = await db.executeQuery(`DELETE FROM ${AUTH_GROUPS};`, conn);
      const sql3 = await db.executeQuery(`DELETE FROM ${AUTH_USERS};`, conn);
      const sql4 = await db.executeQuery(`DELETE FROM ${DASHBOARDS};`, conn);
      const sql5 = await db.executeQuery(
        `DELETE FROM ${GROUPS_DASHBOARDS};`,
        conn,
      );
      const sql8 = await db.executeQuery(
        `DELETE FROM ${GROUPS_DASHBOARDS};`,
        conn,
      );
    } else {
      await deleteContainer(AUTH_GROUPS);
      await deleteContainer(DASHBOARDS);
      await deleteContainer(AUTH_USERS);
      await deleteContainer(TABLES);
    }
  });


  it('should do the CRUD "happy path"', async () => {
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

    const creatTableRetVal = await postAdmin('table/create', table);

    expect(creatTableRetVal.status).toBe(200);

    // Creating our first record.
    const body: TableDataCreateReq = {
      tableName: 'person-natural',
      cols: {
        column1: 'bar',
      },
    };

    const createRetVal = await postAdmin('table/data/create', body);

    expect(createRetVal.status).toBe(200);
    expect(isSubset({['column_1']:body.cols.column1}, createRetVal.data)).toBe(true);

    // Reading accordingly and checking if it will be listed.

    const body2: TableDataReadReq = {
      from: 1,
      to: 10,
      filters: {
        column1: {
          filter: 'bar',
          filterType: 'text',
          type: 'contains',
        },
      },
      tableName: body.tableName,
    };

    const readRetVal = (await postAdmin(
      'table/data/read',
      body2,
    )) as AxiosResponse<TableDataReadRes>;

    expect(
      readRetVal.data.rows.some((value) => isSubset({['column_1']:body.cols.column1}, value)),
    ).toBe(true);

    // Updating it.

    const bodyUpdate: TableDataUpdateReq = {
      tableName: body.tableName,
      rowId: createRetVal.data.id,
      cols: {
        column1: 'john',
      },
    };

    const updateRetVal = await postAdmin('table/data/update', bodyUpdate);

    expect(isSubset({['column_1']: bodyUpdate.cols.column1}, updateRetVal.data)).toBe(true);

    // Reading it again

    const bodyRead2: TableDataReadReq = {
      from: 1,
      to: 10,
      filters: {
        column1: {
          filter: 'john',
          filterType: 'text',
          type: 'contains',
        },
      },
      tableName: body.tableName,
    };

    const readRetVal3 = (await postAdmin(
      'table/data/read',
      bodyRead2,
    )) as AxiosResponse<TableDataReadRes>;

    expect(
      readRetVal3.data.rows.some((value) => isSubset({['column_1']: bodyUpdate.cols.column1}, value)),
    ).toBe(true);

    expect(readRetVal3.data.rowsCount).toBe(1);

    // and finally deleting it.

    const deleteRetVal = await postAdmin('table/data/delete', {
      rowId: createRetVal.data.id,
      tableName: body.tableName,
    });

    expect(deleteRetVal.status).toBe(200);

    const readRetVal4 = (await postAdmin('table/data/read', {
      from: 1,
      to: 10,
      filters: {},
      tableName: body.tableName,
    })) as AxiosResponse<TableDataReadRes>;

    expect(readRetVal4.status).toBe(404);
  });
  it('should do the CRUD "sad path"', async () => {
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

    const creatTableRetVal = await postAdmin('table/create', table);

    expect(creatTableRetVal.status).toBe(200);

    // Creating our first record.
    const body: TableDataCreateReq = {
      tableName: 'person-natural',
      cols: {
        foo: 'bar',
      },
    };

    const createRetVal = await postAdmin('table/data/create', body);

    expect(createRetVal.status).toBe(400);

    expect(createRetVal.data === 'Cols are not defined in table: foo').toBe(
      true,
    );

    // Reading accordingly and checking if it will be listed.

    const body2: TableDataReadReq = {
      from: 1,
      to: 10,
      filters: {
        column1: {
          filter: 'bar',
          filterType: 'text',
          type: 'contains',
        },
      },
      tableName: body.tableName,
    };

    const readRetVal = await postAdmin('table/data/read', body2);

    expect(readRetVal.status).toBe(404);

    // Updating it.

    const bodyUpdate: TableDataUpdateReq = {
      tableName: body.tableName,
      rowId: createRetVal.data.id,
      cols: {
        column: 'john',
      },
    };

    const updateRetVal = await postAdmin('table/data/update', bodyUpdate);

    expect(updateRetVal.status).toBe(422);

    // Reading it again

    const bodyRead2: TableDataReadReq = {
      from: 1,
      to: 10,
      filters: {
        column1: {
          filter: 'john',
          filterType: 'text',
          type: 'contains',
        },
      },
      tableName: body.tableName,
    };

    const readRetVal3 = await postAdmin('table/data/read', bodyRead2);

    expect(readRetVal3.status).toBe(404);

    // and finally deleting it.

    const deleteBody: TableDataDeleteReq = {
      rowId: 'someid',
      tableName: 'some_table',
    };

    const deleteRetVal = await postAdmin('table/data/delete', deleteBody);

    expect(deleteRetVal.status).toBe(404);
  });
  it('should handle table updates', async () => {
    const table: TableCreateReq = {
      name: 'person-natural',
      label: 'Person Natural',
      cols: [
        {
          field: 'column-1',
          filter: false,
          sortable: false,
          headerName: 'column 1',
          name: 'column-1',
          kind: 'checkboxes',
        },
      ],
    };

    const createTableRetVal = (await postAdmin(
      'table/create',
      table,
    )) as AxiosResponse<TableCreateRes>;

    const createTableData = createTableRetVal.data;

    expect(createTableRetVal.status).toBe(200);
    const tableUpdateBody: TableUpdateReq = {
      id: createTableData.id,
      label: createTableData.label,
      name: createTableData.name,
      cols: [
        ...createTableData.cols,
        {
          field: 'column-2',
          filter: false,
          sortable: false,
          headerName: 'column 2',
          name: 'column-2',
          kind: 'checkboxes',
        },
      ],
    };

    const updateTableRetVal = (await postAdmin(
      'table/update',
      tableUpdateBody,
    )) as AxiosResponse<TableUpdateRes>;

    const updateTableRetData = updateTableRetVal.data;

    expect(updateTableRetVal.status).toBe(200);

    const cols = updateTableRetData.cols;

    const createTableDataBody: TableDataCreateReq = {
      tableName: updateTableRetData.name,
      cols: {
        [`${cols[0].name}`]: 'foo',
      },
    };

    const createTableDataRetVal = await postAdmin(
      'table/data/create',
      createTableDataBody,
    );

    expect(createTableDataRetVal.status).toBe(200);
  });
});

