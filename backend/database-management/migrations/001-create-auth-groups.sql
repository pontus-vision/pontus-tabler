-- changeset paulo:001
-- Migration: create-auth-groups
-- Created: Thu Jun 12 23:50:19 UTC 2025

-- Write your SQL commands below this line
CREATE TABLE IF NOT EXISTS auth_users (id STRING, username STRING, password STRING) USING DELTA LOCATION "/data/pv/auth_users";