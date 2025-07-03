-- changeset you:005-create-dashboards
-- description: create-dashboards

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.dashboards (
    id STRING, 
    name STRING, 
    owner STRING, 
    state STRING, 
    folder STRING
) USING DELTA LOCATION "/data/$SCHEMA_NAME/dashboards";
