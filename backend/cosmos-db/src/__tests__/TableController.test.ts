import {
  TablesReadRes,
  TableRef,
  TableCreateRes,
  TableReadRes,
  TableUpdateReq,
  TableCreateReq,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';

import { isSubset, post } from './test-utils';
import { deleteDatabase } from '../utils/cosmos-utils';
import { srv } from '..';
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
    const body: TableCreateReq = {
      name: 'person_Natural',
      label: 'Person Natural',
      cols: [
        {
          field: 'Person_Natural_Full_Name',
          filter: true,
          headerName: 'Full Name',
          id: 'Person_Natural_Full_Name',
          name: 'full_Name',
          sortable: true,
        },
        {
          field: 'Person_Natural_Customer_ID',
          filter: true,
          headerName: 'Customer ID',
          id: 'Person_Natural_Customer_ID',
          name: 'customer_ID',
          sortable: true,
        },
      ],
    };

    const createRetVal = (await post(
      'table/create',
      body,
    )) as AxiosResponse<TableCreateRes>;

    let resPayload: TableCreateRes = createRetVal.data;
    let id = resPayload.id;

    expect(isSubset(body, createRetVal.data)).toBe(true);

    const readRetVal = await post('table/read', {
      id,
    });

    let resPayload2: TableReadRes = readRetVal.data;

    // console.log(`res2: ${JSON.stringify(resPayload2)}`);

    expect(isSubset(body, readRetVal.data)).toBe(true);

    const body2: TableUpdateReq = {
      name: 'name2',
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

    const updateRetVal = await post('table/update', body2);

    let resPayload3: TableUpdateReq = updateRetVal.data;

    expect(isSubset(body2, resPayload3)).toBe(true);

    const body3 = {
      id: resPayload3.id,
    };

    const deleteRetVal = await post('table/delete', body3);

    let resPayload4 = deleteRetVal.data;

    expect(deleteRetVal.status).toBe(200);

    const readRetVal2 = await post('table/read', body3);

    expect(readRetVal2.status).toBe(404);
  });
  it('should do the CRUD "sad path"', async () => {
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
  it('should read tables', async () => {
    const body: TableCreateReq = {
      name: 'person_Natural',
      label: 'Person Natural',
      cols: [
        {
          field: 'Person_Natural_Full_Name',
          filter: true,
          headerName: 'Full Name',
          id: 'Person_Natural_Full_Name',
          name: 'full_Name',
          sortable: true,
        },
        {
          field: 'Person_Natural_Customer_ID',
          filter: true,
          headerName: 'Customer ID',
          id: 'Person_Natural_Customer_ID',
          name: 'customer_ID',
          sortable: true,
        },
      ],
    };

    const createRetVal = await post('table/create', body);

    const createRetVal2 = await post('table/create', {
      ...body,
      name: 'person_Natural2',
    });

    const readBody = {
      filters: {
        name: {
          condition1: {
            filter: 'person_Natural',
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
