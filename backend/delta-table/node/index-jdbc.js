"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQuery = exports.createConnection = void 0;
// Import necessary modules
const jdbc_1 = __importDefault(require("jdbc")); // Use default import
const jinst_1 = __importDefault(require("jdbc/lib/jinst")); // Use default import
const classPath = (_a = process.env['CLASSPATH']) === null || _a === void 0 ? void 0 : _a.split(',');
if (!jinst_1.default.isJvmCreated()) {
    jinst_1.default.addOption('-Xrs');
    jinst_1.default.setupClasspath(classPath || []); // Path to your JDBC driver JAR file
}
const config = {
    url: 'jdbc:hive2://localhost:10000', // Update the connection URL according to your setup
    drivername: 'org.apache.hive.jdbc.HiveDriver', // Driver class name
    properties: {
        user: 'NBuser',
        password: '',
    },
};
// Initialize the JDBC connection
const jdbc = new jdbc_1.default(config);
jdbc.initialize((err) => {
    if (err) {
        console.log('Error initializing JDBC', err);
    }
    else {
        console.log('JDBC initialized');
    }
});
const createConnection = (conn) => { };
exports.createConnection = createConnection;
// Function to execute a query
function executeQuery(jdbc, query) {
    jdbc.reserve((err, connObj) => {
        if (err) {
            console.log('Error reserving connection', err);
        }
        else {
            const conn = connObj.conn;
            conn.createStatement((stmtErr, statement) => {
                if (stmtErr) {
                    console.log('Error creating statement', stmtErr);
                }
                else {
                    statement.executeQuery(query, (queryErr, resultSet) => {
                        if (queryErr) {
                            console.log('Error executing query', queryErr);
                        }
                        else {
                            resultSet.toObjArray((resultErr, results) => {
                                if (resultErr) {
                                    console.log('Error converting result set', resultErr);
                                }
                                else {
                                    console.table(results);
                                }
                                // Close the result set and connection after use
                                resultSet.close((closeErr) => {
                                    if (closeErr) {
                                        console.log('Error closing result set', closeErr);
                                    }
                                });
                                conn.close((closeErr) => {
                                    if (closeErr) {
                                        console.log('Error closing connection', closeErr);
                                    }
                                });
                                // Always release the connection after use
                                jdbc.release(connObj, (releaseErr) => {
                                    if (releaseErr) {
                                        console.log('Error releasing connection', releaseErr);
                                    }
                                    else {
                                        console.log('Connection released');
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
    });
}
exports.executeQuery = executeQuery;
exports.default = jdbc;
