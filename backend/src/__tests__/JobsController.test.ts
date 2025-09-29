
import { prepareDbAndAuth, isSubset, post, cleanTables, expectAudit } from './test-utils';
import { AxiosResponse } from 'axios';
import {
  AuthUserCreateRes,
  JobCreateRef,
  JobCreateReq,
  JobCreateRes,
  JobDeleteReq,
  JobDeleteRes,
  JobReadReq,
  JobReadRes,
  JobUpdateReq,
  JobUpdateRes,
} from '../typescript/api';
import { AUDIT, AUTH_GROUPS, AUTH_USERS, DASHBOARDS, DELTA_DB, GROUPS_DASHBOARDS, GROUPS_USERS, MENU, TABLES, JOBS } from '../consts';


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

describe('testing Menu', () => {
  const OLD_ENV = process.env;

  let admin = {} as AuthUserCreateRes;
  let postAdmin;
  let tables = [AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES, AUDIT, JOBS];
  beforeEach(async () => {
    if (process.env.DB_SOURCE === DELTA_DB) {
      tables = [...tables, GROUPS_USERS, GROUPS_DASHBOARDS, 'person_natural', MENU];
    }
    const dbUtils = await prepareDbAndAuth(tables);
    postAdmin = dbUtils.postAdmin;
    admin = dbUtils.admin;
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(async () => {
    await cleanTables(tables)
    process.env = OLD_ENV; // Restore old environment
  });
  it('should do the happy path', async () => {
    const req: JobCreateRef = {
      freq: `* * * * *`,
      name: 'foo',
      query: `SELECT * FROM ${AUTH_GROUPS}`,
      type: 'internal',
      queryOutputTable: '/data/foo/bar'
    }
    const res = await expectAudit(() => postAdmin('/jobs/create', req), '/jobs/create') as AxiosResponse<JobCreateRes>

    expect(res.data.id).toBeTruthy()
    expect(res.data.freq).toBe(req.freq)
    expect(res.data.name).toBe(req.name)
    expect(res.data.query).toBe(req.query)
    expect(res.data.type).toBe(req.type)
    expect(res.data.queryOutputTable).toBe(req.queryOutputTable)

    const jobRead: JobReadReq = {
      id: res.data.id
    }

    const res2 = await expectAudit(() => postAdmin('/jobs/read', jobRead), '/jobs/read') as AxiosResponse<JobReadRes>

    expect(res2.data.id).toBe(jobRead.id)
    expect(res2.data.freq).toBe(req.freq)
    expect(res2.data.name).toBe(req.name)
    expect(res2.data.query).toBe(req.query)
    expect(res2.data.type).toBe(req.type)
    expect(res2.data.queryOutputTable).toBe(req.queryOutputTable)

    const updateJob: JobUpdateReq = {
      id: jobRead.id,
      freq: '*/5 * * * *'
    }

    const res3 = await expectAudit(() => postAdmin('/jobs/update', updateJob), '/jobs/update') as AxiosResponse<JobUpdateRes>

    expect(res3.data.id).toBe(jobRead.id)
    expect(res3.data.freq).toBe(updateJob.freq)

    const deleteJob: JobDeleteReq = {
      id: jobRead.id
    }

    const res4 = await expectAudit(() => postAdmin('/jobs/delete', deleteJob), '/jobs/delete') as AxiosResponse<JobDeleteRes>

    expect(typeof res4.data).toBe('string')

    const jobRead2: JobReadReq = {
      id: res.data.id
    }

    const res5 = await expectAudit(() => postAdmin('/jobs/read', jobRead2), '/jobs/read', undefined, 404) as AxiosResponse<JobReadRes>

    expect(typeof res5.data).toBe('string')
  });
  it('should do the sad path', async () => {
    const req = {
      freq: `* * * *`,
      type: 'internal',
      queryOutputTable: '/data/foo/bar'
    }
    const res = await postAdmin('/jobs/create', req) as AxiosResponse<JobCreateRes>

    expect(res.status).toBe(422)

    const jobRead: JobReadReq = {
      id: 'foo'
    }

    const res2 = await expectAudit(() => postAdmin('/jobs/read', jobRead), '/jobs/read', undefined, 404) as AxiosResponse<JobReadRes>

    const updateJob: JobUpdateReq = {
      id: 'foo',
      freq: '*/5 * * * *'
    }

    const res3 = await expectAudit(() => postAdmin('/jobs/update', updateJob), '/jobs/update', undefined, 404) as AxiosResponse<JobUpdateRes>

    const deleteJob: JobDeleteReq = {
      id: 'foo'
    }

    const res4 = await expectAudit(() => postAdmin('/jobs/delete', deleteJob), '/jobs/delete') as AxiosResponse<JobDeleteRes>

    const req4 = {
      freq: `* * * * *`,
      name: 1,
      query: 3.12,
      type: 'internal',
      queryOutputTable: '/data/foo/bar'
    }
    // const res5 = await expectAudit(() => postAdmin('/jobs/create', req4), '/jobs/create', undefined, 422) as AxiosResponse<JobCreateRes>
  })
  it('should test cron str validation', async () => {
    const req: JobCreateReq = {
      freq: `* * * * * 7 56`,
      type: 'internal',
      queryOutputTable: '/data/foo/bar',
      name: 'foo',
      query: 'SELECT * FROM bar'
    }
    const res = await expectAudit(() => postAdmin('/jobs/create', req), '/jobs/create', undefined, 400) as AxiosResponse<JobCreateRes>

    const updateJob: JobUpdateReq = {
      id: 'foo',
      freq: `* * * * * 7 56`,
    }

    const res3 = await expectAudit(() => postAdmin('/jobs/update', updateJob), '/jobs/update', undefined, 400) as AxiosResponse<JobUpdateRes>
  })
});
