
import {
    WebhookSubscriptionRes,
    WebhookSubscriptionReq,
    TableCreateReq,
    TableCreateRes,
    AuthGroupTablesCreateReq,
    AuthGroupReadReq,
    AuthGroupsReadReq,
    AuthGroupsReadRes,
    AuthGroupTableCreateReq,
    TableUpdateReq,
    AuthGroupTablesCreateRes,
    TableUpdateRes
} from '../typescript/api';
import nock from 'nock'
// import { sendHttpRequest } from '../http';
// import { method } from 'lodash';
// import axios from 'axios';
import http from 'http';

import { cleanTables, prepareDbAndAuth, removeDeltaTables } from './test-utils';
import { AxiosResponse } from 'axios';
import { AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES, DELTA_DB, GROUPS_DASHBOARDS, GROUPS_USERS, WEBHOOKS_SUBSCRIPTIONS } from '../consts';

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

  let postAdmin;
  let admin;
  let adminToken
  let tables = [AUTH_GROUPS, AUTH_USERS,  TABLES, 
    WEBHOOKS_SUBSCRIPTIONS
  ] ;
  if (process.env.DB_SOURCE === DELTA_DB) {
    tables = [...tables,  GROUPS_USERS];
  }

  beforeAll(async () => {
    const dbUtils = await prepareDbAndAuth(tables);
    postAdmin = dbUtils.postAdmin;
    admin = dbUtils.admin;
    adminToken = dbUtils.adminToken
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy

    await removeDeltaTables([WEBHOOKS_SUBSCRIPTIONS, 'table_foo'])
  });

  let server: http.Server;
  let receivedPayload: any;

  // beforeAll((
  //   done
  // ) => {
  //   server = http.createServer((req, res) => {
  //     let body = '';
  //     req.on('data', chunk => body += chunk);
  //     req.on('end', () => {
  //       receivedPayload = JSON.parse(body);
  //       res.writeHead(200);
  //       res.end('OK');
  //     });
  //   });

  //   server.listen(4001, 
  //     done
  //   ); 
  // });

  afterAll(async () => {
   
    await cleanTables(tables)


    process.env = OLD_ENV;
  });

  it('should create a webhook', async () => {

    const webhookBody: WebhookSubscriptionReq = {
        userId: admin.id,
        context: 'table-defined',
        endpoint: 'http://webhook-receiver:8000/PontusTest/1.0.0/webhook',
        operation: 'create',
        secretTokenLink: '/authtoken',
        tableFilter: "^table.*",
    }
    const webhookCreateRes = await postAdmin('/webhook/create', webhookBody) as AxiosResponse<WebhookSubscriptionRes>

    expect(webhookCreateRes.status).toBe(200)
    expect(webhookCreateRes.data.context).toBe(webhookBody.context)
    expect(webhookCreateRes.data.endpoint).toBe(webhookBody.endpoint)
    expect(webhookCreateRes.data.operation).toBe(webhookBody.operation)
    expect(webhookCreateRes.data.secretTokenLink).toBe(webhookBody.secretTokenLink)
    expect(webhookCreateRes.data.tableFilter).toBe(webhookBody.tableFilter)
    expect(webhookCreateRes.data.id).toBeTruthy()
  });
  it('should send a webwook', async()=>{
    const tableCreateReq: TableCreateReq = {
      name: 'table foo',
      cols: [],
      label: 'Table Foo'
    }
    
    const tableCreateRes = await postAdmin('/table/create', tableCreateReq) as AxiosResponse<TableCreateRes>

    expect(tableCreateRes.status).toBe(200)


    const readAuthGroupBody: AuthGroupsReadReq = {}

    const readAuthGroupReq = await postAdmin('/auth/groups/read', readAuthGroupBody) as AxiosResponse<AuthGroupsReadRes>


    const groupTablesReq: AuthGroupTablesCreateReq = {
      id: readAuthGroupReq.data.authGroups[0].id,
      name: readAuthGroupReq.data.authGroups[0].name,
      tables: [{id: tableCreateRes.data.id, name: tableCreateRes.data.name}]
    }

    const createGroupTable = await postAdmin('/auth/group/tables/create', groupTablesReq) as AxiosResponse<AuthGroupTablesCreateRes>

    const tableUpdateReq: TableUpdateReq= {
      id: tableCreateRes.data.id,
      name: 'table bar'
    }
    
    const getWebhook = await fetch('http://webhook-receiver:8000/PontusTest/1.0.0/webhook/get', {method: 'POST', headers: {
      'Content-Type': 'application/json',
      // Add other headers as needed
    }, })

    const webhook = await getWebhook.json()

    console.log({webhook})

    expect(webhook['context']).toBe('table-defined')
  })
});
