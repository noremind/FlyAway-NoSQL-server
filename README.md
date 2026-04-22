# FlyAway Server

Express backend для платформы FlyAway. Здесь находится только серверная часть: API routes, controllers, MongoDB models, middleware, authentication и бизнес-логика. Frontend живет отдельно в `FlyAway-client`.

## Стек

- `Node.js`
- `Express`
- `MongoDB`
- `Mongoose`
- `JWT`
- `bcrypt`
- `dotenv`
- `@vercel/blob`

## Локальный запуск

1. Установить зависимости:

```bash
npm install
```

2. Создать локальный env-файл:

```bash
cp .env.example .env
```

3. Заполнить `.env` локальными значениями.

4. Запустить backend:

```bash
npm run dev
```

По умолчанию сервер доступен на `http://localhost:3001`.

Проверка health endpoint:

```bash
curl http://localhost:3001/api/health
```

Ожидаемый ответ:

```json
{ "status": "ok" }
```

## Production/start

```bash
npm run start
```

Порт берется из `PORT`.

## Переменные окружения

Смотри [.env.example](./.env.example).

Важно:

- не коммитить `.env`;
- не вставлять реальные токены, пароли и ключи в README;
- `MONGODB_URI` предпочтительнее, чем сборка URI из логина и пароля;
- `JWT_SECRET` должен быть длинным случайным значением;
- `BLOB_READ_WRITE_TOKEN` нужен только если используются загрузки в Vercel Blob.

## Архитектура

```text
server/
  config/          MongoDB connection
  controllers/     request handlers and business logic
  middleware/      auth and role guards
  models/          Mongoose schemas
  routes/          Express routes
  utils/           shared helpers
server.js          app bootstrap
```

## Основные API разделы

| Method/Path | Доступ | Назначение |
| --- | --- | --- |
| `GET /api/health` | public | Проверка доступности API |
| `POST /api/auth/register` | guest | Регистрация пользователя |
| `POST /api/auth/login` | guest | Вход пользователя |
| `POST /api/auth/partner-login` | guest | Вход партнера |
| `GET /api/auth/me` | auth | Текущая сессия |
| `GET /api/tours` | public | Список туров, фильтрация и сортировка |
| `GET /api/tours/:id` | public | Детальная страница тура |
| `GET /api/tours/manage` | admin/partner | Управляемые туры |
| `POST /api/tours/create` | admin/partner | Создание тура |
| `PATCH /api/tours/:id` | admin/partner | Обновление тура |
| `POST /api/tours/:id/book-date` | user | Бронирование тура |
| `GET /api/hotels` | public | Список отелей |
| `GET /api/hotels/:id` | public | Детальная страница отеля |
| `GET /api/hotels/manage` | admin/partner | Управляемые отели |
| `POST /api/hotels/create` | admin/partner | Создание отеля |
| `GET /api/partners` | public | Список партнеров |
| `POST /api/partners/apply` | user | Заявка/создание partner-профиля |
| `GET /api/partners/me` | partner | Текущий partner-профиль |
| `GET /api/personal-cabinet/wallet` | user | Бонусы и транзакции |
| `GET /api/personal-cabinet/favourites/tours` | user | Избранные туры |
| `POST /api/personal-cabinet/favourites/tours/:tourId/toggle` | user | Добавить/удалить тур из избранного |
| `GET /api/personal-cabinet/bookings/tours` | user | Бронирования пользователя |
| `GET /api/promocodes` | admin/partner | Список промокодов |
| `POST /api/promocodes` | admin/partner | Создание промокода |
| `POST /api/promocodes/preview` | public | Проверка промокода |
| `GET /api/users` | admin | Список пользователей |
| `POST /api/users/create` | admin | Создание пользователя |
| `PATCH /api/users/:id/bonus` | admin | Начисление бонусов |
| `POST /api/storage/upload` | admin/partner | Загрузка файла |

## Роли

### guest

Неавторизованный посетитель.

Может:

- читать публичные каталоги туров, отелей и партнеров;
- открывать детальные страницы;
- регистрироваться и входить.

Не может:

- бронировать туры;
- добавлять в избранное;
- работать с личным кабинетом;
- открывать admin API.

### user

Обычный авторизованный пользователь.

Может:

- хранить избранные туры;
- бронировать туры;
- применять промокоды;
- оплачивать бонусами;
- видеть свои бронирования, бонусы и транзакции;
- подать заявку/получить partner-профиль через partner flow.

Не может:

- создавать туры и отели напрямую;
- управлять пользователями;
- начислять бонусы;
- заходить в admin-only endpoints.

### partner

Партнерская роль. Определяется активной partner-сессией или partner-профилем пользователя.

Может:

- управлять своими турами;
- управлять своими отелями;
- создавать промокоды для своих туров/отелей;
- загружать файлы для контента.

Не может:

- управлять чужими турами/отелями;
- управлять пользователями;
- начислять бонусы;
- пользоваться admin-only endpoints.

### admin

Администратор платформы.

Может:

- управлять пользователями;
- управлять всеми турами и отелями;
- управлять партнерами;
- создавать общие и targeted промокоды;
- начислять бонусы пользователям;
- управлять рекламой, баннерами и файлами.

## Основные user flows

### Auth

1. Guest отправляет `POST /api/auth/register` или `POST /api/auth/login`.
2. Backend валидирует данные.
3. Backend возвращает JWT и sanitized user.
4. Client хранит token и отправляет `Authorization: Bearer <token>`.
5. `GET /api/auth/me` восстанавливает сессию.

### Каталог туров

1. Client отправляет `GET /api/tours` с query.
2. Backend применяет поиск, фильтрацию по датам/цене/длительности и сортировку.
3. Backend возвращает список туров.
4. Client строит карточки и карту с маркерами.

### Избранное

1. User отправляет `POST /api/personal-cabinet/favourites/tours/:tourId/toggle`.
2. Backend проверяет tour id.
3. Backend добавляет или удаляет id тура в `User.favouriteTours`.
4. Client обновляет Pinia store.
5. `GET /api/personal-cabinet/favourites/tours` возвращает populated tours.

### Бронирование тура

1. User выбирает дату и билеты на клиенте.
2. Client отправляет `POST /api/tours/:id/book-date`.
3. Backend проверяет:
   - авторизацию;
   - наличие тура;
   - наличие выбранной даты;
   - доступные места;
   - промокод;
   - бонусный баланс.
4. Backend увеличивает `bookedSeats`.
5. Backend создает booking в `User.tourBookings`.
6. Backend пишет wallet transactions.

### Промокоды

1. Admin или partner создает промокод через `POST /api/promocodes`.
2. Backend нормализует код в uppercase.
3. Backend проверяет даты, target type и права partner.
4. Промокод сохраняется в MongoDB.
5. Client может проверить код через `POST /api/promocodes/preview`.

### Бонусы

1. Admin отправляет `PATCH /api/users/:id/bonus`.
2. Backend проверяет роль admin.
3. Backend увеличивает `bonusBalance`.
4. Backend добавляет запись в `walletTransactions`.

## Manual QA checklist

### Запуск и env

- [ ] `.env` создан из `.env.example`.
- [ ] В `.env` нет пустого `JWT_SECRET`.
- [ ] MongoDB URI или credentials указаны.
- [ ] `npm run dev` запускает сервер без ошибок.
- [ ] `GET /api/health` возвращает `{ "status": "ok" }`.

### Auth and roles

- [ ] Guest может зарегистрироваться.
- [ ] User может войти через `/api/auth/login`.
- [ ] Partner может войти через `/api/auth/partner-login`.
- [ ] `GET /api/auth/me` возвращает актуальную роль.
- [ ] User не проходит в admin/partner endpoints.
- [ ] Partner не проходит в admin-only endpoints.
- [ ] Admin проходит в admin endpoints.

### Tours

- [ ] `GET /api/tours` возвращает массив.
- [ ] Search query фильтрует туры.
- [ ] Date range фильтрует туры.
- [ ] Sort query меняет порядок.
- [ ] `GET /api/tours/:id` возвращает детальный тур.
- [ ] Partner видит только свои туры в `/api/tours/manage`.

### Favourites

- [ ] Без токена `/api/personal-cabinet/favourites/tours` возвращает 401.
- [ ] С user token endpoint возвращает список избранного.
- [ ] Toggle добавляет тур.
- [ ] Повторный toggle удаляет тур.
- [ ] Несуществующий tour id возвращает ошибку.

### Booking

- [ ] Без токена booking endpoint возвращает 401.
- [ ] Нельзя забронировать недоступную дату.
- [ ] Нельзя забронировать больше мест, чем доступно.
- [ ] Валидный booking увеличивает `bookedSeats`.
- [ ] Booking появляется в `User.tourBookings`.
- [ ] Бонусные транзакции создаются корректно.

### Promocodes

- [ ] Admin может создать общий промокод.
- [ ] Admin может создать промокод для тура.
- [ ] Partner может создать промокод только для своего тура/отеля.
- [ ] Duplicate code возвращает 409.
- [ ] `preview` возвращает discount amount для активного кода.
- [ ] Просроченный промокод не применяется.

### Bonuses

- [ ] Admin может начислить бонусы пользователю.
- [ ] User не может начислить бонусы.
- [ ] Partner не может начислить бонусы.
- [ ] Wallet пользователя показывает новую транзакцию.

## Полезные команды

```bash
npm run dev
npm run start
```
