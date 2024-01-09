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
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';

import { isSubset, post } from './test-utils';
import { deleteDatabase } from '../utils/cosmos-utils';
import { srv } from '..';

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

describe('testing tabledata', () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    await deleteDatabase('pv_db');
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    srv.close();
    await deleteDatabase('pv_db');
  });

  it('should do the CRUD "happy path"', async () => {
    const body: TableDataCreateReq = {
      tableName: 'Person_Natural',
      cols: {
        foo: 'bar',
      },
    };

    const createRetVal = await post('table/data/create', body);

    expect(createRetVal.status).toBe(201);
    expect(isSubset(body.cols, createRetVal.data)).toBe(true);

    const body2: TableDataReadReq = {
      from: 1,
      to: 10,
      filters: {
        foo: {
          filter: 'bar',
          filterType: 'text',
          type: 'contains',
        },
      },
      tableName: body.tableName,
    };

    const readRetVal = await post('table/data/read', body2);

    expect(
      readRetVal.data.values.some((value) => isSubset(body.cols, value)),
    ).toBe(true);

    // const bodyUpdate: TableDataUpdateReq = {
    //   tableName: body.tableName,
    //   rowId: createRetVal.data.id
    //   cols: {

    //   }
    // }

    // console.log(`res2: ${JSON.stringify(resPayload2)}`);

    // expect(readRetVal.data.name).toBe(body.name);

    // const body2: TableUpdateReq = {
    //   name: 'name2',
    //   id: id,
    //   cols: [
    //     {
    //       filter: true,
    //       headerName: 'headerName',
    //       field: 'field',
    //       name: 'name',
    //       id: 'id',
    //       sortable: true,
    //     },
    //     {
    //       filter: true,
    //       headerName: 'headerName',
    //       field: 'field',
    //       name: 'name',
    //       id: 'id',
    //       sortable: true,
    //     },
    //   ],
    // };

    // const updateRetVal = await post('table/update', body2);

    // let resPayload3: TableUpdateReq = updateRetVal.data;

    // expect(resPayload3.name).toBe(body2.name);

    // const body3 = {
    //   id: resPayload3.id,
    // };

    // const deleteRetVal = await post('table/delete', body3);

    // let resPayload4 = deleteRetVal.data;

    // expect(deleteRetVal.status).toBe(200);

    // const readRetVal2 = await post('table/read', body3);

    // expect(readRetVal2.status).toBe(404);
  });
  it.skip('should do the CRUD "sad path"', async () => {
    const createRetVal = await post('table/create', {});

    expect(createRetVal.status).toBe(400);

    const readRetVal = await post('table/read', {
      id: 'foo',
    });

    expect(readRetVal.status).toBe(404);

    const updateRetVal = await post('table/update', { foo: 'bar' });

    expect(updateRetVal.status).toBe(400);

    const deleteRetVal = await post('table/delete', { foo: 'bar' });

    let resPayload4 = deleteRetVal.data;

    expect(deleteRetVal.status).toBe(400);
  });
  it.skip('should read dashboards', async () => {
    const body: TableCreateReq = {
      name: 'Person Natural',
      cols: [
        {
          field: 'Person_Natural_Full_Name',
          filter: true,
          headerName: 'Full Name',
          id: 'Person_Natural_Full_Name',
          name: 'Full Name',
          sortable: true,
        },
        {
          field: 'Person_Natural_Customer_ID',
          filter: true,
          headerName: 'Customer ID',
          id: 'Person_Natural_Customer_ID',
          name: 'Customer ID',
          sortable: true,
        },
      ],
    };

    const createRetVal = await post('table/create', body);

    const createRetVal2 = await post('table/create', {
      ...body,
      name: 'Person Natural2',
    });

    const readBody = {
      filters: {
        name: {
          condition1: {
            filter: 'Person Natural',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const readRetVal: { data: TablesReadRes } = await post(
      'tables/read',
      readBody,
    );

    expect(readRetVal.data.totalTables).toBe(2);

    const readBody2 = {
      filters: {
        name: {
          condition1: {
            filter: 'PontusVision',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
        folder: {
          condition1: {
            filter: 'folder 1',
            filterType: 'text',
            type: 'contains',
          },
          filterType: 'text',
        },
      },
    };

    const deleteVal = await post('table/delete', {
      id: createRetVal.data.id,
    });

    expect(deleteVal.status).toBe(200);
    const deleteVal2 = await post('table/delete', {
      id: createRetVal2.data.id,
    });

    expect(deleteVal2.status).toBe(200);
  });
});
