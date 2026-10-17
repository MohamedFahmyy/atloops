# AT LOOPS — Production Multi-Site Server Deployment Guide

**Target Domain:** `atloops.com` (and `www.atloops.com`)  
**Server Environment:** Linux VPS hosting **2 existing websites** concurrently  
**Primary Goal:** Deploy AT Loops cleanly and independently without modifying or disrupting the other 2 existing sites.

---

## 1. Safety Architecture for Multi-Site Servers

When adding AT Loops as a third website on an active server, the following safeguards are implemented:

1. **Non-Conflicting Virtual Host:**  
   - Dedicated configuration in `/etc/nginx/sites-available/atloops.com` symlinked to `/etc/nginx/sites-enabled/atloops.com`.
   - Never touches or overwrites existing site configs (`site1.com.conf`, `site2.com.conf`).
2. **Global Rate Limit Drop-In:**  
   - Rate limiting zones are stored in `/etc/nginx/conf.d/atloops_rate_limits.conf` (valid `http {}` context), preventing syntax errors on virtual hosts.
3. **Graceful Reloads Only:**  
   - The deployment script always executes `nginx -t` first, followed by `systemctl reload nginx` (never hard restart). Existing connections on the other 2 sites are never dropped.
4. **Dedicated PHP-FPM Resource Pool:**  
   - AT Loops uses an isolated PHP pool (`/etc/php/8.4/fpm/pool.d/atloops.conf`) with its own worker limit, preventing PHP worker exhaustion from impacting other sites.
5. **Database Isolation:**  
   - AT Loops connects only to its dedicated database (`atloops_prod`) using a least-privilege MySQL user (`atloops_user`).
6. **Scoped Permissions:**  
   - File permissions are applied strictly within `/var/www/atloops.com/`, never recursively touching `/var/www/`.

---

## 2. Local Machine: Push to GitHub

From your local machine in the project root:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add remote repository
git remote add origin https://github.com/MohamedFahmyy/atloops.git

# 3. Add all files (respecting .gitignore which excludes node_modules, vendor, .env)
git add .

# 4. Commit code
git commit -m "feat: complete AT Loops enterprise platform with multi-site deployment scripts"

# 5. Set branch to main and push
git branch -M main
git push -u origin main
```

---

## 3. Remote Server: First-Time Setup (5 Minutes)

SSH into your Linux server:

```bash
ssh root@YOUR_SERVER_IP
```

### Step 3.1: Create Dedicated Database for AT Loops

```sql
mysql -u root -p
```

Execute inside MySQL:
```sql
CREATE DATABASE atloops_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'atloops_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON atloops_prod.* TO 'atloops_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### Step 3.2: Clone Repository & Run One-Time Setup

```bash
# Clone to dedicated web directory
git clone https://github.com/MohamedFahmyy/atloops.git /var/www/atloops.com

# Enter directory and run automated setup
cd /var/www/atloops.com
sudo bash deployment/setup-server.sh
```

---

### Step 3.3: Configure Production `.env`

Edit `/var/www/atloops.com/backend/.env`:

```bash
nano /var/www/atloops.com/backend/.env
```

Set your production variables:
```dotenv
APP_NAME="AT Loops Enterprise"
APP_ENV=production
APP_KEY=base64:GENERATE_WITH_ARTISAN_KEY_GENERATE
APP_DEBUG=false
APP_URL=https://atloops.com
FRONTEND_URL=https://atloops.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=atloops_prod
DB_USERNAME=atloops_user
DB_PASSWORD="YOUR_STRONG_PASSWORD_HERE"

MAIL_MAILER=smtp
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USERNAME=contact@atloops.com
MAIL_PASSWORD="YOUR_MICROSOFT_APP_PASSWORD"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="contact@atloops.com"
MAIL_FROM_NAME="AT Loops Enterprise"

CORS_ALLOWED_ORIGINS=https://atloops.com,https://www.atloops.com
```

Generate the encryption key:
```bash
cd /var/www/atloops.com/backend
php artisan key:generate --force
```

---

### Step 3.4: Issue SSL Certificate via Certbot (Isolated)

Ensure your DNS A records for `atloops.com` and `www.atloops.com` are pointed to your server IP, then run:

```bash
certbot --nginx -d atloops.com -d www.atloops.com --cert-name atloops.com
```

*Certbot will configure SSL exclusively for the `atloops.com` server block without altering certificates for your other 2 domains.*

---

### Step 3.5: Run First Deployment & Seed Initial Data

```bash
cd /var/www/atloops.com
bash deploy.sh
```

To seed initial pages, services, categories, and settings:
```bash
cd /var/www/atloops.com/backend
php artisan db:seed --force
```

---

## 4. Ongoing Deployments (Zero-Downtime)

Whenever you make changes and push them to GitHub, deploying updates to your server is a single command:

```bash
cd /var/www/atloops.com
bash deploy.sh
```

### What `deploy.sh` Does Automatically:
1. Puts AT Loops in maintenance mode (`php artisan down --retry=60`).
2. Pulls latest commits (`git fetch && git reset --hard origin/main`).
3. Installs backend dependencies (`composer install --no-dev --optimize-autoloader`).
4. Runs database migrations safely (`php artisan migrate --force`).
5. Rebuilds and caches Laravel routes, configs, and views.
6. Builds the React SPA bundle (`npm ci && npm run build`).
7. Sets strict file permissions on storage and cache.
8. Brings AT Loops back online (`php artisan up`).
9. Gracefully reloads PHP-FPM and Nginx (`systemctl reload`).
10. Runs automated HTTP health check.
