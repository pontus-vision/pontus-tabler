-- changeset :006
-- Migration: create-menu
-- Created: Fri Jun 13 16:04:32 UTC 2025

-- Write your SQL commands below this line
CREATE TABLE IF NOT EXISTS menu (id STRING, tree_obj_str STRING) USING DELTA LOCATION "/data/pv/menu"