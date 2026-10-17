# AT LOOPS Enterprise — Production Deployment Runbook

This guide details the step-by-step procedure for deploying the **AT LOOPS Greenfield Enterprise** application to a production server environment.

---

## 1. Production Server Prerequisites

| Component | Minimum Specification | Recommended |
|---|---|---|
| **Operating System** | Ubuntu 22.04 LTS or 24.04 LTS | Ubuntu 24.04 LTS |
| **Compute / Memory** | 2 vCPU, 4 GB RAM | 4 vCPU, 8 GB RAM |
| **PHP Runtime** | PHP 8.4 CLI + FPM | PHP 8.4 with OPcache |
| **PHP Extensions** | `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `curl`, `xml`, `bcmath`, `zip` | All enabled |
| **Web Server** | Nginx 1.24+ or Apache 2.4 | Nginx with HTTP/2 |
| **Database** | MySQL 8.0+ or MySQL 8.4 Community Server | MySQL 8.4 |
| **Node.js** | Node.js v20+ with npm 10+ | Node.js v22 LTS |
| **SSL / TLS** | Valid Certificate (Let's Encrypt Certbot or Commercial CA) | Automated renewal |

---

## 2. Server Preparation & Package Installation

```bash
# Update server repositories
sudo apt update && sudo apt upgrade -y

# Add Ondřej Surý PHP PPA for PHP 8.4
sudo apt install -y software-properties-common curl git unzip
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update

# Install PHP 8.4 and required enterprise extensions
sudo apt install -y php8.4 php8.4-fpm php8.4-mysql php8.4-mbstring \
                    php8.4-xml php8.4-bcmath php8.4-curl php8.4-zip \
                    php8.4-intl php8.4-gd

# Install Composer globally
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer

# Install Node.js v22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## 3. Application Setup & Deployment Steps

### Step 3.1: Clone and Position Codebase
```bash
sudo mkdir -p /var/www/atloops-enterprise
sudo chown -R deploy:www-data /var/www/atloops-enterprise
cd /var/www/atloops-enterprise

# Clone the repository
git clone <ENTERPRISE_GIT_REPO_URL> .
```

### Step 3.2: Configure Backend Environment
```bash
cd /var/www/atloops-enterprise/backend

# Copy the production template
cp ../deployment/.env.example .env

# Edit with actual production database credentials
nano .env

# Generate unique cryptographic key
php artisan key:generate --force
```

### Step 3.3: Install Backend Dependencies & Run Database Migrations
```bash
composer install --no-dev --optimize-autoloader

# Run database migrations against production database
php artisan migrate --force

# Seed essential administrative roles and corporate records
php artisan db:seed --force

# Create public storage symlink for media assets
php artisan storage:link
```

### Step 3.4: Build Frontend Production Bundle
```bash
cd /var/www/atloops-enterprise/frontend

# Install dependencies and compile Vite bundle
npm ci --prefer-offline
npm run build
```
*The compiled assets will be placed into `/var/www/atloops-enterprise/frontend/dist`.*

### Step 3.5: Set Correct File Permissions
```bash
# Set ownership
sudo chown -R www-data:www-data /var/www/atloops-enterprise/backend/storage
sudo chown -R www-data:www-data /var/www/atloops-enterprise/backend/bootstrap/cache

# Set permissions
sudo chmod -R 775 /var/www/atloops-enterprise/backend/storage
sudo chmod -R 775 /var/www/atloops-enterprise/backend/bootstrap/cache
sudo chmod 600 /var/www/atloops-enterprise/backend/.env
```

### Step 3.6: Optimize Laravel Caches
```bash
cd /var/www/atloops-enterprise/backend
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 4. Web Server Configuration

### 4.1 Nginx Setup (Recommended)
```bash
# Copy provided Nginx configuration
sudo cp /var/www/atloops-enterprise/deployment/nginx.conf /etc/nginx/sites-available/atloops.conf

# Enable site
sudo ln -s /etc/nginx/sites-available/atloops.conf /etc/nginx/sites-enabled/

# Test syntax and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 4.2 SSL Certificate via Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d atloops.com -d www.atloops.com --agree-tos --email contact@atloops.com --non-interactive
```

---

## 5. Background Workers & Scheduled Tasks

### 5.1 Laravel Scheduler (Cron Job)
Add the scheduler to the `www-data` crontab (`sudo crontab -u www-data -e`):
```cron
* * * * * cd /var/www/atloops-enterprise/backend && php artisan schedule:run >> /dev/null 2>&1
```

### 5.2 Systemd Queue Worker
Create `/etc/systemd/system/atloops-worker.service`:
```ini
[Unit]
Description=AT Loops Background Queue Worker
After=network.target

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /var/www/atloops-enterprise/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600

[Install]
WantedBy=multi-user.target
```

Enable and start the worker:
```bash
sudo systemctl daemon-reload
sudo systemctl enable atloops-worker
sudo systemctl start atloops-worker
```

---

## 6. Post-Deployment Verification

Verify the system is running using the health check endpoint:
```bash
curl -i https://atloops.com/api/v1/health
```
Expected response: HTTP 200 with `status: "ok"`, `checks.database: "healthy"`.
