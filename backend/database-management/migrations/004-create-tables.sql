-- changeset you:004-create-tables
-- description: create-tables

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.tables (
    id STRING
) USING DELTA LOCATION "/data/$SCHEMA_NAME/tables";
