-- changeset you:003-create-groups-users
-- description: create-groups-users

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.groups_users (
    id STRING
) USING DELTA LOCATION "/data/$SCHEMA_NAME/groups_users";
