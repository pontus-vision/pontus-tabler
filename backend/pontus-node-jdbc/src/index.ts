// export { default as Connection } from './connection';
// export { default as DriverManager } from './drivermanager';
// export { default as Jinst } from './jinst';
// export { default as Pool } from './pool';
// export { default as PreparedStatement } from './preparedstatement';
// export { default as ResultSet } from './resultset';
// export { default as ResultSetMetaData } from './resultsetmetadata';
// export { default as SQLWarning } from './sqlwarning';
// export { default as Statement } from './statement';

import Pool from './pool.js'

const pool = new Pool({
    url: 'jdbc:hive2://delta-db:10000',   // Replace with your JDBC URL
    properties: {
      user: 'admin',           // Database username
      password: 'user'        // Database password
    },
    drivername: 'org.apache.hive.jdbc.HiveDriver', // Driver class name
    minpoolsize: 2,
    maxpoolsize: 10,
    keepalive: {
      interval: 60000,
      query: 'SELECT 1',
      enabled: true
    },
    logging: {
      level: 'info'
    }
  });
  
  // Initialize pool
  async function initializePool() {
    try {
      await pool.initialize();
      console.log('Pool initialized successfully.');
    } catch (error) {
      console.error('Error initializing the pool:', error);
    }
  }

  (async()=>{
    await initializePool()

  })()
