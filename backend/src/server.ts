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
<<<<<<< HEAD
import { DASHBOARDS, GROUPS_DASHBOARDS, GROUPS_USERS } from './consts';
import { checkPermissions } from './service/AuthGroupService';
import { authenticateToken } from './service/AuthUserService';
=======
import { GROUPS_DASHBOARDS, GROUPS_USERS } from './consts';
import { checkPermissions } from './service/AuthGroupService';

console.log('STEP 0')
console.log({dbSource : process.env.DB_SOURCE})
>>>>>>> 7c91f81a0c780f99208427d5c314a8d7d8657186

export const app = express();

console.log('STEP 1')

const port = 8080;

app.use(cors());
<<<<<<< HEAD
=======
// export function jdbcMiddleware(req, res, next) {
//   next();
// }
// app.use(jdbcMiddleware);
>>>>>>> 7c91f81a0c780f99208427d5c314a8d7d8657186

console.log('STEP 2')
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const replaceSlashes = (str: string) => {
    return str.replace(/\//g, '');
  };
  const path = replaceSlashes(req.path);

  if (
    path === replaceSlashes('/PontusTest/1.0.0//register/admin') ||
    path === replaceSlashes('/PontusTest/1.0.0//register/user') ||
    path === replaceSlashes('/PontusTest/1.0.0//login') ||
    path === replaceSlashes('/PontusTest/1.0.0/logout')
  ) {
    return next();
  }

<<<<<<< HEAD
  try {

    const authorization = await authenticateToken(req, res);

    const userId = authorization?.['userId'];
=======
  console.log(process.env.DB_SOURCE)
  // try {
  //   const authorization = await authenticateToken(req, res);
  //   const userId = authorization['userId'];
>>>>>>> 7c91f81a0c780f99208427d5c314a8d7d8657186

  //   const arr = req.path.split('/');

  //   const crudAction = arr[arr.length - 1];

  //   const entity = arr[arr.length - 2];

<<<<<<< HEAD
    const tableName = entity === 'dashboard' || 'dashboards' ? DASHBOARDS : GROUPS_USERS;
=======
  //   const tableName = entity === 'dashboard' ? GROUPS_DASHBOARDS : GROUPS_USERS;
>>>>>>> 7c91f81a0c780f99208427d5c314a8d7d8657186

  //   let targetId = '';

  //   if (path === replaceSlashes('/PontusTest/1.0.0/dashboard/create')) {
  //     return next();
  //   }

  //   if (req.path.startsWith('/PontusTest/1.0.0/dashboard/')) {
  //     targetId = req.body?.['id'];
  //   }

<<<<<<< HEAD
    const permissions = await checkPermissions(userId, targetId, tableName);
    if (path === replaceSlashes('/PontusTest/1.0.0//dashboards/read')) {
      return next();
    }

    if (permissions[crudAction]) {
      // if (permissions['']) {
      next();
    } else {
      throw { code: 401, message: 'You do not have this permission' };
    }
  } catch (error) {
    console.log({ error })
    res.status(error?.code).json(error?.message);
  }
=======
  //   const permissions = await checkPermissions('', '', '');
  //   if (permissions[crudAction]) {
  //   // if (permissions['']) {
  //     // next();
  //   } else {
  //     throw { code: 401, message: 'You do not have this permission' };
  //   }
  // } catch (error) {
  //   res.status(error?.code).json(error?.message);
  // }
>>>>>>> 7c91f81a0c780f99208427d5c314a8d7d8657186
};

app.use(express.json());

<<<<<<< HEAD
app.use(authMiddleware);

register(app, { pontus });
=======
console.log('STEP 3')
// app.use(authMiddleware);
console.log('STEP 4')
register(app, { pontus });

console.log('STEP 5')
// app.listen(port, () => {
//   console.log(`listening on port ${port}`);
// });
>>>>>>> 7c91f81a0c780f99208427d5c314a8d7d8657186

console.log('STEP 6')
const validate = (_request, _scopes, _schema) => {
  return true;
};

<<<<<<< HEAD
export const srv = http.createServer(app).listen(port, function() {
=======
console.log('STEP 7')
export const srv = http.createServer(app).listen(port, function () {
>>>>>>> 7c91f81a0c780f99208427d5c314a8d7d8657186
  console.log(
    'Your server is listening on port %d (http://localhost:%d)',
    port,
    port,
  );
});

console.log('STEP 8')
const httpTrigger = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> => {
<<<<<<< HEAD

=======
  
>>>>>>> 7c91f81a0c780f99208427d5c314a8d7d8657186
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

  srv.closeIdleConnections();

  return resp;
<<<<<<< HEAD


=======
    
  
>>>>>>> 7c91f81a0c780f99208427d5c314a8d7d8657186
};

azureApp.http('httpTrigger', {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  authLevel: 'function',
  handler: httpTrigger,
});

export default httpTrigger;
