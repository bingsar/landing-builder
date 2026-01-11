# Frontend (Landing Builder)

## Архитектура

- React + Vite + RTK Query.
- Редактор:
  - состояние и автосохранение: `src/editor/hooks/useEditorState.ts`
  - общий layout: `src/editor/components/EditorLayout.tsx`
  - рендер блоков: `src/editor/blocks/*`
  - редакторы контента: `src/editor/blocks/*/*Editor.tsx`
- Публичный рендер: `src/public/PublicPage.tsx`

## Локальный запуск

```sh
yarn
yarn dev
```

По умолчанию фронт ждёт backend по `/api` (проксируется из `vite.config.ts`).

## Линтер

```sh
yarn lint
```

## Сборка

```sh
yarn build
```
