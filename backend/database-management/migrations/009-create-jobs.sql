-- changeset you:009-create-jobs
-- description: create-jobs

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.jobs (
    id STRING NOT NULL,
    name STRING NOT NULL,
    type STRING NOT NULL,
    query STRING NOT NULL,
    frequency STRING NOT NULL
) USING DELTA LOCATION "/data/$SCHEMA_NAME/jobs";
