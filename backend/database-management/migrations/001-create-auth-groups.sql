-- changeset you:001-create-auth-groups
-- description: create-auth-groups

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.auth_groups (
    id STRING, 
    name STRING, 
    create_table BOOLEAN, 
    read_table BOOLEAN, 
    update_table BOOLEAN, 
    delete_table BOOLEAN, 
    create_dashboard BOOLEAN, 
    read_dashboard BOOLEAN, 
    update_dashboard BOOLEAN, 
    delete_dashboard BOOLEAN
) USING DELTA LOCATION "$DATA_PREFIX/$SCHEMA_NAME/auth_groups";
