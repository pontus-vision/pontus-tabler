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
  TableDataUpdateRes,
} from '../typescript/api';

import { prepareDbAndAuth, isSubset, post, cleanTables, removeDeltaTables, expectAudit } from './test-utils';
import { AxiosResponse } from 'axios';
import { DELTA_DB, AUTH_GROUPS, AUTH_USERS, DASHBOARDS, GROUPS_DASHBOARDS, TABLES } from '../consts';


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

describe('tabledatacontroller', () => {
  const OLD_ENV = process.env;

  let admin = {} as AuthUserCreateRes;
  let postAdmin;
  let tables = [AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES];

  beforeAll(async()=> {
  })

  beforeEach(async () => {
    if (process.env.DB_SOURCE === DELTA_DB) {
      tables = [...tables, GROUPS_DASHBOARDS, 'person_natural'];
    }
    const dbUtils = await prepareDbAndAuth(tables);
    postAdmin = dbUtils.postAdmin;
    admin = dbUtils.admin;
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    // await removeDeltaTables(['person_natural', 'person_natural_2'])
  });

  afterAll(async () => {
    await cleanTables(tables)
    process.env = OLD_ENV; // Restore old environment
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
          kind: 'text',
          pivotIndex: 1,
        },
      ],
    };
  
    await expectAudit(() =>
      postAdmin('table/create', table),
      'table/create'
    );
  
    const body: TableDataCreateReq = {
      tableName: 'person-natural',
      cols: { column1: 'bar' },
    };
  
    const createRetVal = await expectAudit(() =>
      postAdmin('table/data/create', body),
      'table/data/create'
    );
  
    expect(
      isSubset({ ['column_1']: body.cols.column1 }, createRetVal.data),
    ).toBe(true);
  
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
  
    const readRetVal = await expectAudit(() =>
      postAdmin('table/data/read', body2),
      'table/data/read'
    );
  
    expect(
      readRetVal.data.rows.some((value) =>
        isSubset({ ['column_1']: body.cols.column1 }, value),
      )
    ).toBe(true);
  
    const bodyUpdate: TableDataUpdateReq = {
      tableName: body.tableName,
      rowId: createRetVal.data.id,
      cols: { column1: 'john' },
    };
  
    const updateRetVal = await expectAudit(() =>
      postAdmin('table/data/update', bodyUpdate),
      'table/data/update'
    );
  
    expect(
      isSubset({ ['column_1']: bodyUpdate.cols.column1 }, updateRetVal.data),
    ).toBe(true);
  
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
  
    const readRetVal3 = await expectAudit(() =>
      postAdmin('table/data/read', bodyRead2),
      'table/data/read'
    );
  
    expect(
      readRetVal3.data.rows.some((value) =>
        isSubset({ ['column_1']: bodyUpdate.cols.column1 }, value),
      )
    ).toBe(true);
  
    expect(readRetVal3.data.rowsCount).toBe(1);
  
    const deleteRetVal = await expectAudit(() =>
      postAdmin('table/data/delete', {
        rowId: createRetVal.data.id,
        tableName: body.tableName,
      }),
      'table/data/delete'
    );
  
    const readRetVal4 = await expectAudit(() =>
      postAdmin('table/data/read', {
        from: 1,
        to: 10,
        filters: {},
        tableName: body.tableName,
      }),
      'table/data/read',
      undefined,
      404
    );
  
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
          kind: 'text',
          pivotIndex: 1,
        },
      ],
    };
  
    await expectAudit(() =>
      postAdmin('table/create', table),
      'table/create'
    );
  
    const body: TableDataCreateReq = {
      tableName: 'person-natural',
      cols: { foo: 'bar' },
    };
  
    const createRetVal = await expectAudit(() =>
      postAdmin('table/data/create', body),
      'table/data/create',
      undefined,
      400
    );
  
    expect(createRetVal.data === 'Cols are not defined in table: foo').toBe(true);
  
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
  
    await expectAudit(() =>
      postAdmin('table/data/read', body2),
      'table/data/read',
      undefined,
      404
    );
  
    const bodyUpdate: TableDataUpdateReq = {
      tableName: body.tableName,
      rowId: createRetVal.data.id,
      cols: { column: 'john' },
    };
  
   
     const tableDataUpdateRes = await postAdmin('table/data/update', bodyUpdate) as AxiosResponse<TableDataUpdateRes>

    expect(tableDataUpdateRes.status).toBe(422)
  
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
  
    await expectAudit(() =>
      postAdmin('table/data/read', bodyRead2),
      'table/data/read',
      undefined,
      404
    );
  
    const deleteBody: TableDataDeleteReq = {
      rowId: 'someid',
      tableName: 'some_table',
    };
  
    const deleteRetVal = await expectAudit(() =>
      postAdmin('table/data/delete', deleteBody),
      'table/data/delete',
      undefined,
      500 // or other expected code
    );
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
          kind: 'text',
          pivotIndex: 1,
        },
      ],
    };
  
    const createTableRetVal = await expectAudit(() =>
      postAdmin('table/create', table),
      'table/create'
    );
  
    const createTableData = createTableRetVal.data;
  
    const tableUpdateBody: TableUpdateReq = {
      id: createTableData.id,
      label: createTableData.label,
      name: createTableData.name,
      cols: [
        ...createTableData.cols,
        {
          field: 'olumn-2',
          filter: false,
          sortable: false,
          headerName: 'column 2',
          name: 'column-2',
          kind: 'text',
          pivotIndex: 1,
        },
      ],
    };
  
    const updateTableRetVal = await expectAudit(() =>
      postAdmin('table/update', tableUpdateBody),
      'table/update'
    );
  
    const cols = updateTableRetVal.data.cols;
  
    const createTableDataBody: TableDataCreateReq = {
      tableName: updateTableRetVal.data.name,
      cols: {
        [`${cols[0].name}`]: 'foo',
      },
    };
  
    const createTableDataRetVal = await expectAudit(() =>
      postAdmin('table/data/create', createTableDataBody),
      'table/data/create'
    );
  });
  
});
