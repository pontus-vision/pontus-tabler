'use strict';

var path = require('path');
var http = require('http');
var oas3Tools = require('oas3-tools');
var serverPort = 8080;

const express = require('express');

const cors = require('cors');

// swaggerRouter configuration
var options = {
  routing: {
    controllers: path.join(__dirname, './controllers'),
  },
};

var expressAppConfig = oas3Tools.expressAppConfig(
  path.join(__dirname, 'api/openapi.yaml'),
  options,
);
var openApiApp = expressAppConfig.getApp();

const app = express();

app.use(/.*/, cors()); /// mudar futuramente para melhor seguranca

for (let i = 2; i < openApiApp._router.stack.length; i++) {
  app._router.stack.push(openApiApp._router.stack[i]);
}

// Custom CORS middleware to allow requests from 'http://localhost:5173'

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
  console.log(
    'Your server is listening on port %d (http://localhost:%d)',
    serverPort,
    serverPort,
  );
  console.log(
    'Swagger-ui is available on http://localhost:%d/docs',
    serverPort,
  );
});
