-- changeset you:001-create-auth-groups
-- description: create-auth-groups

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.auth_users (
    id STRING
) USING DELTA LOCATION "/data/$SCHEMA_NAME/auth_users";
