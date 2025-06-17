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

# Create changelog table
beeline -u "$BEELINE_URL" -e "
CREATE TABLE IF NOT EXISTS DATABASECHANGELOG (
    id STRING,
    author STRING,
    filename STRING,
    dateexecuted STRING,
    orderexecuted INT,
    status STRING,
    checksum STRING
) USING DELTA LOCATION '/data/$SCHEMA_NAME/database_changelog';
"

# Get list of applied migrations
APPLIED_IDS=$(beeline -u "$BEELINE_URL" --silent=true --outputformat=tsv2 -e "SELECT id FROM DATABASECHANGELOG;" 2>/dev/null || true)

order=1
while read -r file; do
  filepath="$CHANGELOG_DIR/$file"
  echo "[INFO] Processing $file..."

  # Extract author and id
  changeline=$(grep -i '^-- changeset' "$filepath")
  author=$(echo "$changeline" | sed 's/-- changeset //' | cut -d ':' -f1)
  id=$(echo "$changeline" | sed 's/-- changeset //' | cut -d ':' -f2)

  if echo "$APPLIED_IDS" | grep -q "^$id$"; then
    echo "[INFO] Skipping already applied: $file"
  else
    # Compute checksum
    checksum=$(sha256sum "$filepath" | awk '{ print $1 }')
    echo "[INFO] Applying $file (id=$id, checksum=$checksum)"

    # Run migration with envsubst
    envsubst < "$filepath" > /tmp/_temp_migration.sql
    beeline -u "$BEELINE_URL" -f /tmp/_temp_migration.sql

    # Insert changelog row
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    beeline -u "$BEELINE_URL" -e "
      INSERT INTO DATABASECHANGELOG VALUES (
        '$id', '$author', '$file', '$timestamp', $order, 'EXECUTED', '$checksum'
      );
    "
  fi

  ((order++))
done <"$INDEX_FILE"