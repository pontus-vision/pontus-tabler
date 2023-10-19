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
import { PVResponse } from './pv-response';
import {
  DashboardCreateReq,
  DashboardCreateRes,
  DashboardReadRes,
  DashboardRef,
  DashboardUpdateRes,
  DashboardUpdateReq,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { sendHttpRequest } from './http';
import { method } from 'lodash';
import axios from 'axios';

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
    endpoint,
    body,
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

    const res = await fetch(
      'http://localhost:8080/PontusTest/1.0.0/' + endpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer 123456',
        },
        body: JSON.stringify(body),
      },
    );

    return { status: res.status, data: await res.json() };
  };
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('should do the CRUD "happy path"', async () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const req = {} as any;
    const res = new PVResponse();
    const next = jest.fn();
    const body: DashboardRef = {
      name: 'string',
      folder: 'string',
      owner: 'string',
      state: {},
    };

    const createRetVal = await post('dashboard/create', body);

    let resPayload: DashboardCreateRes = createRetVal.data;
    let id = resPayload.id;

    const readRetVal = await post('dashboard/read', {
      id,
    });
    let resPayload2: DashboardReadRes = readRetVal.data;

    console.log(`res2: ${JSON.stringify(resPayload2)}`);

    expect(createRetVal.data.name).toBe(body.name);
    expect(readRetVal.data.name).toBe(body.name);

    const body2: DashboardUpdateReq = {
      id: resPayload2.id,
      owner: resPayload2.owner,
      name: 'Pontus 2',
      folder: resPayload2.folder,
      state: resPayload2.state,
    };

    const updateRetVal = await post('dashboard/update', body2);

    let resPayload3: DashboardUpdateRes = updateRetVal.data;

    expect(resPayload3.name).toBe(body2.name);

    const body3 = {
      id: resPayload3.id,
    };

    const deleteRetVal = await post('dashboard/delete', body3);

    let resPayload4 = deleteRetVal.data;

    expect(deleteRetVal.status).toBe(200);

    const readRetVal2 = await post('dashboard/read', body3);

    expect(readRetVal2.status).toBe(404);
  });
  it('should do the CRUD "sad path"', async () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const req = {} as any;
    const res = new PVResponse();
    const next = jest.fn();
    const body: DashboardRef = {
      name: 'string',
      folder: 'string',
      owner: 'string',
      state: {},
    };

    const createRetVal = await post('dashboard/create', {});

    expect(createRetVal.status).toBe(400);

    const readRetVal = await post('dashboard/read', {
      id: 'foo',
    });

    expect(readRetVal.status).toBe(404);

    const updateRetVal = await post('dashboard/update', { foo: 'bar' });

    expect(updateRetVal.status).toBe(400);

    const deleteRetVal = await post('dashboard/delete', { foo: 'bar' });

    let resPayload4 = deleteRetVal.data;

    expect(deleteRetVal.status).toBe(400);
  });
});
