// Import necessary modules
import JDBC from 'jdbc'; // Use default import
import Jinst from 'jdbc/lib/jinst'; // Use default import

interface JDBCConfig {
  url: string;
  drivername: string;
  properties: {
    user: string;
    password: string;
  };
}

export interface Connection {
  createStatement(
    callback: (err: Error | null, statement: Statement) => void,
  ): void;
  close(callback: (err: Error | null) => void): void;
}

export interface Statement {
  executeQuery(
    sql: string,
    callback: (err: Error | null, resultSet: ResultSet) => void,
  ): void;
}

export interface ResultSet {
  toObjArray(callback: (err: Error | null, results: object[]) => void): void;
  close(callback: (err: Error | null) => void): void;
}

export interface ConnectionObject {
  conn: Connection;
}

export const classPath = process.env['CLASSPATH']?.split(',');

if (!Jinst.isJvmCreated()) {
  Jinst.addOption('-Xrs');
  Jinst.setupClasspath(classPath || []); // Path to your JDBC driver JAR file
}

export const config: JDBCConfig = {
  url: 'jdbc:hive2://localhost:10000', // Update the connection URL according to your setup
  drivername: 'org.apache.hive.jdbc.HiveDriver', // Driver class name
  properties: {
    user: 'NBuser',
    password: '',
  },
};

// Initialize the JDBC connection
const jdbc = new JDBC(config);
jdbc.initialize((err: Error | null) => {
  if (err) {
    console.log('Error initializing JDBC', err);
  } else {
    console.log('JDBC initialized');
  }
});

export const createConnection = (): Connection => {
  return jdbc.reserve((err: Error | null, connObj: ConnectionObject) => {
    if (connObj){
      return connObj
    }
    if (err) {
      throw err;
    }
  })?.conn;
};

// Function to execute a query
export function executeQuery(query: string, conn: Connection) {
  conn.createStatement((stmtErr: Error | null, statement: Statement) => {
    if (stmtErr) {
      console.log('Error creating statement', stmtErr);
    } else {
      /*
│ (index) │             application_id             │ level_1_state  │ level_2_state  │ level_3_state  │ level_4_state  │      event_timestamp      │     ingestion_timestamp      │
├─────────┼────────────────────────────────────────┼────────────────┼────────────────┼────────────────┼────────────────┼───────────────────────────┼──────────────────────────────┤
│    0    │ '0e88bd1f-a83c-4e4b-919d-13ae36637af1' │ 'Unclassified' │ 'Unclassified' │ 'Unclassified' │ 'Unclassified' │ '2022-08-22 08:47:07.518' │ '2024-06-11 08:28:51.222479' │
│    1    │ '16c4c5f9-9a57-4ee5-ba23-b3e5bc24e685' │ 'Unclassified' │ 'Unclassified' │ 'Unclassified' │ 'Unclassified' │ '2022-08-22 08:52:12.696' │ '2024-06-11 08:30:31.452385' │
*/
      statement.executeQuery(
        query,
        (queryErr: Error | null, resultSet: ResultSet) => {
          //statement.executeQuery("INSERT INTO app_history (application_id,level_1_state, level_2_state,level_3_state,level_4_state, event_timestamp, ingestion_timestamp) VALUES ('aaa', 'bbb','ccc','ddd', 'eee', '2022-08-22 08:47:07.518', '2024-06-11 08:28:51.222479')", (queryErr: Error | null, resultSet: ResultSet) => {
          if (queryErr) {
            console.log('Error executing query', queryErr);
          } else {
            resultSet.toObjArray(
              (resultErr: Error | null, results: object[]) => {
                if (resultErr) {
                  console.log('Error converting result set', resultErr);
                } else {
                  console.table(results);
                }
                // statement.close((e) => console.log(e));
                // close(callback: (err: Error | null) => void): void;
                resultSet.close((e) => console.log(`${e}`));
                // conn.close((e) => console.log(`${e}`));

                // // Always release the connection after use
                // jdbc.release(connObj, (releaseErr: Error | null) => {
                //   if (releaseErr) {
                //     console.log('Error releasing connection', releaseErr);
                //   } else {
                //     console.log('Connection released');
                //   }
                // });
              },
            );
          }
        },
      );
    }
  });
}
