import path from 'path';
import http from 'http';
import { expressAppConfig as oas3ExpressAppConfig } from 'oas3-tools';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url'; // Import the necessary function

const serverPort = 8080;

// Resolve the directory path using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SwaggerRouter configuration
const options = {
  routing: {
    controllers: path.join(__dirname, './controllers'),
  },
};

const expressAppConfig = oas3ExpressAppConfig(
  path.join(__dirname, 'api/openapi.yaml'),
  options,
);
const openApiApp = expressAppConfig.getApp();

const app = express();

app.use(/.*/, cors()); // Change this for better security in the future

// Copy the routes from openApiApp to app
for (let i = 2; i < openApiApp._router.stack.length; i++) {
  app._router.stack.push(openApiApp._router.stack[i]);
}

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, () => {
  console.log(
    `Your server is listening on port ${serverPort} (http://localhost:${serverPort})`,
  );
  console.log(`Swagger-ui is available on http://localhost:${serverPort}/docs`);
});
