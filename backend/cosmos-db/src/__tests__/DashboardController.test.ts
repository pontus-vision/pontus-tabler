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

    const createRetVal = await dashboardCreatePOST(req, res, next, body);
    let resPayload: DashboardCreateRes = res.payload;
    let id = resPayload.id;

    const readRetVal = await dashboardReadPOST(req, res, next, {
      id,
    });
    let resPayload2: DashboardReadRes = res.payload;

    console.log(`res2: ${JSON.stringify(resPayload2)}`);

    expect(resPayload.name).toBe(body.name);
    expect(resPayload2.name).toBe(body.name);

    const body2 = {
      ...resPayload2,
      name: 'Pontus 2',
    };

    const updateRetVal = await dashboardUpdatePOST(req, res, next, body2);

    let resPayload3: DashboardUpdateRes = res.payload;

    expect(resPayload3.name).toBe(body2.name);

    const body3 = {
      id: resPayload3.id,
    };

    const deleteRetVal = await dashboardDeletePOST(req, res, next, body3);

    let resPayload4 = res.payload;

    expect(resPayload4.id).toBe(body3.id);
  });
  it('should do the CRUD "sad path"', async () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const req = {} as any;
    const res = new PVResponse();
    const next = jest.fn();
    const body = {
      name: 'string',
      folder: 'string',
      owner: 'string',
      foo: 'bar',
    };

    const createRetVal = await dashboardCreatePOST(req, res, next, null);
    console.log(res);
    expect(res.code).toBe(400);
    let resPayload: DashboardCreateRes = res.payload;
    console.log(`jsonRes: ${JSON.stringify(resPayload)}`);
    let id = resPayload.id;

    const readRetVal = await dashboardReadPOST(req, res, next, {
      id: 15151 as any,
    });
    let resPayload2: DashboardReadRes = res.payload;
    let resCode = res.code;

    console.log(`res2: ${JSON.stringify(resPayload2)}`);

    expect(resPayload?.state).toBeFalsy();
    expect(resCode).toBe(404);

    // const body2 = {
    //   ...resPayload2,
    //   name: 'Pontus 2',
    // };

    // const updateRetVal = await dashboardUpdatePOST(req, res, next, body2);

    // let resPayload3: DashboardUpdateRes = res.payload;

    // expect(resPayload3.name).toBe(body2.name);

    // const body3 = {
    //   id: resPayload3.id,
    // };

    // const deleteRetVal = await dashboardDeletePOST(req, res, next, body3);

    // let resPayload4 = res.payload;

    // expect(resPayload4.id).toBe(body3.id);
  });
});
