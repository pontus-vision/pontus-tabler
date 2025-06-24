#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BEELINE_URL="jdbc:hive2://delta-db:10000/default"
CHANGELOG_DIR="$SCRIPT_DIR/migrations"
INDEX_FILE="$CHANGELOG_DIR/changelog_index.txt"
SCHEMA_NAME="pv_${ENVIRONMENT_MODE:-dev}"
export SCHEMA_NAME

echo "[INFO] Using schema: $SCHEMA_NAME"
echo "[INFO] Ensuring DATABASECHANGELOG table exists..."

# Create changelog table if it doesn't exist
beeline -u "$BEELINE_URL" -e "
CREATE TABLE IF NOT EXISTS DATABASECHANGELOG (
    id STRING,
    author STRING,
    filename STRING,
    dateexecuted STRING,
    orderexecuted INT,
    status STRING,
    checksum STRING
)
USING DELTA LOCATION '/data/$SCHEMA_NAME/database_changelog';
"

order=1
while read -r file; do
  filepath="$CHANGELOG_DIR/$file"
  echo "[INFO] Processing $file..."

  if [ ! -f "$filepath" ]; then
    echo "[WARN] File not found: $filepath. Skipping."
    continue
  fi

  # Extract changeset header
  changeline=$(grep -i '^-- changeset' "$filepath" || true)
  if [ -z "$changeline" ]; then
    echo "[ERROR] No changeset header found in $file"
    exit 1
  fi

  author=$(echo "$changeline" | sed 's/-- changeset //' | cut -d ':' -f1)
  id=$(echo "$changeline" | sed 's/-- changeset //' | cut -d ':' -f2)

  # Compute checksum
  checksum=$(sha256sum "$filepath" | awk '{ print $1 }')

  # Check if already applied
  stored_checksum=$(beeline -u "$BEELINE_URL" --silent=true --outputformat=tsv2 -e "
    SELECT checksum FROM DATABASECHANGELOG WHERE id = '$id';
  " 2>/dev/null | tail -n +2 | tr -d '\r')

  if [ -n "$stored_checksum" ]; then
    if [ "$stored_checksum" == "$checksum" ]; then
      echo "[INFO] Skipping already applied: $file"
    else
      echo "[ERROR] Migration '$file' has been modified after it was applied!"
      echo "[ERROR] Stored checksum: $stored_checksum"
      echo "[ERROR] Current checksum: $checksum"
      exit 1
    fi
  else
    echo "[INFO] Applying $file (id=$id, checksum=$checksum)"

    # Apply migration with env substitution
    envsubst < "$filepath" > /tmp/_temp_migration.sql
    beeline -u "$BEELINE_URL" -f /tmp/_temp_migration.sql

    # Log into changelog table
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    beeline -u "$BEELINE_URL" -e "
      INSERT INTO DATABASECHANGELOG VALUES (
        '$id', '$author', '$file', '$timestamp', $order, 'EXECUTED', '$checksum'
      );
    "
  fi

  ((order++))
done <"$INDEX_FILE"