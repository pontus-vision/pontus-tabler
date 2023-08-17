"use strict";

// var path = require("path");
// var http = require("http");
// var fs = require("fs");
// var oas3Tools = require("oas3-tools");
// var serverPort = 8080;

// var cors = require("cors");

// // swaggerRouter configuration
// var options = {
//   routing: {
//     controllers: path.join(__dirname, "./controllers"),
//     app: path.join(__dirname, "./app_dist"),
//   },
// };

// var expressAppConfig = oas3Tools.expressAppConfig(
//   path.join(__dirname, "api/openapi.yaml"),
//   options
// );
// var app = expressAppConfig.getApp();
// // app.use(cors());
// app.options(
//   "*",
//   cors({ origin: "http://localhost:5173", optionsSuccessStatus: 200 })
// );

// // Initialize the Swagger middleware
// http
//   .createServer((request, response) => {
//     if (request.url?.includes("app_dist")) {
//       console.log("request ", request.url);

//       var filePath = "." + request.url;
//       if (filePath == "./app_dist/" || filePath == "./app_dist/login") {
//         filePath = "./app_dist/index.html";
//       }

//       var extname = String(path.extname(filePath)).toLowerCase();
//       var mimeTypes = {
//         ".html": "text/html",
//         ".js": "text/javascript",
//         ".css": "text/css",
//         ".json": "application/json",
//         ".png": "image/png",
//         ".jpg": "image/jpg",
//         ".gif": "image/gif",
//         ".svg": "image/svg+xml",
//         ".wav": "audio/wav",
//         ".mp4": "video/mp4",
//         ".woff": "application/font-woff",
//         ".ttf": "application/font-ttf",
//         ".eot": "application/vnd.ms-fontobject",
//         ".otf": "application/font-otf",
//         ".wasm": "application/wasm",
//       };

//       var contentType = mimeTypes[extname] || "application/octet-stream";

//       fs.readFile(filePath, function (error, content) {
//         if (error) {
//           if (error.code == "ENOENT") {
//             fs.readFile("./404.html", function (error, content) {
//               response.writeHead(404, { "Content-Type": "text/html" });
//               response.end(content, "utf-8");
//             });
//           } else {
//             response.writeHead(500);
//             response.end(
//               "Sorry, check with the site admin for error: " +
//                 error.code +
//                 " ..\n"
//             );
//           }
//         } else {
//           response.writeHead(200, { "Content-Type": contentType });
//           response.end(content, "utf-8");
//         }
//       });
//     } else {
//       app(request, response);
//     }
//   })
//   .listen(serverPort, function () {
//     console.log(
//       "Your server is listening on port %d (http://localhost:%d)",
//       serverPort,
//       serverPort
//     );
//     console.log(
//       "Swagger-ui is available on http://localhost:%d/docs",
//       serverPort
//     );
//   });

var path = require("path");
var http = require("http");
var oas3Tools = require("oas3-tools");
var serverPort = 8080;

const express = require("express");

const cors = require("cors");

// swaggerRouter configuration
var options = {
  routing: {
    controllers: path.join(__dirname, "./controllers"),
  },
};

var expressAppConfig = oas3Tools.expressAppConfig(
  path.join(__dirname, "api/openapi.yaml"),
  options
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
    "Your server is listening on port %d (http://localhost:%d)",
    serverPort,
    serverPort
  );
  console.log(
    "Swagger-ui is available on http://localhost:%d/docs",
    serverPort
  );
});
// app.use(cors({ origin: "*" }));
