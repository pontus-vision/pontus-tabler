-- changeset you:011-create-groups-dashboards
-- description: create-groups-dashboards

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.groups_dashboards (
    id STRING,
    table_from__id STRING,
    table_from__name STRING,
    table_from__create STRING,
    table_from__delete STRING,
    eable_from__read STRING,
    table_from__update STRING,
    table_to__id STRING,
    table_to__name STRING,
    table_to__create STRING,
    table_to__read STRING,
    table_to__update STRING,
    table_to__delete STRING,
    edge_label STRING
) USING DELTA LOCATION "/$DATA_PREFIX/$SCHEMA_NAME/groups_dashboards";