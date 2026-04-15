#!/bin/bash

BACKUP_DIR="$(dirname "$0")/.backups"
mkdir -p "$BACKUP_DIR"

docker exec -t users_db pg_dump -U postgres users_db > "$BACKUP_DIR/users_db_$(date +%Y%m%d_%H%M%S).sql"

echo "✅ Users DB backup saved to $BACKUP_DIR"