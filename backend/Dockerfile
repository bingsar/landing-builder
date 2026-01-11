FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    bash \
    git \
    $PHPIZE_DEPS \
    icu-dev \
    libzip-dev \
    oniguruma-dev \
    mariadb-client \
    curl \
    && docker-php-ext-install pdo_mysql zip intl mbstring \
    && pecl install redis \
    && docker-php-ext-enable redis

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN COMPOSER_ALLOW_SUPERUSER=1 composer install --no-interaction --prefer-dist --no-dev --optimize-autoloader --no-scripts

COPY . .

RUN COMPOSER_ALLOW_SUPERUSER=1 composer dump-autoload --optimize
RUN php artisan package:discover --ansi
RUN php artisan key:generate --force

EXPOSE 8000

RUN chmod +x /var/www/html/docker/entrypoint.sh

ENTRYPOINT ["/var/www/html/docker/entrypoint.sh"]
