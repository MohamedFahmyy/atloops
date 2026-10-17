#!/usr/bin/env bash
# ==============================================================================
# AT LOOPS ENTERPRISE — ONE-TIME MULTI-SITE SERVER SETUP SCRIPT
# Run this ONCE on your Linux server to initialize AT Loops alongside existing sites.
# Usage: sudo bash setup-server.sh
# ==============================================================================

set -euo pipefail

if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run this setup script as root (sudo bash setup-server.sh)"
    exit 1
fi

DOMAIN="atloops.com"
APP_DIR="/var/www/${DOMAIN}"
REPO_URL="https://github.com/MohamedFahmyy/atloops.git"
WEB_USER="www-data"

echo "==================================================================="
echo "🛠️  INITIALIZING AT LOOPS ON MULTI-SITE SERVER"
echo "Domain:            ${DOMAIN}"
echo "Target Directory:  ${APP_DIR}"
echo "==================================================================="

# 1. Ensure required system packages are present
echo "📦 Verifying required packages..."
apt-get update -qq
apt-get install -y -qq git curl unzip certbot python3-certbot-nginx

# 2. Create isolated web directory
echo "📁 Setting up ${APP_DIR}..."
mkdir -p "${APP_DIR}"

if [ ! -d "${APP_DIR}/.git" ]; then
    echo "📥 Cloning repository from GitHub (${REPO_URL})..."
    git clone "${REPO_URL}" "${APP_DIR}"
else
    echo "ℹ️  Git repository already exists in ${APP_DIR}."
fi

# 3. Configure Nginx Virtual Host (Isolated, zero impact to other sites)
echo "🌐 Configuring Nginx Virtual Host..."

# 3.1 Rate limit drop-in
if [ -f "${APP_DIR}/deployment/atloops_rate_limits.conf" ]; then
    cp "${APP_DIR}/deployment/atloops_rate_limits.conf" /etc/nginx/conf.d/atloops_rate_limits.conf
    echo "   Installed /etc/nginx/conf.d/atloops_rate_limits.conf"
fi

# 3.2 Virtual host server block
if [ -f "${APP_DIR}/deployment/nginx-multisite.conf" ]; then
    cp "${APP_DIR}/deployment/nginx-multisite.conf" "/etc/nginx/sites-available/${DOMAIN}"
    ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"
    echo "   Installed /etc/nginx/sites-available/${DOMAIN} and enabled symlink"
fi

# 4. Configure PHP-FPM Dedicated Pool (Optional / Recommended)
PHP_VER=$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;' 2>/dev/null || echo "8.4")
POOL_DIR="/etc/php/${PHP_VER}/fpm/pool.d"
if [ -d "${POOL_DIR}" ] && [ -f "${APP_DIR}/deployment/php-fpm-pool.conf" ]; then
    sed "s/8.4/${PHP_VER}/g" "${APP_DIR}/deployment/php-fpm-pool.conf" > "${POOL_DIR}/atloops.conf"
    echo "   Created dedicated PHP pool: ${POOL_DIR}/atloops.conf"
    systemctl reload "php${PHP_VER}-fpm" || true
fi

# 5. Set up Laravel Scheduler Cron Job
echo "⏰ Configuring Laravel Scheduler cron job..."
CRON_JOB="* * * * * cd ${APP_DIR}/backend && php artisan schedule:run >> /dev/null 2>&1"
(crontab -u "${WEB_USER}" -l 2>/dev/null | grep -v "artisan schedule:run"; echo "${CRON_JOB}") | crontab -u "${WEB_USER}" -

# 6. Initial Configuration Setup
echo "🔑 Preparing environment configuration..."
if [ ! -f "${APP_DIR}/backend/.env" ]; then
    cp "${APP_DIR}/deployment/.env.example" "${APP_DIR}/backend/.env"
    chown "${WEB_USER}:${WEB_USER}" "${APP_DIR}/backend/.env"
    chmod 600 "${APP_DIR}/backend/.env"
    echo "   Created ${APP_DIR}/backend/.env (PLEASE EDIT WITH YOUR DATABASE CREDENTIALS)"
fi

# 7. Validate Nginx syntax without disrupting other running sites
echo "🔍 Testing Nginx syntax..."
if nginx -t; then
    systemctl reload nginx
    echo "✅ Nginx reloaded successfully!"
else
    echo "❌ Nginx configuration test failed! Please inspect /etc/nginx/sites-available/${DOMAIN}"
    exit 1
fi

echo "==================================================================="
echo "✅ ONE-TIME SERVER SETUP COMPLETE!"
echo ""
echo "Next Steps:"
echo "1. Edit database credentials in: ${APP_DIR}/backend/.env"
echo "2. Create MySQL database and user:"
echo "   CREATE DATABASE atloops_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo "   CREATE USER 'atloops_user'@'localhost' IDENTIFIED BY 'YourStrongPassword';"
echo "   GRANT ALL PRIVILEGES ON atloops_prod.* TO 'atloops_user'@'localhost';"
echo "   FLUSH PRIVILEGES;"
echo "3. Issue SSL certificate via Certbot (once DNS is pointed):"
echo "   certbot --nginx -d atloops.com -d www.atloops.com --cert-name atloops.com"
echo "4. Run deployment script:"
echo "   cd ${APP_DIR} && bash deploy.sh"
echo "==================================================================="
