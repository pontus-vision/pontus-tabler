-- changeset you:008-create-auditions
-- description: create-audit

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.audit (
    session_id STRING,
    api_path STRING,
    body STRING,
    error STRING,
    user_id STRING,
    group_ids STRING,
    created_at TIMESTAMP
) USING DELTA LOCATION "/$DATA_DIR/$SCHEMA_NAME/audit";
