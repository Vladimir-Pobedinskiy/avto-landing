# avto-landing — «Тайга Моторс»

Одностраничный лендинг производителя вездеходов. Nuxt 4 + TypeScript + SCSS,
анимации на GSAP ScrollTrigger поверх плавного скролла Lenis.

## Запуск

```bash
npm install
npm run double     # Nuxt :3000 + json-server :3001
```

Отдельно: `npm run dev` (фронт) и `npm run server` (данные).

Контент лежит в `db.json`, отдаётся через json-server; хендлеры Nuxt в `server/api/**`
проксируют запросы на `BASE_URL` из `.env`.

## Скрипты

| Команда              | Что делает                                   |
|----------------------|----------------------------------------------|
| `npm run double`     | фронт и данные одновременно                  |
| `npm run build`      | прод-сборка                                  |
| `npm run lint`       | ESLint + Stylelint                           |
| `npm run format:fix` | Prettier по всему проекту                    |

## Структура секций (`app/pages/index.vue`)

1. `Home/HomeHero` — первый экран с фоновым видео и параллаксом
2. `Configurator/ConfiguratorUnit` — конфигуратор в 4 шага (`#configurator-js`)
3. `Home/HomeAboutUnit` — о производстве + счётчики
4. `Home/HomeOffersUnit` — способы покупки
5. `Models/ModelsUnit` — модельный ряд, Swiper
6. `VideoUnit` — второй ролик с описанием
7. `Team/TeamUnit` — команда
8. `WhyUsUnit` — преимущества
9. `News/NewsPreviewsUnit` — новости и акции
10. `Form/FormApplicationUnit` — тест-драйв (`#test-drive-js`)
11. `Home/HomeContactsUnit` — контакты
12. `Form/FormApplicationUnit` — подбор техники

## Что нужно заменить перед боем

- **Видео** — сейчас подключены временные ролики с Pexels (прямые ссылки в `db.json`),
  заменить на свои: `public/video/README.md`.
- **Изображения** — в `public/img/**` лежат SVG-заглушки (градиенты с силуэтами).
- **Контент** — тексты, цены и контакты в `db.json` вымышленные.
- **Приём заявок** — форма шлёт POST на `/api/application/`, который сейчас пишет в `db.json`.
  Подключите реальный бэкенд или почтовый сервис.
- **Юридические страницы** — Политика конфиденциальности и оферта в чекбоксе формы
  сейчас без ссылок: страниц на лендинге нет.

## Анимации

- Заголовки секций — `useGsapAnimTitle()`: SplitType по словам/символам, `scrub: 1.6`.
- Старт по скроллу — `top 72%` у карточек, `top 75–78%` у счётчиков и форм: блок должен
  зайти во вьюпорт заметно глубже, иначе анимация отрабатывает раньше, чем её видно.
- Появление карточек — ScrollTrigger `from({ opacity: 0, y: 40, stagger: 0.08 })`.
- Параллакс — только `transform`/`opacity`, всё внутри `$gsap.context()` с `revert()` в `onUnmounted`.
- Бесконечные CSS-анимации глушатся вне вьюпорта через `useInView()` + класс `.fx-paused`
  и полностью отключаются при `prefers-reduced-motion: reduce`.
