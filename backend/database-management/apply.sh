#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BEELINE_URL="jdbc:hive2://delta-db:10000/default"
CHANGELOG_DIR="$SCRIPT_DIR/migrations"
INDEX_FILE="$CHANGELOG_DIR/changelog_index.txt"
SCHEMA_NAME="pv_${ENVIRONMENT_MODE}"
DATA_DIR="${DATA_DIR}"

export SCHEMA_NAME

echo "[INFO] Using schema: $SCHEMA_NAME"

# Ensure the schema exists
echo "[INFO] Ensuring schema $SCHEMA_NAME exists..."
beeline -u "$BEELINE_URL" -e "CREATE SCHEMA IF NOT EXISTS $SCHEMA_NAME;"

# Ensure the changelog table exists
echo "[INFO] Ensuring $SCHEMA_NAME.DATABASECHANGELOG table exists..."
beeline -u "$BEELINE_URL" -e "
CREATE TABLE IF NOT EXISTS $SCHEMA_NAME.DATABASECHANGELOG (
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

beeline -u "jdbc:hive2://delta-db:10000/default" -e "SHOW TABLES IN $SCHEMA_NAME;"
beeline -u "$BEELINE_URL" -e "SELECT * FROM $SCHEMA_NAME.DATABASECHANGELOG;"

order=1

while read -r filename; do
  filepath="$CHANGELOG_DIR/$filename"
  echo "[INFO] Processing $filename"

  if [[ ! -f "$filepath" ]]; then
    echo "[WARN] Skipping missing file: $filepath"
    continue
  fi

  checksum=$(sha256sum "$filepath" | awk '{print $1}')
  echo "[DEBUG] Local checksum for $filename: $checksum"

  run_on_change=$(grep -i "^-- runOnChange" "$filepath" || true)
  changeline=$(grep -i '^-- changeset' "$filepath" || true)
  author=$(echo "$changeline" | sed 's/-- changeset //' | cut -d ':' -f1)
  id=$(echo "$changeline" | sed 's/-- changeset //' | cut -d ':' -f2)
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')

  # Fetch checksum from DB for this filename
  db_checksum=$(beeline -u "$BEELINE_URL" --silent=true --outputformat=tsv2 -e \
    "SELECT checksum FROM $SCHEMA_NAME.DATABASECHANGELOG WHERE filename = '$filename';" 2>/dev/null | grep -v '^checksum' | tail -n 1)

  echo "[DEBUG] DB checksum for $filename: $db_checksum"
  echo "[DEBUG] runOnChange present? ${run_on_change:+yes}"

  if [[ "$db_checksum" == "$checksum" ]]; then
    echo "[SKIP] $filename already applied with matching checksum."
    continue
  elif [[ -n "$db_checksum" && -z "$run_on_change" ]]; then
    echo "[ERROR] $filename was already applied but checksum changed and no '-- runOnChange' flag found."
    exit 1
  fi

  echo "[APPLY] $filename (id=$id, author=$author, checksum=$checksum)"
  envsubst <"$filepath" >/tmp/_temp_migration.sql
  beeline -u "$BEELINE_URL" -f /tmp/_temp_migration.sql

  beeline -u "$BEELINE_URL" -e "
    INSERT INTO $SCHEMA_NAME.DATABASECHANGELOG VALUES (
      '$filename', '$checksum', '$id', '$author', '$timestamp', $order, 'EXECUTED'
    );
  "

  ((order++))
done <"$INDEX_FILE"

echo "[INFO] All migrations applied successfully."
