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
    filename STRING,
    checksum STRING,
    id STRING,
    author STRING,
    dateexecuted STRING,
    orderexecuted INT,
    status STRING
)
USING DELTA LOCATION '/data/$SCHEMA_NAME/database_changelog';
"

echo "[INFO] Fetching applied migrations..."
APPLIED=$(beeline -u "$BEELINE_URL" --silent=true --outputformat=tsv2 -e "SELECT filename, checksum FROM DATABASECHANGELOG;" 2>/dev/null || true)

order=1

while read -r filename; do
  filepath="$CHANGELOG_DIR/$filename"

  if [[ ! -f "$filepath" ]]; then
    echo "[WARN] Skipping missing file: $filepath"
    continue
  fi

  checksum=$(sha256sum "$filepath" | awk '{print $1}')
  already_applied=$(echo "$APPLIED" | grep -F "$filename" | awk '{print $2}')
  run_on_change=$(grep -i "^-- runOnChange" "$filepath" || true)

  if [[ "$already_applied" == "$checksum" ]]; then
    echo "[SKIP] $filename already applied with matching checksum."
    continue
  elif [[ -n "$already_applied" && -z "$run_on_change" ]]; then
    echo "[ERROR] $filename was already applied but checksum changed and no '-- runOnChange' flag found."
    exit 1
  fi

  echo "[APPLY] $filename (checksum: $checksum)"
  changeline=$(grep -i '^-- changeset' "$filepath")
  author=$(echo "$changeline" | sed 's/-- changeset //' | cut -d ':' -f1)
  id=$(echo "$changeline" | sed 's/-- changeset //' | cut -d ':' -f2)
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')

  envsubst <"$filepath" >/tmp/_temp_migration.sql
  beeline -u "$BEELINE_URL" -f /tmp/_temp_migration.sql

  beeline -u "$BEELINE_URL" -e "
    INSERT INTO DATABASECHANGELOG VALUES (
      '$filename', '$checksum', '$id', '$author', '$timestamp', $order, 'EXECUTED'
    );
  "

  ((order++))
done <"$INDEX_FILE"

echo "[INFO] All migrations applied successfully."
