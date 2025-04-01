"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.JDBC = exports.Statement = exports.SQLWarning = exports.ResultSetMetaData = exports.ResultSet = exports.PreparedStatement = exports.Pool = exports.Jinst = exports.DriverManager = exports.Connection = void 0;
var connection_1 = require("./connection");
__createBinding(exports, connection_1, "default", "Connection");
var drivermanager_1 = require("./drivermanager");
__createBinding(exports, drivermanager_1, "default", "DriverManager");
var jinst_1 = require("./jinst");
__createBinding(exports, jinst_1, "default", "Jinst");
var pool_1 = require("./pool");
__createBinding(exports, pool_1, "default", "Pool");
var preparedstatement_1 = require("./preparedstatement");
__createBinding(exports, preparedstatement_1, "default", "PreparedStatement");
var resultset_1 = require("./resultset");
__createBinding(exports, resultset_1, "default", "ResultSet");
var resultsetmetadata_1 = require("./resultsetmetadata");
__createBinding(exports, resultsetmetadata_1, "default", "ResultSetMetaData");
var sqlwarning_1 = require("./sqlwarning");
__createBinding(exports, sqlwarning_1, "default", "SQLWarning");
var statement_1 = require("./statement");
__createBinding(exports, statement_1, "default", "Statement");
var jdbc_1 = require("./jdbc");
__createBinding(exports, jdbc_1, "default", "JDBC");
// import Connection from './connection';
// import JDBC from './jdbc'; // Use default import
// import Jinst from './jinst'; // Use default import
// import Pool, {  IConnection } from './pool'
// export const classPath = process.env['CLASSPATH']?.split(',');
// if (!Jinst.getInstance().isJvmCreated()) {
// 	  Jinst.getInstance().addOption('-Xrs');
// 	    Jinst.getInstance().setupClasspath(classPath || []); // Path to your JDBC driver JAR file
// }
// export const config= {
//   url: process.env['P_DELTA_TABLE_HIVE_SERVER'] || 'jdbc:hive2://localhost:10000', // Update the connection URL according to your setup
//   drivername: 'org.apache.hive.jdbc.HiveDriver', // Driver class name
//   properties: {
//     user: 'NBuser',
//     password: '',
//   },
// };
// const pool = new Pool({
//     url: 'jdbc:hive2://pontus-node-jdbc-delta-db:10000',   // Replace with your JDBC URL
//     properties: {
//       user: 'admin',           // Database username
//       password: 'user'        // Database password
//     },
//     drivername: 'org.apache.hive.jdbc.HiveDriver', // Driver class name
//     minpoolsize: 2,
//     maxpoolsize: 10,
//     keepalive: {
//       interval: 60000,
//       query: 'SELECT 1',
//       enabled: true
//     },
//     logging: {
//       level: 'info'
//     }
//   });
//   const jdbc = new JDBC(config);
//   // Initialize pool
//   async function initializePool() {
//     try {
//       await pool.initialize();
//       console.log('Pool initialized successfully.');
//     } catch (error) {
//       console.error('Error initializing the pool:', error);
//     }
//   }
//   export const createConnection = async():Promise<IConnection> => {
//     const reservedConn = await jdbc.reserve()
//     return reservedConn.conn
//   };
//   async function runQuery(query:string) {
//     try {
//         const connection = await createConnection()
//         const preparedStatement = await connection.prepareStatement(query); // Replace `your_table` with your actual table name
//         const resultSet = await preparedStatement.executeQuery();
//         console.log({resultSet})
//         const results = await resultSet.toObjArray(); // Assuming you have a method to convert ResultSet to an array
//         console.log('Query Results:', results);
//         // Remember to release the connection after you are done
//         // await connection.abort()
//         await pool.release(connection);
//     } catch (error) {
//         console.error('Error executing query:', error);
//     }
// }
//   (async()=>{
//     await initializePool()
//     await runQuery(`CREATE TABLE IF NOT EXISTS foo (id STRING, name STRING  ) USING DELTA LOCATION '/data/pv/foo';`)
//     await runQuery(`INSERT INTO foo (id , name) VALUES (1, 'foo') `)
//     await runQuery('SELECT * FROM delta.`/data/pv/foo`')
//   })()
