-- changeset you:004-create-tables
-- description: create-tables

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.tables (
    id STRING,
    name STRING, 
    label STRING, 
    cols ARRAY<
        STRUCT<
            id STRING, 
            name STRING, 
            field STRING, 
            sortable BOOLEAN, 
            header_name STRING, 
            filter BOOLEAN, 
            kind STRING, 
            pivotIndex INTEGER, 
            description STRING, 
            regex STRING
        >
    >
) USING DELTA LOCATION "$DATA_PREFIX/$SCHEMA_NAME/tables";
