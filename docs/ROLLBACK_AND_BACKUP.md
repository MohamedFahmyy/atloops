# AT LOOPS Enterprise — Disaster Recovery, Backup & Rollback Protocols

**Document Revision:** 1.0  
**Effective Date:** October 17, 2026  
**Audience:** Operations Engineers & DevOps Personnel  

---

## 1. Automated Nightly Backup Configuration

Add the following tasks to the server's root crontab (`sudo crontab -e`):

```bash
# 1. Nightly MySQL database dump at 02:00 AM UTC with gzip compression
0 2 * * * mysqldump -u atloops_app_user -p'SECURE_PASSWORD' --single-transaction --quick --routines --triggers atloops_enterprise_prod | gzip > /var/backups/atloops/db_backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql.gz

# 2. Nightly media assets archive at 02:30 AM UTC
30 2 * * * tar -czf /var/backups/atloops/media_backup_$(date +\%Y\%m\%d_\%H\%M\%S).tar.gz -C /var/www/atloops-enterprise/backend/storage/app/public uploads

# 3. Retention policy: Automatically purge backups older than 30 days
0 4 * * * find /var/backups/atloops -name "*_backup_*.gz" -mtime +30 -exec rm {} \;
```

---

## 2. On-Demand Pre-Deployment Snapshot

Always execute an on-demand snapshot immediately prior to initiating any release or database migration:

```bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p /var/backups/atloops/pre_deploy_${TIMESTAMP}

# 1. Export database snapshot
mysqldump -u atloops_app_user -p atloops_enterprise_prod --single-transaction --quick > /var/backups/atloops/pre_deploy_${TIMESTAMP}/db_snapshot.sql

# 2. Archive uploaded media assets
tar -czf /var/backups/atloops/pre_deploy_${TIMESTAMP}/media_snapshot.tar.gz -C /var/www/atloops-enterprise/backend/storage/app/public uploads

# 3. Record current Git commit hash
git -C /var/www/atloops-enterprise rev-parse HEAD > /var/backups/atloops/pre_deploy_${TIMESTAMP}/git_commit.txt

echo "Pre-deployment snapshot saved at /var/backups/atloops/pre_deploy_${TIMESTAMP}"
```

---

## 3. Disaster Recovery: Database Restore Procedure

If database corruption or accidental deletion occurs:

### Step 1: Put Backend into Maintenance Mode
```bash
cd /var/www/atloops-enterprise/backend
php artisan down --secret="atloops-recovery-bypass-2026" --render="errors::503"
```

### Step 2: Restore Database from Backup
```bash
# Decompress and import snapshot
gunzip -c /var/backups/atloops/db_backup_YYYYMMDD_HHMMSS.sql.gz | mysql -u atloops_app_user -p atloops_enterprise_prod
```

### Step 3: Clear and Re-cache Application Configuration
```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 4: Deactivate Maintenance Mode
```bash
php artisan up
```

---

## 4. Emergency Application Rollback Procedure

If a deployed release introduces unexpected regressions or critical errors:

### Step 1: Activate Maintenance Mode
```bash
cd /var/www/atloops-enterprise/backend
php artisan down
```

### Step 2: Roll Back Codebase to Previous Stable Commit
```bash
cd /var/www/atloops-enterprise
git checkout <PREVIOUS_STABLE_COMMIT_OR_TAG>
```

### Step 3: Rebuild Frontend Assets
```bash
cd frontend
npm ci --prefer-offline
npm run build
```

### Step 4: Revert Database Migrations (If Needed)
```bash
cd ../backend

# If the release included migrations, roll back the last batch:
php artisan migrate:rollback --step=1

# Alternatively, restore the pre-deployment database snapshot:
mysql -u atloops_app_user -p atloops_enterprise_prod < /var/backups/atloops/pre_deploy_<TIMESTAMP>/db_snapshot.sql
```

### Step 5: Clear Caches and Restart Services
```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan queue:restart
sudo systemctl reload php8.4-fpm
sudo systemctl reload nginx
php artisan up
```

### Step 6: Verify System Health
```bash
curl -i https://atloops.com/api/v1/health
```
