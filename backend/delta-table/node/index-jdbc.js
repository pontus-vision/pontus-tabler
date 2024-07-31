"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQuery = exports.createConnection = exports.config = exports.classPath = void 0;
// Import necessary modules
const jdbc_1 = __importDefault(require("jdbc")); // Use default import
const jinst_1 = __importDefault(require("jdbc/lib/jinst")); // Use default import
exports.classPath = (_a = process.env['CLASSPATH']) === null || _a === void 0 ? void 0 : _a.split(',');
if (!jinst_1.default.isJvmCreated()) {
    jinst_1.default.addOption('-Xrs');
    jinst_1.default.setupClasspath(exports.classPath || []); // Path to your JDBC driver JAR file
}
exports.config = {
    url: 'jdbc:hive2://localhost:10000', // Update the connection URL according to your setup
    drivername: 'org.apache.hive.jdbc.HiveDriver', // Driver class name
    properties: {
        user: 'NBuser',
        password: '',
    },
};
// Initialize the JDBC connection
const jdbc = new jdbc_1.default(exports.config);
jdbc.initialize((err) => {
    if (err) {
        console.log('Error initializing JDBC', err);
    }
    else {
        console.log('JDBC initialized');
    }
});
const createConnection = () => {
    var _a;
    return (_a = jdbc.reserve((err, connObj) => {
        if (connObj) {
            return connObj;
        }
        if (err) {
            throw err;
        }
    })) === null || _a === void 0 ? void 0 : _a.conn;
};
exports.createConnection = createConnection;
// Function to execute a query
function executeQuery(query, conn) {
    return new Promise((resolve, reject) => {
        conn.createStatement((stmtErr, statement) => {
            if (stmtErr) {
                console.log('Error creating statement', stmtErr);
                reject(`Error creating statement ${stmtErr}`);
            }
            else {
                /*
        │ (index) │             application_id             │ level_1_state  │ level_2_state  │ level_3_state  │ level_4_state  │      event_timestamp      │     ingestion_timestamp      │
        ├─────────┼────────────────────────────────────────┼────────────────┼────────────────┼────────────────┼────────────────┼───────────────────────────┼──────────────────────────────┤
        │    0    │ '0e88bd1f-a83c-4e4b-919d-13ae36637af1' │ 'Unclassified' │ 'Unclassified' │ 'Unclassified' │ 'Unclassified' │ '2022-08-22 08:47:07.518' │ '2024-06-11 08:28:51.222479' │
        │    1    │ '16c4c5f9-9a57-4ee5-ba23-b3e5bc24e685' │ 'Unclassified' │ 'Unclassified' │ 'Unclassified' │ 'Unclassified' │ '2022-08-22 08:52:12.696' │ '2024-06-11 08:30:31.452385' │
        */
                statement.executeQuery(query, (queryErr, resultSet) => {
                    //statement.executeQuery("INSERT INTO app_history (application_id,level_1_state, level_2_state,level_3_state,level_4_state, event_timestamp, ingestion_timestamp) VALUES ('aaa', 'bbb','ccc','ddd', 'eee', '2022-08-22 08:47:07.518', '2024-06-11 08:28:51.222479')", (queryErr: Error | null, resultSet: ResultSet) => {
                    if (queryErr) {
                        console.log('Error executing query', queryErr);
                        reject(`Error creating statement ${queryErr}`);
                    }
                    else {
                        resultSet.toObjArray((resultErr, results) => {
                            if (resultErr) {
                                console.log('Error converting result set', resultErr);
                            }
                            else {
                                console.table(results);
                            }
                            resultSet.close((e) => console.log(`${e}`));
                            resolve(results);
                            // statement.close((e) => console.log(e));
                            // close(callback: (err: Error | null) => void): void;
                            // conn.close((e) => console.log(`${e}`));
                            // // Always release the connection after use
                            // jdbc.release(connObj, (releaseErr: Error | null) => {
                            //   if (releaseErr) {
                            //     console.log('Error releasing connection', releaseErr);
                            //   } else {
                            //     console.log('Connection released');
                            //   }
                            // });
                        });
                    }
                });
            }
        });
    });
}
exports.executeQuery = executeQuery;
exports.default = jdbc;
