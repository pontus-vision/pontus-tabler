#!/bin/bash
set -e

read -p "Enter migration name (e.g., create-users): " name
INDEX_FILE="migrations/changelog_index.txt"
TIMESTAMP=$(date +"%s")
FILENAME=$(printf "%03d-%s.sql" "$(($(wc -l < $INDEX_FILE)+1))" "$name")
FULL_PATH="migrations/$FILENAME"

echo "[INFO] Creating $FULL_PATH"
cat <<EOF > "$FULL_PATH"
-- changeset you:$(basename "$FILENAME" .sql)
-- description: $name
-- checksum: will-be-calculated

CREATE TABLE IF NOT EXISTS \$SCHEMA_NAME.your_table_name (
    id STRING
) USING DELTA LOCATION "/data/\$SCHEMA_NAME/your_table_name";
EOF

echo "$FILENAME" >> "$INDEX_FILE"
