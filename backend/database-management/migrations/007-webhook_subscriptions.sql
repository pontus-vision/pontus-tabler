-- changeset you:007-webhook_subscriptions
-- description: webhook_subscriptions

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.webhook_subscriptions (
          id STRING,
          user_id STRING NOT NULL,
          context STRING NOT NULL,
          table_filter STRING NOT NULL,
          operation STRING NOT NULL,
          endpoint STRING NOT NULL,
          secret_token_link STRING NOT NULL
) USING DELTA LOCATION "$DATA_PREFIX/$SCHEMA_NAME/webhook_subscriptions";
