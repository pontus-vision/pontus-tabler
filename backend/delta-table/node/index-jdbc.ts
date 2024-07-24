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

interface Connection {
  createStatement(
    callback: (err: Error | null, statement: Statement) => void,
  ): void;
  close(callback: (err: Error | null) => void): void;
}

interface Statement {
  executeQuery(
    sql: string,
    callback: (err: Error | null, resultSet: ResultSet) => void,
  ): void;
}

interface ResultSet {
  toObjArray(callback: (err: Error | null, results: object[]) => void): void;
  close(callback: (err: Error | null) => void): void;
}

interface ConnectionObject {
  conn: Connection;
}

const classPath = process.env['CLASSPATH']?.split(',');

if (!Jinst.isJvmCreated()) {
  Jinst.addOption('-Xrs');
  Jinst.setupClasspath(classPath || []); // Path to your JDBC driver JAR file
}

const config: JDBCConfig = {
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

export const createConnection = (conn: Connection) => {};

// Function to execute a query
export function executeQuery(jdbc: JDBC, query: string) {
  jdbc.reserve((err: Error | null, connObj: ConnectionObject) => {
    if (err) {
      console.log('Error reserving connection', err);
    } else {
      const conn: Connection = connObj.conn;
      conn.createStatement((stmtErr: Error | null, statement: Statement) => {
        if (stmtErr) {
          console.log('Error creating statement', stmtErr);
        } else {
          statement.executeQuery(
            query,
            (queryErr: Error | null, resultSet: ResultSet) => {
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
                    // Close the result set and connection after use
                    resultSet.close((closeErr: Error | null) => {
                      if (closeErr) {
                        console.log('Error closing result set', closeErr);
                      }
                    });
                    conn.close((closeErr: Error | null) => {
                      if (closeErr) {
                        console.log('Error closing connection', closeErr);
                      }
                    });
                    // Always release the connection after use
                    jdbc.release(connObj, (releaseErr: Error | null) => {
                      if (releaseErr) {
                        console.log('Error releasing connection', releaseErr);
                      } else {
                        console.log('Connection released');
                      }
                    });
                  },
                );
              }
            },
          );
        }
      });
    }
  });
}

export default jdbc;
