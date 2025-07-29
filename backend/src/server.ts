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
import { ADMIN_GROUP_NAME, AUDIT, AUTH_GROUPS, DASHBOARDS, GROUPS_DASHBOARDS, GROUPS_TABLES, GROUPS_USERS, schema, schemaSql, TABLES, WEBHOOKS_SUBSCRIPTIONS } from './consts';
import { checkPermissions } from './service/AuthGroupService';
import { authenticateToken } from './service/AuthUserService';
import { AuthUserRef } from './typescript/api';
import { isJSONParsable, isJSONStringable, runQuery } from './db-utils';
import axios from 'axios';
import { NotFoundError, UnauthorizedError } from './generated/api';

export const app = express();

const port = 8080;

app.use(cors());

const replaceSlashes = (str: string) => {
  return str.replace(/\//g, '');
};

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const path = replaceSlashes(req.path);

  if (
    path === replaceSlashes('/PontusTest/1.0.0//register/admin') ||
    path === replaceSlashes('/PontusTest/1.0.0//register/user') ||
    path === replaceSlashes('/PontusTest/1.0.0/test/execute') ||
    path === replaceSlashes('/PontusTest/1.0.0/webhook/create')
  ) {
    return next();
  }

  try {
    let authorization;

    let userId

    if(path !== replaceSlashes('/PontusTest/1.0.0//login')) {
      authorization = await authenticateToken(req, res);
      userId = authorization?.['userId']
    }

    req['user'] = { userId };

    const arr = req.path.split('/');

    const crudAction = arr[arr.length - 1];

    const entity = arr[arr.length - 2];

    const tableName = (entity === 'dashboard' || entity === 'dashboards') ? DASHBOARDS : entity;

    let targetId = '';

    if (req.path.startsWith('/PontusTest/1.0.0/dashboard/')) {
      targetId = req.body?.['id'];
    }

    const permissions = await checkPermissions(userId, targetId, tableName);

    const permissionsGroups = permissions.groups
      ?.filter(g => {
        if(g['table_from__name'] === ADMIN_GROUP_NAME) return true
        return  g?.[`table_from__${crudAction}`] === 'true' || entity === 'dashboard' || entity === 'table' ? g?.[`${crudAction}_${entity}`] : null
      })
      ?.map(g => g['table_from__name']) || [];

    req['user']['groupIds'] = permissionsGroups

    if (
      path === replaceSlashes('/PontusTest/1.0.0//dashboards/read') ||
      path === replaceSlashes('/PontusTest/1.0.0//tables/read') ||
      path === replaceSlashes('/PontusTest/1.0.0//login') ||
      path === replaceSlashes('/PontusTest/1.0.0/logout') 
    ) {
      return next();
    }
    if (path === replaceSlashes('/PontusTest/1.0.0/dashboard/create') && permissions.dashboardCrud?.create
    ) {
      return next();
    }

    if (permissions[crudAction]) {
      next();
    } else {
      // throw new UnauthorizedError('You do not have this permission')
      throw { code: 401, message: 'You do not have this permission', permissionsGroups };
    }
  } catch (error) {
    req['authError'] = error;
    const token = req.headers['authorization']
    const userId = req?.['user']?.['userId'] || null;
    const groupIds = JSON.stringify(req?.['user']?.['groupIds']) || '';
    const body = isJSONStringable(req.body) ? JSON.stringify(req.body) : null;

    await runQuery(
      `INSERT INTO ${schemaSql}${AUDIT} (session_id, api_path, body, error, user_id, group_ids, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [token, req.path, body, JSON.stringify(error), userId, groupIds, new Date().toISOString().replace("Z", "")]
    );
    return next()
  }
};

const auditMiddleware = async(
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const path = replaceSlashes(req.path);
  if (
      path === replaceSlashes('/PontusTest/1.0.0//login') 
  ) {
    return next();
  }
  const token = req.headers?.['authorization']

  const error = JSON.stringify(req?.['authError']) || null

  const userId = req?.['user']?.['userId'] || null

  const groupIds = JSON.stringify(req?.['user']?.['groupIds']) || ''

  const body = isJSONStringable(req.body) ? JSON.stringify(req.body) : null

  try {
    await runQuery(`INSERT INTO ${schemaSql}${AUDIT} (session_id, api_path, body, error, user_id, group_ids, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, [token, req.path, body, error, userId, groupIds, new Date().toISOString().replace("Z", "")])
  } catch (error) {
    console.error({error})
  }

  next()
}

const webhookMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // VERIFICAR AUTH PRA VER OS DADOS DE CAPTURA DO WEBHOOK. 
  const replaceSlashes = (str: string) => str.replace(/\//g, '');
  const path = replaceSlashes(req.path);

  if (
    path === replaceSlashes('/PontusTest/1.0.0/webhook/create')
  ) {
    return next();
  }

  if (
    path === replaceSlashes('/PontusTest/1.0.0//auth/group/create') ||
    path === replaceSlashes('/PontusTest/1.0.0//register/admin') ||
    path === replaceSlashes('/PontusTest/1.0.0//register/user') ||
    path === replaceSlashes('/PontusTest/1.0.0//login') ||
    path === replaceSlashes('/PontusTest/1.0.0/logout') ||
    path === replaceSlashes('/PontusTest/1.0.0/test/execute') ||
    // path === replaceSlashes('/PontusTest/1.0.0/table/create') ||
    // path === replaceSlashes('/PontusTest/1.0.0/auth/group/tables/create') ||
    path === replaceSlashes('/PontusTest/1.0.0/webhook/create')
  ) {
    return next();
  }

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

  try {
    const subscriptions = await runQuery(`SELECT * FROM ${schemaSql}${WEBHOOKS_SUBSCRIPTIONS} WHERE operation = '${operation}'`)
    for (const subscription of subscriptions) {
      const tableFilter = subscription?.['ws.table_filter']


      if (!isMatchingFilter(entity, tableFilter)) {
        console.log('Filter criteria not met, skipping webhook.');
        continue;
      }

      const payload = req.body
      const { id, ...rest } = subscription
      try {
        const response = await axios.post(subscription.endpoint, rest, {
          headers: {
            'Authorization': `Bearer ${subscription.secretTokenRef}`,
          }
        });
        console.log(`Webhook sent to ${subscription.endpoint}: ${response.status}`);
      } catch (error) {
        throw `Error sending webhook subscription: ${JSON.stringify(rest)}`;
      }
    }
  } catch (error) {
    console.error({ error })
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

app.use(auditMiddleware)


app.use(webhookMiddleware)


app.listen(port, '0.0.0.0', () => {

  console.log(
    'Your server is listening on port %d (http://localhost:%d)',
    port,
    port,
  );
})
register(app, { pontus });

// app.use(async (err, req, res, next) => {
//   console.log({errorHandler: err })
//   if(!err) return next()
//   // req['authError'] = err;

//   // Reuse your audit logic or move it to a helper
//   try {
//     const token = req.headers['authorization']
//     const userId = req?.['user']?.['userId'] || null;
//     const groupIds = JSON.stringify(req?.['user']?.['groupIds']) || '';
//     const body = isJSONStringable(req.body) ? JSON.stringify(req.body) : null;

//     await runQuery(
//       `INSERT INTO ${schemaSql}${AUDIT} (session_id, api_path, body, error, user_id, group_ids, created_at)
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [token, req.path, body, JSON.stringify(err), userId, groupIds, new Date().toISOString().replace("Z", "")]
//     );
//   } catch (logErr) {
//     console.error('Error writing to audit log:', logErr);
//   }
//   // throw err
//   next()

//   // res.status(err?.code || 500).json({ error: err?.message || 'Internal Server Error' });
// });
const validate = (_request, _scopes, _schema) => {
  return true;
};

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

