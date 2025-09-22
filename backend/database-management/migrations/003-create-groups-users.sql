-- changeset you:003-create-groups-users
-- description: create-groups-users

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.groups_users (
    id STRING, 
    table_from__id STRING, 
    table_from__name STRING, 
    table_to__id STRING, 
    table_to__username STRING, 
    edge_label STRING
) USING DELTA LOCATION "/$DATA_DIR/$SCHEMA_NAME/groups_users";
