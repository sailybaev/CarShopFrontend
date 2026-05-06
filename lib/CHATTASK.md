# Функция чата между покупателем и продавцом

npm install @microsoft/signalr

## Обзор

Чат реализован на основе **ASP.NET Core SignalR** (бэкенд) и библиотеки **@microsoft/signalr** (фронтенд). Транспорт — WebSocket с автоматическим переключением на Long Polling при недоступности WebSocket. Аутентификация — JWT.

---

## Архитектура

```
Покупатель                         Продавец
    │                                  │
    │  "Message Seller"                │
    ▼                                  │
CarDetailActions                       │
    │ fetchSellerById()                │
    │ addConversation()                │
    │ router.push('/chats?...')        │
    ▼                                  ▼
/chats ──────── SignalR Hub ──────── /chats/
                /hub/chat
```

chatid = listing_user1_user2

---

## Поток данных

### Покупатель открывает чат

1. На странице `/inventory/[id]` нажимает **"Message Seller"**
2. `CarDetailActions` вызывает `GET /seller/{sellerId}` — получает `User.Id` продавца
3. Сохраняет диалог в **localStorage** (`chat_convs_{userId}`) через `addConversation()`
4. Переходит на `/chats?listing={listingId}&user={sellerUserId}`
5. Страница `/chats` автоматически выбирает нужный диалог по query-параметрам

### Продавец видит входящие сообщения

Поскольку продавец не инициировал чат, у него нет записей в localStorage.
При открытии `/chats` страница:

1. Вызывает `GET /api/chat/conversations` — получает список `(listingId, otherUserId)` из БД
2. Для каждого нового диалога загружает данные объявления через `GET /api/listing/{id}`
3. Добавляет диалоги в список через `addConversation()`

### Отправка и получение сообщений

```
Отправитель                    SignalR Hub                   Получатель
    │                               │                              │
    │ SendMessage(recv, listing, text)                             │
    │──────────────────────────────►│                              │
    │                               │ SaveMessageAsync()           │
    │                               │ Clients.Group(room)          │
    │                               │  .SendAsync("ReceiveMessage")│
    │◄──────────────────────────────│─────────────────────────────►│
    │  ReceiveMessage(msg)          │         ReceiveMessage(msg)  │
```

Имя группы формируется по формуле: `chat_{listingId}_{min(userId1, userId2)}_{max(userId1, userId2)}` — это гарантирует, что оба участника попадают в одну группу независимо от порядка.

---

## Файлы

### Фронтенд

| Файл | Изменение |
|------|-----------|
| `lib/cars.ts` | Добавлено поле `sellerId` в тип `Car` |
| `lib/api.ts` | Добавлены `ApiSeller`, `fetchSellerById()`, `ServerConversation`, `fetchMyConversations()`, `sellerId` в `listingToCar()` |
| `lib/chat-context.tsx` | **Новый файл** — контекст чата: SignalR-соединение, список диалогов, сообщения |
| `app/layout.tsx` | `<ChatProvider>` добавлен в дерево провайдеров |
| `components/car-detail-actions.tsx` | Добавлена кнопка **"Message Seller"** |
| `app/chats/page.tsx` | **Новый файл** — страница /chats |
| `components/auth-nav.tsx` | Добавлена ссылка **"Messages"** для авторизованных пользователей |

### Бэкенд

| Файл | Изменение |
|------|-----------|
| `Program.cs` | `OnMessageReceived` — извлечение JWT из query-параметра `?access_token=` для WebSocket |
| `Domain/Interfaces/IChatMessageRepository.cs` | Добавлены `ConversationRef`, метод `GetConversationsAsync()` |
| `Persistance/Repositories/ChatMessageRepository.cs` | `GetAllMessagesAsync` исправлен — возвращает сообщения в обоих направлениях; добавлен `GetConversationsAsync` |
| `WebApi/Controllers/ChatController.cs` | Добавлен `GET /api/chat/conversations`; исправлен `await` в `GetHistory` |

---

## Хранилище состояния

| Что | Где хранится | Ключ |
|-----|-------------|------|
| Список диалогов | `localStorage` | `chat_convs_{userId}` |
| Сообщения | Память (React state) | сбрасывается при перезагрузке |
| SignalR-соединение | `useRef` в `ChatProvider` | одно на всё приложение |

> Сообщения не персистируются в localStorage — при перезагрузке страницы они загружаются заново из БД через `loadHistory()`.

---

## Аутентификация SignalR

WebSocket не поддерживает HTTP-заголовки при установке соединения, поэтому JWT передаётся как query-параметр:

```
ws://localhost:5107/hub/chat?access_token=eyJ...
```

Фронтенд: `accessTokenFactory: () => token` в `HubConnectionBuilder`.

Бэкенд: `OnMessageReceived` в `JwtBearerEvents` извлекает токен из `Request.Query["access_token"]` и устанавливает `context.Token`.

---

## Ограничения

- **Офлайн-уведомления** не реализованы — если продавец не открыт `/chats`, он не узнает о новом сообщении в реальном времени (увидит при следующем открытии страницы через `GET /api/chat/conversations`)
- **Push-уведомления** отсутствуют
- **Пагинация истории** не реализована — загружается вся переписка сразу
