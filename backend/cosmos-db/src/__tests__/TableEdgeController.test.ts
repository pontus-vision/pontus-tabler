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

  it.only('should do the CRUD "happy path"', async () => {
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

    const createRetVal = (await post(
      'table/create',
      body,
    )) as AxiosResponse<TableCreateRes>;
    expect(createRetVal.status === 200);

    const createRetVal2 = (await post('table/create', {
      ...body,
      name: 'person-natural-2',
      label: 'Person Natural 2',
    })) as AxiosResponse<TableCreateRes>;
    expect(createRetVal2.status === 200);

    const table1 = createRetVal.data;
    const table2 = createRetVal2.data;

    const edgesBody: TableEdgeCreateReq = {
      id: table1.id,
      name: table1.name,
      edges: {
        has_email: [{ to: { id: table2.id, tableName: table2.name } }],
      },
    };

    const createTableEdge = (await post(
      'table/edge/create',
      edgesBody,
    )) as AxiosResponse<TableEdgeCreateRes>;

    expect(createTableEdge.status).toBe(200);

    const readTableEdge = (await post('table/edge/read', {
      tableId: createRetVal.data.id,
    })) as AxiosResponse<TableEdgeReadRes>;

    expect(isSubset(edgesBody, readTableEdge.data)).toBe(true);
    const readTableEdge2 = (await post('table/edge/read', {
      tableId: createRetVal2.data.id,
    })) as AxiosResponse<TableEdgeReadRes>;

    expect(readTableEdge2.data.edges['has_email'][0].from.tableName).toBe(
      table1.name,
    );

    expect(readTableEdge2.data.edges['has_email'][0].from.id).toBe(table1.id);

    const deleteBody: TableEdgeDeleteReq = {
      ...edgesBody,
      tableName: edgesBody.name,
    };
    // const deleteTableEdge = (await post('table/edge/delete', {
    //   deleteBody,
    // })) as AxiosResponse<string>;

    // expect(deleteTableEdge.status).toBe(200);

    // const readTableEdge3 = (await post('table/edge/read', {
    //   tableId: createRetVal.data.id,
    // })) as AxiosResponse<TableEdgeReadRes>;

    // expect()

    // const readTableEdge4 = (await post('table/edge/read', {
    //   tableId: createRetVal2.data.id,
    // })) as AxiosResponse<TableEdgeReadRes>;
  });
  it('should do the CRUD "sad path"', async () => {
    const createRetVal = await post('table/create', {});

    expect(createRetVal.status).toBe(422);

    const readRetVal = await post('table/read', {
      id: 'foo',
    });

    expect(readRetVal.status).toBe(404);

    const updateRetVal = await post('table/update', { foo: 'bar' });

    expect(updateRetVal.status).toBe(422);

    const deleteRetVal = await post('table/delete', { foo: 'bar' });

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

    await post('table/create', table);

    const createRetVal2 = await post('table/create', table);

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

    const createRetVal = await post('table/create', body);

    const createRetVal2 = await post('table/create', {
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

    const readRetVal: { data: TablesReadRes } = await post(
      'tables/read',
      readBody,
    );

    expect(readRetVal.data.totalTables).toBe(2);

    const deleteVal = await post('table/delete', {
      id: createRetVal.data.id,
      name: createRetVal.data.name,
    });

    expect(deleteVal.status).toBe(200);
    const deleteVal2 = await post('table/delete', {
      id: createRetVal2.data.id,
      name: createRetVal2.data.name,
    });

    expect(deleteVal2.status).toBe(200);
  });
});
