import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import {
  app as azureApp,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import * as http from 'http';
import pontus from './index'
import { register } from './generated';
// import { authenticateToken } from './service/AuthUserService';
import { AUTH_GROUPS, DASHBOARDS, GROUPS_DASHBOARDS, GROUPS_TABLES, GROUPS_USERS, TABLES, WEBHOOKS_SUBSCRIPTIONS } from './consts';
import { checkPermissions } from './service/AuthGroupService';
import { authenticateToken } from './service/AuthUserService';
import { AuthUserRef } from './typescript/api';
import { runQuery } from './db-utils';
import axios from 'axios';

export const app = express();

const port = 8080;

app.use(cors());

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const replaceSlashes = (str: string) => {
    return str.replace(/\//g, '');
  };
  const path = replaceSlashes(req.path);
  console.log({AUTH_PATH: req.path})

  if (
    path === replaceSlashes('/PontusTest/1.0.0//register/admin') ||
    path === replaceSlashes('/PontusTest/1.0.0//register/user') ||
    path === replaceSlashes('/PontusTest/1.0.0//login') ||
    path === replaceSlashes('/PontusTest/1.0.0/logout') ||
    path === replaceSlashes('/PontusTest/1.0.0/webhook/create')
  ) {
    return next();
  }

  try {

    const authorization = await authenticateToken(req, res);

    const userId = authorization?.['userId'];

    const arr = req.path.split('/');

    const crudAction = arr[arr.length - 1];

    const entity = arr[arr.length - 2];

    const tableName = entity === 'dashboard' || 'dashboards' ? DASHBOARDS : entity;

    let targetId = '';

    if (path === replaceSlashes('/PontusTest/1.0.0/dashboard/create')) {
      return next();
    }

    if (req.path.startsWith('/PontusTest/1.0.0/dashboard/')) {
      targetId = req.body?.['id'];
    }

    const permissions = await checkPermissions(userId, targetId, tableName);
    if (
      path === replaceSlashes('/PontusTest/1.0.0//dashboards/read') ||
      path === replaceSlashes('/PontusTest/1.0.0//tables/read')
    ) {
      return next();
    }

    if (permissions[crudAction]) {
      // if (permissions['']) {
      // await webhookMiddleware(req, res, next)
      next();
    } else {
      throw { code: 401, message: 'You do not have this permission' };
    }
  } catch (error) {
    console.log({ error })
    res.status(error?.code).json(error?.message);
  }
};


const webhookMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // VERIFICAR AUTH PRA VER OS DADOS DE CAPTURA DO WEBHOOK. 
  const replaceSlashes = (str: string) => str.replace(/\//g, '');
  const path = replaceSlashes(req.path);

    console.log({ PATH: req.path, })
  if (
    path === replaceSlashes('/PontusTest/1.0.0/webhook/create')
  ) {
    return next();
  }

    console.log({ PATH2: req.path, })
  if (
    path === replaceSlashes('/PontusTest/1.0.0//register/admin') ||
    path === replaceSlashes('/PontusTest/1.0.0//register/user') ||
    path === replaceSlashes('/PontusTest/1.0.0//login') ||
    path === replaceSlashes('/PontusTest/1.0.0/logout') ||
    // path === replaceSlashes('/PontusTest/1.0.0/table/create') ||
    // path === replaceSlashes('/PontusTest/1.0.0/auth/group/tables/create') ||
    path === replaceSlashes('/PontusTest/1.0.0/webhook/create')
  ) {
    console.log({ PATH25: req.path, })
    return next();
  }

    console.log({ PATH3: req.path, })
console.log('POINT 1')

  const entityAndOperation = parsePath(req.path)

  const operation = entityAndOperation.operation


  const entity = entityAndOperation.entity

  const joinTable = entity === DASHBOARDS ? GROUPS_DASHBOARDS : entity === TABLES ? GROUPS_TABLES : ''

//   const subscriptions = await runQuery(`
//     SELECT
//         ws.id AS subscription_id,
//         ws.context,
//         ws.operation,
//         ws.user_id,
//         ws.table_filter,
//         gu.id AS group_user_id,
//         gu.table_to__id
//     FROM
//         ${WEBHOOKS_SUBSCRIPTIONS} ws
//     INNER JOIN
//         ${GROUPS_USERS} gu ON ws.user_id = gu.table_to__id
//     ${joinTable ? `INNER JOIN ${joinTable} jt ON gu.table_from__id = jt.table_from__id` : ''}
//     WHERE
//         ws.operation = '${operation}'
//         -- AND jt.table_to__${operation} = true; -- Assuming there's a permission column in GROUPS_DASHBOARDS
// `);

 const subscriptions = await runQuery(`SELECT * FROM ${WEBHOOKS_SUBSCRIPTIONS} WHERE operation = '${operation}'`)

  console.log({subscriptions})
  for (const subscription of subscriptions) {
    const tableFilter = subscription?.['ws.table_filter']


    if (!isMatchingFilter(entity, tableFilter)) {
      console.log('Filter criteria not met, skipping webhook.');
      continue;
    }

    const payload = req.body
      const {id, ...rest} = subscription
    try {
      const response = await axios.post(subscription.endpoint, rest, {
        headers: {
          'Authorization': `Bearer ${subscription.secretTokenRef}`,
        }
      });
      console.log(`Webhook sent to ${subscription.endpoint}: ${response.status}`);
    } catch (error) {
      console.error(`Error sending webhook:`, `subscription: ${JSON.stringify(rest)}`);
    }
  }


  return next()
}

export function parsePath(path: string): { entity: string, operation: string } {
  const prefix = "/PontusTest/1.0.0/";

  if (path.startsWith(prefix)) {
    path = path.slice(prefix.length);
  }

  const parts = path.split('/').filter(part => part !== '');

  const operation = parts.pop() || '';

  let entity = parts;

  if (entity.join('/').includes('auth/group')) {
    entity = [AUTH_GROUPS];
  } else if (entity.join('/').includes('dashboard')) {
    entity = [DASHBOARDS];
  } else if (entity.join('/').includes('table')) {
    entity = [TABLES];
  }

  const validOperations = ['create', 'read', 'update', 'delete'];

  if (!validOperations.includes(operation)) {
    throw new Error(`Invalid operation: ${operation}`);
  }

  return { entity: entity[0], operation };

}



function isMatchingFilter(target: string, filter: string) {
  const regex = new RegExp(filter);
  return regex.test(target);
}



app.use(express.json());


app.use(authMiddleware);

app.use(webhookMiddleware)
register(app, { pontus });

const validate = (_request, _scopes, _schema) => {
  return true;
};

export const srv = http.createServer(app).listen(port, function() {
  console.log(
    'Your server is listening on port %d (http://localhost:%d)',
    port,
    port,
  );
});

const httpTrigger = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> => {

  context.log(`Http function processed request for url "${request.url}"`);

  srv.closeIdleConnections();

  const data = await request.text();
  const url = new URL(request.url);

  const headers: HeadersInit = {};
  // const headers: http.OutgoingHttpHeaders = {};

  request.headers.forEach((value: string, key: string) => {
    headers[key] = value;
  });

  const reqOpts: http.RequestOptions = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: request.method,
    headers: headers,
  };

  const ret = await fetch(
    // 'http://localhost:8080/PontusTest/1.0.0' + url.pathname,
    'http://localhost:8080' + url.pathname,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: headers['authorization'] || 'Bearer 123456',
      },
      body: data,
    },
  );

  const respHeaders: HeadersInit = {};

  ret.headers.forEach((value: string, key: string) => {
    respHeaders[key] = value;
  });

  const resp: HttpResponseInit = {
    body: await ret.text(),
    cookies: undefined,
    enableContentNegotiation: undefined,
    headers: respHeaders,
    // jsonBody: await ret.json(),
    status: ret.status,
  };

  //  srv.closeIdleConnections();

  return resp;


};

//azureApp.http('httpTrigger', {
//  methods: ['GET', 'POST', 'PUT', 'DELETE'],
//  authLevel: 'function',
//  handler: httpTrigger,
//});

function camelCase(str: string): string {
  return str.replace(/[_-](\w)/g, (_, c) => c.toUpperCase());
}

function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = camelCase(key);
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

export default httpTrigger;

