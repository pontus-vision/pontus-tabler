-- changeset you:006-create-menu
-- description: create-menu

CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.menu (
    id STRING, 
    tree_obj_str STRING
) USING DELTA LOCATION "/$DATA_DIR/$SCHEMA_NAME/menu";
