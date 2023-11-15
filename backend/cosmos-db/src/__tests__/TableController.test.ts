import {
  dashboardCreatePOST,
  dashboardReadPOST,
  dashboardDeletePOST,
  dashboardUpdatePOST,
} from '../controllers/DashboardController';
import * as utils from '../utils/writer';
import {
  upsertDashboard,
  readDashboardById,
  deleteDashboard,
} from '../service/DashboardService';
import { Dashboard } from 'pontus-tabler/src/types';
import {
  DashboardCreateReq,
  DashboardCreateRes,
  DashboardReadRes,
  DashboardRef,
  DashboardUpdateRes,
  DashboardUpdateReq,
  TablesReadRes,
  TableRef,
  TableCreateRes,
  TableReadRes,
  TableUpdateReq,
  TableCreateReq,
  ReadPaginationFilter,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
// import { sendHttpRequest } from '../http';
// import { method } from 'lodash';
// import axios from 'axios';
import httpTrigger, { srv } from '../index';
import { HttpRequest, InvocationContext } from '@azure/functions';

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

describe('dashboardCreatePOST', () => {
  const OLD_ENV = process.env;

  const post = async (
    endpoint: string,
    body: any,
  ): Promise<{ data: any; status: number }> => {
    // return sendHttpRequest(
    //   'http://localhost:8080/PontusTest/1.0.0/' + endpoint,
    //   {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer 123456',
    //   },
    //   {},
    //   JSON.stringify(body),
    // );

    //   const res = await axios.post(
    //     'http://localhost:8080/PontusTest/1.0.0/' + endpoint,
    //     body,
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: 'Bearer 123456',
    //       },
    //     },
    //   );
    //   return res;

    // const res = await fetch(
    //   'http://localhost:8080/PontusTest/1.0.0/' + endpoint,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: 'Bearer 123456',
    //     },
    //     body: JSON.stringify(body),
    //   },
    // );

    const res = await httpTrigger(
      new HttpRequest({
        body: { string: JSON.stringify(body) },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer 123456',
        },
        url: 'http://localhost:8080/PontusTest/1.0.0/' + endpoint,
      }),
      new InvocationContext(),
    );

    const retVal = {
      status: res.status,
      data: typeof res.body === 'string' ? JSON.parse(res.body) : res.body,
    };
    console.log(`Ret val is ${JSON.stringify(retVal)}`);
    return retVal;
  };
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
    srv.close();
  });

  it('should do the CRUD "happy path"', async () => {
    const body: TableRef = {
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

    let resPayload: TableCreateRes = createRetVal.data;
    let id = resPayload.id;

    expect(createRetVal.data.name).toBe(body.name);

    const readRetVal = await post('table/read', {
      id,
    });

    let resPayload2: TableReadRes = readRetVal.data;

    console.log(`res2: ${JSON.stringify(resPayload2)}`);

    expect(readRetVal.data.name).toBe(body.name);

    const body2: TableUpdateReq = {
      name: 'name2',
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

    expect(resPayload3.name).toBe(body2.name);

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
  it('should read dashboards', async () => {
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
      name: 'PontusVision2',
    });

    const readBody = {
      filters: {
        name: {
          condition1: {
            filter: 'PontusVision',
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
