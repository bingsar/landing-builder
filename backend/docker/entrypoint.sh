#!/usr/bin/env sh
set -e

if [ ! -f /var/www/html/vendor/autoload.php ]; then
  echo "Installing composer dependencies..."
  COMPOSER_ALLOW_SUPERUSER=1 composer install --no-interaction --prefer-dist --no-dev --optimize-autoloader
  php artisan package:discover --ansi
fi

if [ -n "${DB_HOST:-}" ]; then
  echo "Waiting for MySQL at ${DB_HOST}:${DB_PORT:-3306}..."
  until mariadb-admin --ssl=FALSE ping -h"${DB_HOST}" -P"${DB_PORT:-3306}" -u"${DB_USERNAME:-root}" -p"${DB_PASSWORD:-}" --silent; do
    sleep 1
  done
fi

if [ -n "${REDIS_HOST:-}" ]; then
  echo "Waiting for Redis at ${REDIS_HOST}:${REDIS_PORT:-6379}..."
  until php -r 'try { $host=getenv("REDIS_HOST"); $port=(int) (getenv("REDIS_PORT") ?: 6379); $r=new Redis(); $r->connect($host, $port, 1.0); } catch (Throwable $e) { exit(1); }'; do
    sleep 1
  done
fi

php artisan config:clear
php artisan migrate --force

exec php artisan serve --host=0.0.0.0 --port=8000
