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
    // Creating our first record.
    const body: TableDataCreateReq = {
      tableName: 'Person_Natural',
      cols: {
        foo: 'bar',
      },
    };

    const createRetVal = await post('table/data/create', body);

    expect(createRetVal.status).toBe(201);
    expect(isSubset(body.cols, createRetVal.data)).toBe(true);

    // Reading accordingly and checking if it will be listed.

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

    // Updating it.

    const bodyUpdate: TableDataUpdateReq = {
      tableName: body.tableName,
      rowId: createRetVal.data.id,
      cols: {
        foo: 'john',
      },
    };

    const updateRetVal = await post('table/data/update', bodyUpdate);

    expect(isSubset(bodyUpdate.cols, updateRetVal.data)).toBe(true);

    // Reading it again

    const bodyRead2: TableDataReadReq = {
      from: 1,
      to: 10,
      filters: {
        foo: {
          filter: 'john',
          filterType: 'text',
          type: 'contains',
        },
      },
      tableName: body.tableName,
    };

    const readRetVal3 = await post('table/data/read', bodyRead2);

    expect(
      readRetVal3.data.values.some((value) => isSubset(bodyUpdate.cols, value)),
    ).toBe(true);

    // and finally deleting it.

    const deleteRetVal = await post('table/data/delete', {
      id: createRetVal.data.id,
      tableName: body.tableName,
    });

    expect(deleteRetVal.status).toBe(200);
  });
  it('should do the CRUD "sad path"', async () => {
    const createRetVal = await post('table/data/create', {});

    expect(createRetVal.status).toBe(400);

    const readRetVal = await post('table/data/read', {
      from: 1,
      to: 10,
      filters: {
        foo: {
          filter: 'john',
          filterType: 'text',
          type: 'contains',
        },
      },
      tableName: 'table',
    });

    expect(readRetVal.status).toBe(404);

    const updateRetVal = await post('table/data/update', { foo: 'bar' });

    expect(updateRetVal.status).toBe(400);

    const deleteRetVal = await post('table/data/delete', { foo: 'bar' });

    let resPayload4 = deleteRetVal.data;

    expect(deleteRetVal.status).toBe(400);
  });
});
