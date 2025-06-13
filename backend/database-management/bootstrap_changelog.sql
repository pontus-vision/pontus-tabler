CREATE TABLE IF NOT EXISTS DATABASECHANGELOG (
  id STRING,
  author STRING,
  filename STRING,
  dateexecuted TIMESTAMP,
  orderexecuted INT,
  exectype STRING
) USING DELTA LOCATION '/data/pv/database_changelog';
