import { ExpressAppConfig } from './middleware/express.app.config';
import { Oas3AppOptions } from './middleware/oas3.options';
import {
  app as azureApp,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import { SwaggerUiOptions } from './middleware/swagger.ui.options';
const validate = (_request, _scopes, _schema) => {
  // security stuff here
  return true;
};

const serverPort = 8080;
const openApiApp = express();

const currDir = __dirname.replace(/src/, 'dist' )

// swaggerRouter configuration
const options: Oas3AppOptions = {
  app: openApiApp,
  routing: {
    controllers: path.join(currDir, './controllers'),
  },
  logging: {
    format: 'combined',
    errorLimit: 400,
  },
  openApiValidator: {
    apiSpec: path.join(currDir, 'api/openapi.yaml'),

    validateSecurity: {
      handlers: {
        petstore_auth: validate,
        api_key: validate,
        bearerAuth: validate,
      },
    },
  },
  swaggerUI: new SwaggerUiOptions(
    '/api',
    '/docs',
    path.join(currDir, 'docs'),
  ),
  cors: undefined,
};

const pathName =  path.join(currDir, 'api/openapi.yaml');

let expressAppConfig = new ExpressAppConfig(
  pathName,
  options,
);
let app = expressAppConfig.getApp();
app.use(/.*/, cors()); /// mudar futuramente para melhor seguranca

// for (let i = 2; i < openApiApp._router.stack.length; i++) {
//   app._router.stack.push(openApiApp._router.stack[i]);
// }
// Initialize the Swagger middleware
export const srv  = http.createServer(app).listen(serverPort, function () {
  console.log(
    'Your server is listening on port %d (http://localhost:%d)',
    serverPort,
    serverPort,
  );
  console.log(
    'HTML docs are available on http://localhost:%d/docs',
    serverPort,
  );
  console.log(
    'Open API json is  available on http://localhost:%d/api',
    serverPort,
  );
});

const httpTrigger = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> => {
  context.log(`Http function processed request for url "${request.url}"`);

  const data = await request.text();
  const url = new URL(request.url);
  const headers: http.OutgoingHttpHeaders = {};

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
          Authorization: 'Bearer 123456',
        },
        body:data,
      },
    );

    const respHeaders: HeadersInit= {};

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
  
    return resp;
  //   const resp: HttpResponseInit = {
  //     body: "",
  //     cookies: undefined,
  //     enableContentNegotiation: undefined,
  //     headers: {},
  //     // jsonBody: await ret.json(),
  //     status: 200
  //   };

  // return new Promise<HttpResponseInit>(
  //   (
  //     resolve: (value: HttpResponseInit | PromiseLike<HttpResponseInit>) => void,
  //     reject: (reason: any) => void,
  //   ) => {



  //     const req = http.request(reqOpts, (res: http.IncomingMessage) => {
  //       resp.status = res.statusCode;
  //       resp.headers = res.headers;

  //       context.log(`STATUS: ${res.statusCode}`);
  //       context.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  //       res.setEncoding('utf8');
  //       res.on('data', (chunk) => {
  //         resp.body += chunk as string;
  //       });
  //       res.on('end', () => {
  //         context.log('No more data in response.');
  //         resolve(resp);
  //       });
  //     });

  //     req.on('error', (e) => {
  //       context.error(`problem with request: ${e.message}`);
  //       resp.body = JSON.stringify( {
  //         error: e.message,
  //       });
  //       reject(resp);
  //     });

  //     // Write data to request body
  //     req.write(data);
  //     req.end();

  //   },
  // );
};

azureApp.http('httpTrigger', {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  authLevel: 'function',
  handler: httpTrigger,
});

export default httpTrigger;
