#!/bin/bash

set -e

BEELINE_URL="jdbc:hive2://delta-db:10000/default"
CHANGELOG_DIR="migrations"
INDEX_FILE="migrations/changelog_index.txt"

echo "[INFO] Connecting to Hive at: $BEELINE_URL"

# Create DATABASECHANGELOG table if it does not exist
echo "[INFO] Ensuring DATABASECHANGELOG table exists..."
beeline -u "$BEELINE_URL" -e "
CREATE TABLE IF NOT EXISTS DATABASECHANGELOG (
    id STRING,
    author STRING,
    filename STRING,
    dateexecuted STRING,
    orderexecuted INT,
    status STRING
)
USING DELTA LOCATION '/data/pv/database_changelog';
"

# Fetch applied changeset IDs from DATABASECHANGELOG
echo "[INFO] Fetching already applied changelog IDs..."
APPLIED_IDS=$(beeline -u "$BEELINE_URL" --silent=true --outputformat=tsv2 -e "SELECT id FROM DATABASECHANGELOG;" 2>/dev/null)
echo "[INFO] Fetched applied IDs:"
echo "$APPLIED_IDS"

order=1
while read -r file; do
  filepath="$CHANGELOG_DIR/$file"
  echo "[INFO] Processing file: $filepath"

  if [ ! -f "$filepath" ]; then
    echo "[ERROR] File not found: $filepath"
    exit 1
  fi

  changeline=$(grep -i '^-- changeset' "$filepath" || true)
  if [ -z "$changeline" ]; then
    echo "[ERROR] No changeset header found in $filepath"
    exit 1
  fi

  author=$(echo "$changeline" | sed 's/-- changeset //' | cut -d ':' -f1)
  id=$(echo "$changeline" | sed 's/-- changeset //' | cut -d ':' -f2)

  if echo "$APPLIED_IDS" | grep -q "^$id$"; then
    echo "[INFO] Skipping already applied: $file"
  else
    echo "[INFO] Applying: $file (id=$id, author=$author)"
    echo "[INFO] Executing SQL..."

    migration_output=$(beeline -u "$BEELINE_URL" -f "$filepath" 2>&1)
    migration_exit=$?

    echo "$migration_output"

    if [ $migration_exit -ne 0 ]; then
      echo "[ERROR] Migration failed for $file"
      exit 1
    fi

    timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    echo "[INFO] Logging migration to DATABASECHANGELOG"
    beeline -u "$BEELINE_URL" -e "
      INSERT INTO DATABASECHANGELOG
      VALUES ('$id', '$author', '$file', '$timestamp', $order, 'EXECUTED');
    "
  fi

  ((order++))
done <"$INDEX_FILE"

echo "[INFO] All migrations processed."

