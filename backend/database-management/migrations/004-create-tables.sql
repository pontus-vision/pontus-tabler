-- changeset :004
-- Migration: create-tables
-- Created: Fri Jun 13 16:02:10 UTC 2025

-- Write your SQL commands below this line

CREATE TABLE IF NOT EXISTS tables (id STRING, name STRING, label STRING, cols ARRAY<STRUCT<id STRING, name STRING, field STRING, sortable BOOLEAN, header_name STRING, filter BOOLEAN, kind STRING, pivotIndex INTEGER, description STRING, regex STRING>>) USING DELTA LOCATION "/data/pv/tables"