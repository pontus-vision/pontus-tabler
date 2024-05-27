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
  TableDataEdgeReadReq,
  TableDataEdgeReadRes,
  TableDataCreateRes,
} from '../typescript/api';
import { isSubset, post } from './test-utils';
import { deleteDatabase } from '../cosmos-utils';
import { app, srv } from '../server';
import { AxiosResponse } from 'axios';
import { TableEdgeCreateReq } from '../generated/api';

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

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    await deleteDatabase('pv_db');
  });

  afterAll(() => {
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

    const createTable1 = (await post(
      'table/create',
      body,
    )) as AxiosResponse<TableCreateRes>;
    expect(createTable1.status === 200);

    const createTable2 = (await post('table/create', {
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

    const createTableEdge = (await post(
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

    const createTableEdge2 = (await post(
      'table/edge/create',
      edgesBodyFrom,
    )) as AxiosResponse<TableEdgeCreateRes>;

    expect(createTableEdge2.status).toBe(200);

    // reading the edge "to" of table 1

    const readTableEdge = (await post('table/edge/read', {
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

    const readTableEdge2 = (await post('table/edge/read', {
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

    const deleteTableEdge = (await post(
      'table/edge/delete',
      deleteEdgeTo,
    )) as AxiosResponse<string>;

    expect(deleteTableEdge.status).toBe(200);

    // Checking if it is indeed deleted

    const readTableEdgeTo = (await post('table/edge/read', {
      tableId: createTable1.data.id,
    })) as AxiosResponse<TableEdgeReadRes>;

    expect(readTableEdgeTo.data.edges['has_email']?.[0]?.to?.id).toBeFalsy();

    const readTableEdgeFrom = (await post('table/edge/read', {
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

    const deleteTableEdgeFrom = (await post(
      'table/edge/delete',
      deleteEdgeFrom,
    )) as AxiosResponse<string>;

    expect(deleteTableEdgeFrom.status).toBe(200);

    // Checking if it is indeed deleted

    const readTableEdgeFrom2 = (await post('table/edge/read', {
      tableId: createTable1.data.id,
    })) as AxiosResponse<TableEdgeReadRes>;

    expect(
      readTableEdgeFrom2.data.edges?.['has_email']?.[0]?.to?.id,
    ).toBeFalsy();

    const readTableEdgeTo2 = (await post('table/edge/read', {
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

    const createTable1 = (await post(
      'table/create',
      table,
    )) as AxiosResponse<TableCreateRes>;
    expect(createTable1.status === 200);

    const createTable2 = (await post('table/create', {
      ...table,
      name: 'person-natural-2',
      label: 'Person Natural 2',
    })) as AxiosResponse<TableCreateRes>;
    expect(createTable2.status === 200);

    const table1 = createTable1.data;
    const table2 = createTable2.data;

    const createRetVal = await post('table/edge/create', {});

    expect(createRetVal.status).toBe(422);

    const readRetVal = await post('table/edge/read', {
      tableId: 'foo',
    });

    expect(readRetVal.status).toBe(404);

    const deleteRetVal = await post('table/edge/delete', { foo: 'bar' });

    expect(deleteRetVal.status).toBe(422);

    const edgesBodyFoo: TableEdgeCreateReq = {
      id: table1.id,
      name: table1.name,
      edges: {
        has_email: [{ to: { id: 'foo', tableName: 'bar' } }],
      },
    };

    const createEdge1 = await post('table/edge/create', edgesBodyFoo);

    expect(createEdge1.status).toBe(404);
    expect(createEdge1.data).toBe('No table found at id: foo');

    const edgesBody: TableEdgeCreateReq = {
      id: table1.id,
      name: table1.name,
      edges: {
        has_email: [{ to: { id: table2.id, tableName: table2.name } }],
      },
    };

    const createRetVal2 = await post('table/edge/create', edgesBody);

    expect(createRetVal2.status).toBe(200);
    const createRetVal3 = await post('table/edge/create', edgesBody);

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

    const createEdgeNonExistingTable = await post(
      'table/edge/create',
      createEdgeNonExistingTableBody,
    );

    expect(createEdgeNonExistingTable.status).toBe(404);
  });
  it.only('test edges between rows', async () => {
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

    const createTable1 = (await post(
      'table/create',
      table,
    )) as AxiosResponse<TableCreateRes>;
    expect(createTable1.status === 200);

    const createTable2 = (await post('table/create', {
      ...table,
      name: 'person-natural-2',
      label: 'Person Natural 2',
    })) as AxiosResponse<TableCreateRes>;

    expect(createTable2.status === 200);

    const body: TableDataCreateReq = {
      tableName: 'person-natural',
      id: createTable1.data.id,
      cols: {
        'customer-id': 'foo',
        'full-name': 'bar',
      },
    };

    const createTableData = (await post(
      'table/data/create',
      body,
    )) as AxiosResponse<TableDataCreateRes>;

    expect(createTableData.status).toBe(200);

    const body2: TableDataCreateReq = {
      tableName: 'person-natural-2',
      id: createTable2.data.id,
      cols: {
        'customer-id': 'foo2',
        'full-name': 'bar2',
      },
    };

    const createTableData2 = (await post(
      'table/data/create',
      body2,
    )) as AxiosResponse<TableDataCreateRes>;

    expect(createTableData2.status).toBe(200);

    const bodyCreateConnection: TableDataEdgeCreateReq = {
      tableFrom: {
        id: createTable1.data.id,
        tableName: body.tableName,
        rowIds: [createTableData.data.id as string],
      },
      edge: 'has_email',
      edgeType: 'oneToOne',
      tableTo: {
        tableName: body2.tableName,
        rowIds: [createTableData2.data.id as string],
      },
    };

    const createTableConnectionData = await post(
      'table/data/edge/create',
      bodyCreateConnection,
    );

    expect(createTableConnectionData.status).toBe(200);

    const createTableData3 = await post('table/data/create', body2);

    expect(createTableData3.status).toBe(200);

    const bodyCreateConnection2: TableDataEdgeCreateReq = {
      tableFrom: {
        id: createTable1.data.id,
        tableName: body.tableName,
        rowIds: [createTableData.data.id as string],
      },
      edge: 'has_email',
      edgeType: 'oneToOne',
      tableTo: {
        tableName: body2.tableName,
        rowIds: [createTableData3.data.id],
      },
    };

    const createTableConnectionData2 = await post(
      'table/data/edge/create',
      bodyCreateConnection2,
    );

    const table1DataEdgeReadBody: TableDataEdgeReadReq = {
      edge: {
        direction: 'from',
        edgeLabel: 'has_email',
        tableName: createTable2.data.name,
      },
      tableName: createTable1.data.name,
      rowId: createTableData.data.id as string,
    };

    const table2DataEdgeReadBody: TableDataEdgeReadReq = {
      edge: {
        direction: 'to',
        edgeLabel: 'has_email',
        tableName: createTable2.data.name,
      },
      tableName: createTable1.data.name,
      rowId: createTableData2.data.id as string,
    };
    const table1DataRead = (await post(
      'table/data/edge/read',
      table1DataEdgeReadBody,
    )) as AxiosResponse<TableDataEdgeReadRes>;

    const table2DataRead = (await post(
      'table/data/edge/read',
      table2DataEdgeReadBody,
    )) as AxiosResponse<TableDataEdgeReadRes>;

    expect(table1DataRead.data.edges);

    expect(table1DataRead.status).toBe(200);
    expect(table2DataRead.status).toBe(200);
  });
  it('It should test one-to-many edges creation', async () => {
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

    const createTable1 = (await post(
      'table/create',
      table,
    )) as AxiosResponse<TableCreateRes>;
    expect(createTable1.status === 200);

    const createTable2 = (await post('table/create', {
      ...table,
      name: 'person-natural-2',
      label: 'Person Natural 2',
    })) as AxiosResponse<TableCreateRes>;

    expect(createTable2.status === 200);

    const body: TableDataCreateReq = {
      tableName: createTable1.data.name,
      id: createTable1.data.name,
      cols: {
        'customer-id': 'foo',
        'full-name': 'bar',
      },
    };

    const createTableData = await post('table/data/create', body);

    expect(createTableData.status).toBe(200);

    const body2: TableDataCreateReq = {
      tableName: createTable2.data.name,
      id: createTable2.data.id,
      cols: {
        'customer-id': 'foo2',
        'full-name': 'bar2',
      },
    };

    const createTableData2 = await post('table/data/create', body2);

    expect(createTableData2.status).toBe(200);

    const createTableData3 = await post('table/data/create', body2);

    expect(createTableData3.status).toBe(200);

    const bodyCreateConnection: TableDataEdgeCreateReq = {
      tableTo: {
        tableName: body.tableName,
        rowIds: [createTableData.data.id],
      },
      edge: 'has_email',
      edgeType: 'oneToMany',
      tableFrom: {
        id: createTable1.data.id,
        tableName: body2.tableName,
        rowIds: [createTableData2.data.id, createTableData3.data.id],
      },
    };

    const createTableConnectionData = await post(
      'table/data/edge/create',
      bodyCreateConnection,
    );

    expect(createTableConnectionData.status).toBe(200);

    //const bodyCreateConnection3: TableDataEdgeCreateReq = {
    //tableFrom: {
    //tableName: body2.tableName,
    //rowIds: [createTableData2.data.id],
    //},
    //edge: 'has_email',
    //edgeType: 'oneToOne',
    //tableTo: {
    //tableName: body.tableName,
    //rowIds: [createTableData.data.id],
    //},
    //};
    //
    //const createTableConnectionData3 = await post(
    //'table/data/edge/create',
    //bodyCreateConnection3,
    //);

    // expect(
    //   createTableConnectionData.data.some(
    //     (el) =>
    //       el.from === createTableData.data.id &&
    //       el.to === createTableData2.data.id,
    //   ),
    // ).toBe(true);
    // expect(
    //   createTableConnectionData.data.some(
    //     (el) =>
    //       el.from === createTableData.data.id &&
    //       el.to === createTableData3.data.id,
    //   ),
    // ).toBe(true);

    const table1DataReadBody: TableDataEdgeReadReq = {
      edge: {
        direction: 'from',
        edgeLabel: 'has_address',
        tableName: body2.tableName,
      },
      rowId: createTableData2.data.id,
      tableName: body2.tableName,
    };

    const table1DataRead = (await post(
      'table/data/edge/read',
      table1DataReadBody,
    )) as AxiosResponse<TableDataReadRes>;

    const tableFromName = bodyCreateConnection.tableFrom.tableName;

    const tableToName = bodyCreateConnection.tableTo.tableName;

    //expect(
    //table2DataRead.data.rows.every((row) =>
    //row.edges[tableFromName][bodyCreateConnection.edge].from.every((el) =>
    //table1DataRead.data.rows.some((row2) => row2.id === el),
    //),
    //),
    //).toBe(true);
    //
    //expect(
    //table1DataRead.data.rows.every((row) =>
    //row.edges[tableToName][bodyCreateConnection.edge].to.every((el) =>
    //table2DataRead.data.rows.some((row2) => row2.id === el),
    //),
    //),
    //).toBe(true);
  });
});
