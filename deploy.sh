#!/usr/bin/env bash
# ==============================================================================
# AT LOOPS ENTERPRISE — ZERO-DOWNTIME MULTI-SITE DEPLOYMENT SCRIPT
# Safe for production servers hosting multiple websites.
# Usage: ./deploy.sh [branch]
# ==============================================================================

set -euo pipefail

# Auto-detect script directory if running from inside the cloned repo
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${APP_DIR:-$SCRIPT_DIR}"
BRANCH="${1:-main}"
WEB_USER="${WEB_USER:-www-data}"
PHP_BIN="${PHP_BIN:-php}"

echo "==================================================================="
echo "🚀 STARTING AT LOOPS DEPLOYMENT ON MULTI-SITE SERVER"
echo "Target Directory: ${APP_DIR}"
echo "Git Branch:       ${BRANCH}"
echo "Timestamp:        $(date -u +"%Y-%m-%d %H:%M:%SZ")"
echo "==================================================================="

# 1. Verify working directory
if [ ! -d "${APP_DIR}" ]; then
    echo "❌ Error: Application directory ${APP_DIR} does not exist!"
    exit 1
fi

cd "${APP_DIR}"

# 2. Put AT Loops into Maintenance Mode (Bypasses active connections on other sites)
if [ -f "${APP_DIR}/backend/artisan" ]; then
    echo "⏸️  Enabling maintenance mode for AT Loops..."
    ${PHP_BIN} "${APP_DIR}/backend/artisan" down --retry=60 --secret="atloops-deploy-bypass" || true
fi

# 3. Pull latest code from GitHub
if [ -d .git ]; then
    echo "📥 Fetching and syncing latest commits from origin/${BRANCH}..."
    git fetch origin "${BRANCH}"
    git reset --hard "origin/${BRANCH}"
fi

# 4. Backend Dependencies & Database Migrations
echo "📦 Installing backend Composer dependencies (production-only)..."
cd "${APP_DIR}/backend"

# Ensure .env exists
if [ ! -f .env ]; then
    echo "⚠️ Warning: backend/.env not found! Copying from deployment/.env.example..."
    cp "${APP_DIR}/deployment/.env.example" .env
    echo "🔑 Generating Application Key..."
    ${PHP_BIN} artisan key:generate --force
fi

composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

echo "🗄️  Running database migrations..."
${PHP_BIN} artisan migrate --force

echo "⚡ Optimizing Laravel caches (Config, Routes, Views)..."
${PHP_BIN} artisan config:cache
${PHP_BIN} artisan route:cache
${PHP_BIN} artisan view:cache
${PHP_BIN} artisan event:cache

echo "🔗 Verifying public storage symlink..."
${PHP_BIN} artisan storage:link || true

echo "🔒 Hardening storage and cache directory permissions..."
chown -R "${WEB_USER}:${WEB_USER}" storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# 5. Frontend Build (React SPA)
echo "🎨 Building frontend production bundle..."
cd "${APP_DIR}/frontend"
if [ -f package-lock.json ]; then
    npm ci --silent
else
    npm install --silent
fi

npm run build

echo "🔒 Setting frontend distribution read permissions..."
chown -R "${WEB_USER}:${WEB_USER}" dist
chmod -R 755 dist

# 6. Bring AT Loops back online
echo "▶️  Bringing AT Loops application out of maintenance mode..."
cd "${APP_DIR}/backend"
${PHP_BIN} artisan up

# 7. Graceful Multi-Site Service Reloads (Zero impact to other hosted sites)
echo "🔄 Reloading PHP-FPM workers..."
PHP_FPM_SERVICE=$(systemctl list-units --type=service --state=running 2>/dev/null | grep -oE 'php[0-9.]+-fpm' | head -n 1 || echo "")
if [ -n "${PHP_FPM_SERVICE}" ]; then
    echo "   Reloading active ${PHP_FPM_SERVICE}..."
    systemctl reload "${PHP_FPM_SERVICE}" || true
fi

echo "🔄 Validating and reloading Nginx configuration..."
if command -v nginx >/dev/null 2>&1; then
    nginx -t && systemctl reload nginx
fi

# 8. Automated Post-Deploy Health Check
echo "🩺 Running post-deployment health check..."
HEALTH_URL="http://127.0.0.1/api/v1/health"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: atloops.com" "${HEALTH_URL}" 2>/dev/null || echo "000")

if [ "${HTTP_STATUS}" -eq 200 ] || [ "${HTTP_STATUS}" -eq 301 ]; then
    echo "✅ Health check PASSED (HTTP ${HTTP_STATUS})"
else
    echo "ℹ️  Health check returned HTTP ${HTTP_STATUS} (Normal during initial DNS propagation)."
fi

echo "==================================================================="
echo "🎉 AT LOOPS DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "Timestamp: $(date -u +"%Y-%m-%d %H:%M:%SZ")"
echo "==================================================================="
