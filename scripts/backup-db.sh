#!/usr/bin/env bash
# backup-db.sh — PostgreSQL backup to S3/R2
# Usage: ./scripts/backup-db.sh
# Required env: DATABASE_URL, S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
# Optional env: S3_ENDPOINT (for Cloudflare R2), BACKUP_RETENTION_DAYS (default: 30)

set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/tmp/skylive_backups"
BACKUP_FILE="${BACKUP_DIR}/skylive_${TIMESTAMP}.sql.gz"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

# Parse DATABASE_URL
DB_HOST=$(echo "$DATABASE_URL" | sed 's/.*@\(.*\):.*/\1/')
DB_PORT=$(echo "$DATABASE_URL" | sed 's/.*:\([0-9]*\)\/.*/\1/')
DB_NAME=$(echo "$DATABASE_URL" | sed 's/.*\/\(.*\)/\1/')
DB_USER=$(echo "$DATABASE_URL" | sed 's/postgresql:\/\/\(.*\):.*/\1/')
DB_PASS=$(echo "$DATABASE_URL" | sed 's/postgresql:\/\/.*:\(.*\)@.*/\1/')

mkdir -p "$BACKUP_DIR"

echo "Starting backup: $BACKUP_FILE"

PGPASSWORD="$DB_PASS" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-password \
  --format=plain \
  --clean \
  --if-exists \
  | gzip > "$BACKUP_FILE"

echo "Dump created: $(du -sh "$BACKUP_FILE" | cut -f1)"

# Upload to S3 / R2
S3_KEY="backups/skylive_${TIMESTAMP}.sql.gz"

if [ -n "${S3_ENDPOINT:-}" ]; then
  # Cloudflare R2
  aws s3 cp "$BACKUP_FILE" "s3://${S3_BUCKET}/${S3_KEY}" \
    --endpoint-url "$S3_ENDPOINT" \
    --region auto
else
  # AWS S3
  aws s3 cp "$BACKUP_FILE" "s3://${S3_BUCKET}/${S3_KEY}" \
    --region "$AWS_REGION"
fi

echo "Uploaded to s3://${S3_BUCKET}/${S3_KEY}"

# Cleanup local
rm -f "$BACKUP_FILE"

# Delete old backups from S3 (older than RETENTION_DAYS)
CUTOFF=$(date -d "${RETENTION_DAYS} days ago" +%Y-%m-%dT%H:%M:%S 2>/dev/null || \
         date -v-${RETENTION_DAYS}d +%Y-%m-%dT%H:%M:%S)

echo "Cleaning backups older than ${RETENTION_DAYS} days..."

if [ -n "${S3_ENDPOINT:-}" ]; then
  aws s3 ls "s3://${S3_BUCKET}/backups/" --endpoint-url "$S3_ENDPOINT" | \
    awk -v cutoff="$CUTOFF" '$1" "$2 < cutoff {print $4}' | \
    xargs -I{} aws s3 rm "s3://${S3_BUCKET}/backups/{}" --endpoint-url "$S3_ENDPOINT" || true
else
  aws s3 ls "s3://${S3_BUCKET}/backups/" | \
    awk -v cutoff="$CUTOFF" '$1" "$2 < cutoff {print $4}' | \
    xargs -I{} aws s3 rm "s3://${S3_BUCKET}/backups/{}" || true
fi

echo "Backup complete: skylive_${TIMESTAMP}.sql.gz"
