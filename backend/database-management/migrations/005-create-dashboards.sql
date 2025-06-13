-- changeset :005
-- Migration: create-dashboards
-- Created: Fri Jun 13 16:03:24 UTC 2025

-- Write your SQL commands below this line
CREATE TABLE IF NOT EXISTS dashboards (id STRING, name STRING, owner STRING, state STRING, folder STRING) USING DELTA LOCATION "/data/pv/dashboards"