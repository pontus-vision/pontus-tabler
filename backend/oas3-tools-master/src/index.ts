// 'use strict';
import { ExpressAppConfig } from "./middleware/express.app.config";
import { Oas3AppOptions } from "./middleware/oas3.options";
import { OpenApiRequestHandler } from 'express-openapi-validator/dist/framework/types'

// export function expressAppConfig(
//   definitionPath: string,
//   appOptions: Oas3AppOptions,
//   customMiddlewares?: OpenApiRequestHandler[]
// ): ExpressAppConfig {
//   return new ExpressAppConfig(definitionPath, appOptions, customMiddlewares);
// }


'use strict';

import  * as path  from 'path';
import  * as http from 'http';
// var oas3Tools = require('oas3-tools');
let  serverPort = 8080;

import * as express from 'express';

import * as cors from 'cors';

// swaggerRouter configuration
// var options = {
//   routing: {
//     controllers: path.join(__dirname, './controllers'),
//   },
// };

// var expressAppConfig = oas3Tools.expressAppConfig(
//   path.join(__dirname, 'api/openapi.yaml'),
//   options,
// );

// const app = express();
// let expressAppConfig = new ExpressAppConfig(path.join(__dirname, 'api/openapi.yaml'), {
//   app: app,
//   cors: cors(),
//   openApiValidator: {
//     apiSpec: path.join(__dirname, 'api/openapi.yaml')

//   },
//   routing:  {
//     controllers: path.join(__dirname, './controllers'),
//   }, 
//   swaggerUI: undefined, 
//   logging: undefined

// }, undefined);

// var openApiApp = expressAppConfig.getApp();

// app.use(/.*/, cors()); /// mudar futuramente para melhor seguranca

// for (let i = 2; i < openApiApp._router.stack.length; i++) {
//   app._router.stack.push(openApiApp._router.stack[i]);
// }

// // Custom CORS middleware to allow requests from 'http://localhost:5173'

// // Initialize the Swagger middleware
// http.createServer(app).listen(serverPort, function () {
//   console.log(
//     'Your server is listening on port %d (http://localhost:%d)',
//     serverPort,
//     serverPort,
//   );
//   console.log(
//     'Swagger-ui is available on http://localhost:%d/docs',
//     serverPort,
//   );
// });



function validate(request, scopes, schema) {
  // security stuff here
  return true;
}
const openApiApp = express();

// swaggerRouter configuration
const options:Oas3AppOptions = {
  app:openApiApp,
  routing: {
      controllers: path.join(__dirname, './controllers')
  },
  logging: {
      format: 'combined',
      errorLimit: 400
  },
  openApiValidator: {
    apiSpec: path.join(__dirname, 'api/openapi.yaml'),

      validateSecurity: {
          handlers: {
              petstore_auth: validate,
              api_key: validate,
              bearerAuth: validate
          }
      }
  },
  swaggerUI: undefined, 
  cors: undefined

}; 


var expressAppConfig = new ExpressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
let app = expressAppConfig.getApp();
app.use(/.*/, cors()); /// mudar futuramente para melhor seguranca

// for (let i = 2; i < openApiApp._router.stack.length; i++) {
//   app._router.stack.push(openApiApp._router.stack[i]);
// }
// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
  console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
  console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});