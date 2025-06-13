-- changeset :002
-- Migration: create-auth-users
-- Created: Fri Jun 13 15:57:08 UTC 2025

-- Write your SQL commands below this line

CREATE TABLE IF NOT EXISTS auth_users (id STRING, username STRING, password STRING) USING DELTA LOCATION "/data/pv/auth_users";