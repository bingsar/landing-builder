# Landing Builder

Конструктор лендингов с редактором на React и API на Laravel.

## Docker

```sh
docker compose up
```

Сервисы:
- Фронтенд: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/api/documentation`

## Локальная разработка
### Отдельно запускаем фронтенд и бэкенд

Backend:
```sh
cd backend
php artisan migrate --env=local
php artisan serve --env=local
```

Frontend:
```sh
cd frontend
yarn
yarn dev
```

## API

Swagger UI: `http://localhost:8000/api/documentation`  
JSON спецификация: `http://localhost:8000/docs`

## Архитектура

Backend (`backend/`):
- Laravel 12
- MySQL 8.4
- Redis‑кэш для публичных страниц (`/api/pages/public/{slug}`), инвалидация при publish/delete.

Frontend (`frontend/`):
- React
- Vite
- RTK Query

## Как добавить новый тип блока на примере Testimonials

1. **Типы**
   - Добавить типы данных для блока `frontend/src/editor/types.ts`.

2. **Дефолтные данные**
   - Добавить дефолтные данные для блока в `frontend/src/editor/blocks/createBlock.ts`.

3. **Рендер блока**
   - Добавить UI‑рендер в `frontend/src/editor/blocks/testimonials/TestimonialsBlock.tsx`.
   - Экспортировать в `frontend/src/editor/blocks/BlockRenderer.tsx`.

4. **Редактор блока**
   - Добавить редактируемые поля в `frontend/src/editor/blocks/testimonials/TestimonialsEditor.tsx`.
   - Подключить в `frontend/src/editor/BlockEditor.tsx`.

5. **Список блоков**
   - Добавить новый тип блока в `frontend/src/editor/AddBlockDialog.tsx`.

6. **Публичный рендер**
   - Добавить рендер в `frontend/src/public/PublicBlockRenderer.tsx`.

После этого блок сохраняется в JSON и работает через текущие `/api/pages` эндпоинты.
