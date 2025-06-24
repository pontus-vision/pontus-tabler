-- changeset you:002-create-auth-users
-- description: create-auth-users

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.auth_users (
    id STRING
) USING DELTA LOCATION "/data/$SCHEMA_NAME/auth_users";
