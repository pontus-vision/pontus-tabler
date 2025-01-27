import {
  TablesReadRes,
  TableRef,
  TableCreateRes,
  TableReadRes,
  TableUpdateReq,
  TableCreateReq,
  TableEdgeCreateRes,
  TableEdgeReadRes,
  TableEdgeDeleteReq,
  TableDataCreateReq,
  TableDataEdgeCreateReq,
  TableDataReadReq,
  TableDataReadRes,
  AuthUserCreateReq,
  AuthUserCreateRes,
  LoginReq,
  LoginRes,
  LogoutReq,
  RegisterAdminReq,
  RegisterAdminRes,
  TableDataEdgeReadReq,
} from '../typescript/api';
import { prepareDbAndAuth, isSubset, post } from './test-utils';
import { deleteContainer, deleteDatabase } from '../cosmos-utils';
import { app, srv } from '../server';
import { AxiosResponse } from 'axios';
import { TableEdgeCreateReq } from '../generated/api';
import { DELTA_DB } from '../service/AuthGroupService';
import * as db from './../../delta-table/node/index-jdbc';
import { snakeCase } from 'lodash';
import { AUTH_GROUPS, AUTH_USERS, DASHBOARDS, GROUPS_DASHBOARDS, TABLES } from '../consts';
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

describe('tableControllerTest', () => {
  const OLD_ENV = process.env;
  let postAdmin;
  beforeEach(async () => {
    let tables = [AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES];
    if (process.env.DB_SOURCE === DELTA_DB) {
      tables = [...tables, GROUPS_DASHBOARDS, 'person_natural'];
    }
    const dbUtils = await prepareDbAndAuth(tables);
    postAdmin = dbUtils.postAdmin;
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    srv.close();
  });

  it('should do the CRUD "happy path"', async () => {
    // Creating 2 tables.

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

    const createTable1 = (await postAdmin(
      'table/create',
      body,
    )) as AxiosResponse<TableCreateRes>;
    expect(createTable1.status === 200);

    const createTable2 = (await postAdmin('table/create', {
      ...body,
      name: 'person-natural-2',
      label: 'Person Natural 2',
    })) as AxiosResponse<TableCreateRes>;
    expect(createTable2.status === 200);

    const table1Data = createTable1.data;
    const table2Data = createTable2.data;

    // Creating edges between them

    const edgesBodyTo: TableEdgeCreateReq = {
      id: table1Data.id,
      name: table1Data.name,
      edges: {
        has_email: [{ to: { id: table2Data.id, tableName: table2Data.name } }],
      },
    };

    const createTableEdge = (await postAdmin(
      'table/edge/create',
      edgesBodyTo,
    )) as AxiosResponse<TableEdgeCreateRes>;

    expect(createTableEdge.status).toBe(200);

    // Creating edge in the opposite direction

    const edgesBodyFrom: TableEdgeCreateReq = {
      id: table1Data.id,
      name: table1Data.name,
      edges: {
        has_email: [
          { from: { id: table2Data.id, tableName: table2Data.name } },
        ],
      },
    };

    const createTableEdge2 = (await postAdmin(
      'table/edge/create',
      edgesBodyFrom,
    )) as AxiosResponse<TableEdgeCreateRes>;

    expect(createTableEdge2.status).toBe(200);

    // reading the edge "to" of table 1

    const readTableEdge = (await postAdmin('table/edge/read', {
      tableId: table1Data.id,
    })) as AxiosResponse<TableEdgeReadRes>;

    expect(
      isSubset(
        {
          ...edgesBodyTo,
          edges: {
            has_email: [
              ...edgesBodyTo.edges.has_email,
              ...edgesBodyFrom.edges.has_email,
            ],
          },
        },
        readTableEdge.data,
      ),
    ).toBe(true);

    // reading the edge "from" of table 2

    const readTableEdge2 = (await postAdmin('table/edge/read', {
      tableId: createTable2.data.id,
    })) as AxiosResponse<TableEdgeReadRes>;

    const table2Ref: TableEdgeCreateReq = {
      name: table2Data.name,
      edges: {
        has_email: [
          {
            from: {
              id: table1Data.id,
              tableName: table1Data.name,
            },
          },
          {
            to: {
              id: table1Data.id,
              tableName: table1Data.name,
            },
          },
        ],
      },
      id: table2Data.id,
    };

    expect(isSubset(table2Ref, readTableEdge2.data)).toBe(true);

    // Deleting edges

    const deleteEdgeTo: TableEdgeDeleteReq = {
      edges: edgesBodyTo.edges,
      id: edgesBodyTo.id,
      tableName: edgesBodyTo.name,
    };

    const deleteTableEdge = (await postAdmin(
      'table/edge/delete',
      deleteEdgeTo,
    )) as AxiosResponse<string>;

    expect(deleteTableEdge.status).toBe(200);

    // Checking if it is indeed deleted

    const readTableEdgeTo = (await postAdmin('table/edge/read', {
      tableId: createTable1.data.id,
    })) as AxiosResponse<TableEdgeReadRes>;

    expect(readTableEdgeTo.data.edges['has_email']?.[0]?.to?.id).toBeFalsy();

    const readTableEdgeFrom = (await postAdmin('table/edge/read', {
      tableId: createTable2.data.id,
    })) as AxiosResponse<TableEdgeReadRes>;

    expect(
      readTableEdgeFrom.data.edges['has_email']?.[0]?.from?.id,
    ).toBeFalsy();

    // Deleting the second edge

    const deleteEdgeFrom: TableEdgeDeleteReq = {
      edges: edgesBodyFrom.edges,
      id: edgesBodyFrom.id,
      tableName: edgesBodyFrom.name,
    };

    const deleteTableEdgeFrom = (await postAdmin(
      'table/edge/delete',
      deleteEdgeFrom,
    )) as AxiosResponse<string>;

    expect(deleteTableEdgeFrom.status).toBe(200);

    // Checking if it is indeed deleted

    const readTableEdgeFrom2 = (await postAdmin('table/edge/read', {
      tableId: createTable1.data.id,
    })) as AxiosResponse<TableEdgeReadRes>;

    expect(
      readTableEdgeFrom2.data.edges?.['has_email']?.[0]?.to?.id,
    ).toBeFalsy();

    const readTableEdgeTo2 = (await postAdmin('table/edge/read', {
      tableId: createTable2.data.id,
    })) as AxiosResponse<TableEdgeReadRes>;

    expect(
      readTableEdgeTo2.data.edges?.['has_email']?.[0]?.from?.id,
    ).toBeFalsy();
  });
  it('should do the CRUD "sad path"', async () => {
    const table: TableCreateReq = {
      name: 'person-natural',
      label: 'Person Natural',
      cols: [
        {
          field: 'full-name',
          filter: true,
          headerName: 'Full Name',
          id: 'Person_Natural_Full_Name',
          name: 'full-name',
          sortable: true,
        },
        {
          field: 'customer-id',
          filter: true,
          headerName: 'Customer ID',
          id: 'Person_Natural_Customer_ID',
          name: 'customer-id',
          sortable: true,
        },
      ],
    };

    const createTable1 = (await postAdmin(
      'table/create',
      table,
    )) as AxiosResponse<TableCreateRes>;
    expect(createTable1.status === 200);

    const createTable2 = (await postAdmin('table/create', {
      ...table,
      name: 'person-natural-2',
      label: 'Person Natural 2',
    })) as AxiosResponse<TableCreateRes>;
    expect(createTable2.status === 200);

    const table1 = createTable1.data;
    const table2 = createTable2.data;

    const createRetVal = await postAdmin('table/edge/create', {});

    expect(createRetVal.status).toBe(422);

    const readRetVal = await postAdmin('table/edge/read', {
      tableId: 'foo',
    });

    expect(readRetVal.status).toBe(404);

    const deleteRetVal = await postAdmin('table/edge/delete', { foo: 'bar' });

    expect(deleteRetVal.status).toBe(422);

    const edgesBodyFoo: TableEdgeCreateReq = {
      id: table1.id,
      name: table1.name,
      edges: {
        has_email: [{ to: { id: 'foo', tableName: 'bar' } }],
      },
    };

    const createEdge1 = await postAdmin('table/edge/create', edgesBodyFoo);

    expect(createEdge1.status).toBe(404);
    expect(createEdge1.data).toBe('No table found at id: foo');

    const edgesBody: TableEdgeCreateReq = {
      id: table1.id,
      name: table1.name,
      edges: {
        has_email: [{ to: { id: table2.id, tableName: table2.name } }],
      },
    };

    const createRetVal2 = await postAdmin('table/edge/create', edgesBody);

    expect(createRetVal2.status).toBe(200);
    const createRetVal3 = await postAdmin('table/edge/create', edgesBody);

    expect(createRetVal3.status).toBe(409);

    const createEdgeNonExistingTableBody: TableEdgeCreateReq = {
      id: 'foo',
      name: 'bar',
      edges: {
        has_something: [
          {
            from: {
              id: 'foo2',
              tableName: 'bar2',
            },
          },
        ],
      },
    };

    const createEdgeNonExistingTable = await postAdmin(
      'table/edge/create',
      createEdgeNonExistingTableBody,
    );

    expect(createEdgeNonExistingTable.status).toBe(404);
  });
  it('test edges between rows', async () => {
    const table: TableCreateReq = {
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

    const createTable1 = (await postAdmin(
      'table/create',
      table,
    )) as AxiosResponse<TableCreateRes>;
    expect(createTable1.status === 200);

    const createTable2 = (await postAdmin('table/create', {
      ...table,
      name: 'person-natural-2',
      label: 'Person Natural 2',
    })) as AxiosResponse<TableCreateRes>;

    expect(createTable2.status === 200);

    const body: TableDataCreateReq = {
      tableName: 'person-natural',
      cols: {
        'customer-id': 'foo',
        'full-name': 'bar',
      },
    };

    const createTableData = await postAdmin('table/data/create', body);

    expect(createTableData.status).toBe(200);

    const body2: TableDataCreateReq = {
      tableName: 'person-natural-2',
      cols: {
        'customer-id': 'foo2',
        'full-name': 'bar2',
      },
    };

    const createTableData2 = await postAdmin('table/data/create', body2);

    expect(createTableData2.status).toBe(200);

    const bodyCreateConnection: TableDataEdgeCreateReq = {
      tableFrom: {
        tableName: body.tableName,
        rows: [{ id: createTableData.data.id }],
      },
      edge: 'has_email',
      edgeType: 'oneToOne',
      tableTo: {
        tableName: body2.tableName,
        rows: [{ id: createTableData2.data.id }],
      },
    };

    const createTableConnectionData = await postAdmin(
      'table/data/edge/create',
      bodyCreateConnection,
    );

    expect(createTableConnectionData.status).toBe(200);

    const table2DataReadBody: TableDataReadReq = {
      from: 1,
      to: 10,
      filters: {},
      tableName: bodyCreateConnection.tableTo.tableName,
    };

    const createTableData3 = await postAdmin('table/data/create', body2);

    expect(createTableData3.status).toBe(200);

    const bodyCreateConnection2: TableDataEdgeCreateReq = {
      tableFrom: {
        tableName: body.tableName,
        rows: [{ id: createTableData.data.id }],
      },
      edge: 'has_email',
      edgeType: 'oneToOne',
      tableTo: {
        tableName: body2.tableName,
        rows: [{ id: createTableData3.data.id }],
      },
    };

    const createTableConnectionData2 = await postAdmin(
      'table/data/edge/create',
      bodyCreateConnection2,
    );

    const table1DataReadBody: TableDataReadReq = {
      from: 1,
      to: 10,
      filters: {},
      tableName: 'person-natural',
    };

    const table1DataRead = (await postAdmin(
      'table/data/read',
      table1DataReadBody,
    )) as AxiosResponse<TableDataReadRes>;

    const table4DataRead = (await postAdmin(
      'table/data/read',
      table2DataReadBody,
    )) as AxiosResponse<TableDataReadRes>;

    const row = table4DataRead.data.rows[0];
    const rowEdges = row['edges'];
    const personNatural2 = rowEdges['person-natural-2'];
    const hasEmail = personNatural2['has_email'];
    const rowId = hasEmail.from[0].id;

    expect(rowId).toBe(bodyCreateConnection2.tableFrom.rows[0]);
    const row2 = table1DataRead.data.rows[0];
    const rowEdges2 = row2['edges'];
    const personNatural = rowEdges2['person-natural-2'];
    const hasEmail2 = personNatural['has_email'];
    const rowId2 = hasEmail2.to[0].id;
    expect(rowId2).toBe(bodyCreateConnection.tableTo.rows[0]);

    const row3 = table4DataRead.data.rows[1];
    const rowEdges3 = row3['edges'];
    const personNatural3 = rowEdges3['person-natural-2'];
    const hasEmail3 = personNatural3['has_email'];
    const rowId3 = hasEmail3.from[0].id;
    expect(rowId3).toBe(bodyCreateConnection.tableFrom.rows[0]);
  });
  it('It should test one-to-many edges creation', async () => {
    const table: TableCreateReq = {
      name: 'person-natural-2',
      label: 'Person Natural 2',
      cols: [
        {
          field: 'full-name',
          filter: true,
          headerName: 'Full Name',
          id: 'Person_Natural_Full_Name',
          name: 'full-name',
          sortable: true,
        },
        {
          field: 'customer-id',
          filter: true,
          headerName: 'Customer ID',
          id: 'Person_Natural_Customer_ID',
          name: 'customer-id',
          sortable: true,
        },
      ],
    };

    const createTable1 = (await postAdmin(
      'table/create',
      table,
    )) as AxiosResponse<TableCreateRes>;
    expect(createTable1.status === 200);

    const createTable2 = (await postAdmin('table/create', {
      ...table,
      name: 'person-natural-3',
      label: 'Person Natural 3',
    })) as AxiosResponse<TableCreateRes>;

    expect(createTable2.status === 200);

    const body: TableDataCreateReq = {
      tableName: 'person-natural-2',
      cols: {
        'customer-id': 'foo',
        'full-name': 'bar',
      },
    };

    const createTableData = await postAdmin('table/data/create', body);

    expect(createTableData.status).toBe(200);

    const body2: TableDataCreateReq = {
      tableName: 'person-natural-3',
      cols: {
        'customer-id': 'foo2',
        'full-name': 'bar2',
      },
    };

    const createTableData2 = await postAdmin('table/data/create', body2);

    expect(createTableData2.status).toBe(200);

    const createTableData3 = await postAdmin('table/data/create', body2);

    expect(createTableData3.status).toBe(200);

    const bodyCreateConnection: TableDataEdgeCreateReq = {
      tableFrom: {
        tableName: body.tableName,
        rows: [{ id: createTableData.data.id }],
      },
      edge: 'has_email',
      jointTableName: '',
      edgeType: 'oneToMany',
      tableTo: {
        tableName: body2.tableName,
        rows: [
          { id: createTableData2.data.id },
          { id: createTableData3.data.id },
        ],
      },
    };

    const createTableConnectionData = await postAdmin(
      'table/data/edge/create',
      bodyCreateConnection,
    );

    const createTableConnectionData2 = await postAdmin(
      'table/data/edge/create',
      {
        tableFrom: {
          tableName: body.tableName,
          rowIds: [createTableData.data.id],
        },
        edge: 'has_address',
        edgeType: 'oneToMany',
        tableTo: {
          tableName: body2.tableName,
          rowIds: [createTableData2.data.id, createTableData3.data.id],
        },
      },
    );

    expect(createTableConnectionData.status).toBe(200);

    const readEdgeBody: TableDataEdgeReadReq = {
      edge: { direction: 'to', edgeLabel: 'has_email', tableName: 'has_email' },
      rowId: bodyCreateConnection.tableFrom.rows[0].id as string,
      jointTableName: snakeCase(body.tableName + '_' + body2.tableName),
      tableName: bodyCreateConnection.tableFrom.tableName,
      from: 1,
      to: 20,
    };

    const readTableEdgeData = await postAdmin(
      'table/data/edge/read',
      readEdgeBody,
    );

    expect(readTableEdgeData.status).toBe(200);
  });
});
