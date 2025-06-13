#!/bin/bash

set -e

CHANGELOG_DIR="migrations"
INDEX_FILE="$CHANGELOG_DIR/changelog_index.txt"

# Ask for the migration name
read -p "Enter migration name (e.g., create-auth-groups): " NAME

# Get next ID based on number of existing migrations
ID=$(printf "%03d" $(($(ls "$CHANGELOG_DIR"/*.sql 2>/dev/null | wc -l) + 1)))

FILENAME="${ID}-${NAME}.sql"
FILEPATH="${CHANGELOG_DIR}/${FILENAME}"

# Ask for author name
read -p "Enter author name (e.g., alice): " AUTHOR

# Get timestamp
TIMESTAMP=$(date -u "+%a %b %d %T UTC %Y")

# Create the SQL file with the changeset header
cat <<EOF > "$FILEPATH"
-- changeset $AUTHOR:$ID
-- Migration: $NAME
-- Created: $TIMESTAMP

-- Write your SQL commands below this line
EOF

# Add filename to changelog index
echo "$FILENAME" >> "$INDEX_FILE"

echo "[SUCCESS] Created $FILEPATH and registered in $INDEX_FILE"
