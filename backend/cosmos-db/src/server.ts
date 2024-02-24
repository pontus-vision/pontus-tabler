import express from 'express';
import pontus from './index';
import cors from 'cors';
import { register } from './generated/register';
import {
  app as azureApp,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import * as http from 'http';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false, // Disables certificate validation
});

export const app = express();

const port = 8080;

app.use(cors());

app.use(express.json());

register(app, { pontus });

// app.listen(port, () => {
//   console.log(`listening on port ${port}`);
// });

const validate = (_request, _scopes, _schema) => {
  return true;
};

export const srv = http.createServer(app).listen(port, function () {
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
        Authorization: 'Bearer 123456',
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
