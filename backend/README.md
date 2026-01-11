# Backend (Landing Builder)

## Архитектура

- Laravel 12 + MySQL 8.4 + Redis.
- Контроллеры -> сервисы -> репозитории.
- DTO в `app/DTO`, кэш публичных страниц через Redis.
- Swagger: `http://localhost:8000/api/documentation`

## Локальный запуск

```sh
cp .env .env.local
php artisan migrate --env=local
php artisan serve --env=local
```

## Docker

```sh
docker compose up
```
