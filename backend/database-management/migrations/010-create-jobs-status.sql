-- changeset you:010-create-jobs-status
-- description: create-jobs-status

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.jobs_status (
    id STRING NOT NULL,
    job_id STRING NOT NULL,
    last_run_time TIMESTAMP,
    status STRING NOT NULL,
) USING DELTA LOCATION "/data/$SCHEMA_NAME/jobs_status";
