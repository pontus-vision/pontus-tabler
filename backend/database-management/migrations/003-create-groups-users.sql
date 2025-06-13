-- changeset :003
-- Migration: create-groups-users
-- Created: Fri Jun 13 16:00:40 UTC 2025

-- Write your SQL commands below this line

CREATE TABLE IF NOT EXISTS groups_users (id STRING, table_from__id STRING, table_from__name STRING, table_to__id STRING, table_to__username STRING, edge_label STRING) USING DELTA LOCATION "/data/pv/groups_users"