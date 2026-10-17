# AT LOOPS Enterprise — Backup, Disaster Recovery & Rollback Protocols

This runbook specifies standardized procedures for backing up production data, executing zero-downtime releases, and rolling back releases in case of emergency.

---

## 1. Automated & Manual Database Backups

### 1.1 Automated Nightly Dump (Cron Job)
Add the following cron task to the production server (`crontab -e` as `root` or `deploy` user):
```bash
# Nightly MySQL dump at 02:00 AM UTC with gzip compression
0 2 * * * mysqldump -u atloops_app_user -p'SECRET' --single-transaction --quick --routines --triggers atloops_enterprise_prod | gzip > /var/backups/atloops/db_backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql.gz

# Retain last 30 daily backups
0 3 * * * find /var/backups/atloops -name "db_backup_*.sql.gz" -mtime +30 -exec rm {} \;
```

### 1.2 On-Demand Pre-Deployment Backup
Before running any migrations or major updates, execute an on-demand snapshot:
```bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mysqldump -u atloops_app_user -p atloops_enterprise_prod --single-transaction --quick > /var/backups/atloops/pre_deploy_backup_${TIMESTAMP}.sql
tar -czf /var/backups/atloops/media_backup_${TIMESTAMP}.tar.gz /var/www/atloops-enterprise/backend/storage/app/public
```

---

## 2. Disaster Recovery: Database Restore Procedure

To restore from a backup:
```bash
# 1. Put backend into maintenance mode
cd /var/www/atloops-enterprise/backend
php artisan down --secret="atloops-recovery-bypass" --render="errors::503"

# 2. Decompress and restore database
gunzip -c /var/backups/atloops/db_backup_YYYYMMDD_HHMMSS.sql.gz | mysql -u atloops_app_user -p atloops_enterprise_prod

# 3. Clear all cached configurations and route tables
php artisan optimize:clear
php artisan config:cache
php artisan route:cache

# 4. Bring application back online
php artisan up
```

---

## 3. Production Deployment Procedure (Blue/Green or In-Place)

### Step 1: Update Source Code
```bash
cd /var/www/atloops-enterprise
git pull origin main
```

### Step 2: Build Frontend
```bash
cd frontend
npm ci --prefer-offline
npm run build
```

### Step 3: Update Backend Dependencies & Migrations
```bash
cd ../backend
php composer.phar install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 4: Restart Queues & PHP-FPM
```bash
php artisan queue:restart
sudo systemctl reload php8.4-fpm
sudo systemctl reload nginx
```

---

## 4. Emergency Rollback Procedure

If a deployment fails validation or causes unexpected runtime errors:

1. **Activate Maintenance Mode:**
   ```bash
   cd /var/www/atloops-enterprise/backend
   php artisan down
   ```

2. **Revert Git Release Tag:**
   ```bash
   cd /var/www/atloops-enterprise
   git checkout <PREVIOUS_STABLE_COMMIT_OR_TAG>
   ```

3. **Re-build Frontend Assets:**
   ```bash
   cd frontend
   npm run build
   ```

4. **Roll Back Database (If migrations were executed):**
   ```bash
   cd ../backend
   # Either rollback migration batch:
   php artisan migrate:rollback --step=1
   
   # Or restore pre-deployment snapshot:
   mysql -u atloops_app_user -p atloops_enterprise_prod < /var/backups/atloops/pre_deploy_backup_<TIMESTAMP>.sql
   ```

5. **Clear Caches & Bring Online:**
   ```bash
   php artisan optimize:clear
   php artisan config:cache
   php artisan route:cache
   php artisan up
   ```
