-- changeset you:002-create-auth-users
-- description: create-auth-users

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.auth_users (
    id STRING,
    username STRING, 
    password STRING
) USING DELTA LOCATION "$DATA_PREFIX/$SCHEMA_NAME/auth_users";
