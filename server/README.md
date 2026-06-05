# Pastor Akintola Ministries — Backend API

Node.js + Express REST API with Socket.io for the Pastor Akintola Ministries platform. Built with MongoDB native driver, session-based admin auth, JWT visitor auth, Cloudinary file uploads, Nodemailer email, and real-time Socket.io chat.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server & routing |
| MongoDB native driver | Database (no Mongoose) |
| express-session + connect-mongo | Admin session auth |
| jsonwebtoken + bcrypt | Visitor JWT auth |
| Multer + Cloudinary | File uploads (images, audio, PDFs) |
| Socket.io | Real-time 1-to-1 counselling chat |
| Nodemailer + Gmail SMTP | OTP password reset emails |
| express-rate-limit | Rate limiting on auth & public routes |
| sanitize-html | XSS sanitization on user content |

---

## Folder Structure

```
server/
├── index.js                    # Entry point — HTTP server + Socket.io init
├── server.js                   # Express app config, middleware, routes
├── package.json
├── .env                        # Real secrets — never commit
├── .env.example                # Template for all required variables
├── .gitignore
│
├── config/
│   ├── db.js                   # MongoDB connection + collection exports
│   ├── cloudinary.js           # Re-exports cloudinary from upload middleware
│   └── mailer.js               # Nodemailer transporter + OTP email template
│
├── middlewares/
│   ├── auth.middleware.js      # isAdmin — session guard for admin routes
│   ├── visitorAuth.middleware.js # isVisitor — JWT guard for visitor routes
│   └── upload.middleware.js    # Multer + Cloudinary storage engines
│
├── models/                     # Query helpers (pure functions, no classes)
│   ├── admin.model.js
│   ├── otpToken.model.js
│   ├── visitor.model.js
│   ├── post.model.js
│   ├── sermon.model.js
│   ├── ebook.model.js
│   ├── comment.model.js
│   ├── like.model.js
│   ├── livestream.model.js
│   ├── newsletter.model.js
│   ├── contact.model.js
│   ├── event.model.js
│   ├── media.model.js
│   ├── chatSession.model.js
│   └── chatMessage.model.js
│
├── controllers/                # HTTP handler functions
│   ├── auth.controller.js
│   ├── visitor.controller.js
│   ├── post.controller.js
│   ├── sermon.controller.js
│   ├── ebook.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── livestream.controller.js
│   ├── newsletter.controller.js
│   ├── contact.controller.js
│   ├── event.controller.js
│   ├── media.controller.js
│   └── chat.controller.js
│
├── routes/                     # Express routers
│   ├── auth.routes.js
│   ├── visitor.routes.js
│   ├── post.routes.js
│   ├── sermon.routes.js
│   ├── ebook.routes.js
│   ├── comment.routes.js
│   ├── like.routes.js
│   ├── livestream.routes.js
│   ├── newsletter.routes.js
│   ├── contact.routes.js
│   ├── event.routes.js
│   ├── media.routes.js
│   └── chat.routes.js
│
├── socket/
│   └── chat.socket.js          # Socket.io event handlers
│
└── utils/
    └── slugify.js              # Slug generation + uniqueness check
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in all values in `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/pastor_akintola
DB_NAME=pastor_akintola
SESSION_SECRET=any_long_random_string
JWT_SECRET=another_long_random_string
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_16_char_gmail_app_password
EMAIL_FROM=Pastor Akintola Ministries <yourgmail@gmail.com>
```

> **Gmail App Password:** Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), enable 2FA first, then generate an App Password for "Mail". Use that 16-character code as `EMAIL_PASS`.

### 3. Start development server

```bash
npm run dev
```

### 4. Create admin account

On first run, no admin exists. Make a POST request:

```http
POST http://localhost:5000/api/auth/setup
Content-Type: application/json

{
  "name": "Pastor Akintola",
  "email": "admin@yourdomain.com",
  "password": "YourSecurePassword123"
}
```

This endpoint is permanently disabled after the first admin is created.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-restart) |
| `npm start` | Start for production |

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/setup-status` | Public | Check if admin account exists |
| POST | `/setup` | Public (once) | Create the admin account |
| POST | `/login` | Public | Admin login (sets session cookie) |
| POST | `/logout` | Admin | Destroy session |
| GET | `/me` | Admin | Get current admin info |
| PUT | `/change-password` | Admin | Change password with current password |
| POST | `/forgot-password` | Public | Send OTP to admin email |
| POST | `/reset-password` | Public | Reset password with OTP |

---

### Visitors — `/api/visitors`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a visitor account |
| POST | `/login` | Public | Login → returns JWT token |
| GET | `/me` | Visitor | Get current visitor profile |

---

### Posts — `/api/posts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | Get published posts (paginated) — `?page=1&limit=10&category=Faith&published=true` |
| GET | `/slug/:slug` | Public | Get post by slug |
| GET | `/admin/:id` | Admin | Get post by ID |
| POST | `/` | Admin | Create post (multipart/form-data) |
| PUT | `/:id` | Admin | Update post (multipart/form-data) |
| DELETE | `/:id` | Admin | Delete post + Cloudinary image cleanup |
| PATCH | `/:id/publish` | Admin | Toggle published state |

**POST/PUT fields:** `title`, `content` (HTML), `category`, `postType`, `scripture`, `tags` (JSON array string), `image` (file)

---

### Sermons — `/api/sermons`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | Get published sermons — `?page=1&limit=10&series=Faith+Series` |
| GET | `/slug/:slug` | Public | Get sermon by slug |
| POST | `/` | Admin | Upload sermon (multipart/form-data) |
| PUT | `/:id` | Admin | Update sermon |
| DELETE | `/:id` | Admin | Delete + Cloudinary audio/thumbnail cleanup |
| PATCH | `/:id/publish` | Admin | Toggle published state |
| POST | `/:id/listen` | Public | Increment listen count |
| POST | `/:id/download` | Public | Increment download count |

**POST/PUT fields:** `title`, `description`, `preacher`, `series`, `date`, `tags` (JSON array string), `audio` (file, required), `thumbnail` (file, optional)

---

### Ebooks — `/api/ebooks`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | Get published ebooks — `?page=1&limit=10` |
| GET | `/slug/:slug` | Public | Get ebook by slug |
| POST | `/` | Admin | Upload ebook (multipart/form-data) |
| PUT | `/:id` | Admin | Update ebook |
| DELETE | `/:id` | Admin | Delete + Cloudinary PDF/cover cleanup |
| POST | `/:id/download` | Public | Increment download count |

**POST/PUT fields:** `title`, `author`, `description`, `category`, `isFree` ("true"/"false"), `pdf` (file, required), `cover` (file, optional)

---

### Comments — `/api/comments`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/:postId` | Public | Get approved comments for a post (threaded) |
| POST | `/:postId` | Public | Submit a comment (pending approval) |
| GET | `/admin/all` | Admin | Get all comments |
| PATCH | `/admin/:id/approve` | Admin | Approve a comment |
| DELETE | `/admin/:id` | Admin | Delete comment + all its replies |

**POST fields:** `name`, `email`, `body`, `parentId` (optional, for replies)

---

### Likes — `/api/likes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/:postId` | Public | Like a post (IP-based duplicate prevention) |

---

### Events — `/api/events`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | Get published events — `?upcoming=true&page=1&limit=10` |
| GET | `/admin` | Admin | Get all events with total count |
| GET | `/slug/:slug` | Public | Get event by slug |
| POST | `/` | Admin | Create event (multipart/form-data) |
| PUT | `/:id` | Admin | Update event |
| DELETE | `/:id` | Admin | Delete event + Cloudinary image cleanup |

**POST/PUT fields:** `title`, `description`, `date`, `time`, `location`, `category`, `isPublished`, `image` (file)

---

### Media — `/api/media`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | Get all media — `?type=image` |
| POST | `/` | Admin | Upload multiple images (multipart/form-data, field: `files`) |
| DELETE | `/bulk` | Admin | Delete multiple by IDs — body: `{ ids: [...] }` |
| DELETE | `/:id` | Admin | Delete single media + Cloudinary cleanup |

---

### Livestream — `/api/livestream`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/active` | Public | Get the currently active livestream |
| POST | `/` | Admin | Set a new active livestream (deactivates previous) |
| PATCH | `/:id/deactivate` | Admin | Deactivate a livestream |

**POST fields:** `youtubeUrl` (required), `title`

---

### Newsletter — `/api/newsletter`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/subscribe` | Public | Subscribe an email |
| POST | `/unsubscribe` | Public | Unsubscribe an email — body: `{ email }` |
| GET | `/` | Admin | Get all subscribers |

---

### Contact — `/api/contact`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Public | Submit contact or prayer request |
| GET | `/` | Admin | Get all messages — `?type=prayer` or `?type=contact` |
| PATCH | `/:id/read` | Admin | Mark message as read |
| DELETE | `/:id` | Admin | Delete message |

**POST fields:** `name`, `email`, `phone`, `subject`, `message`, `type` ("contact" or "prayer")

---

### Chat REST — `/api/chat`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/session` | Visitor | Start or return existing chat session |
| GET | `/session/me` | Visitor | Get visitor's active session |
| GET | `/session/:sessionId/messages` | Visitor | Get messages for visitor's session |
| GET | `/admin/sessions` | Admin | Get all chat sessions |
| GET | `/admin/sessions/:sessionId/messages` | Admin | Get messages for any session |
| GET | `/admin/unread` | Admin | Get count of unread sessions |
| PATCH | `/admin/sessions/:sessionId/close` | Admin | Close a session |

---

### Chat Socket.io — namespace `/chat`

Connect to: `http://localhost:5000/chat`

| Event (emit) | Payload | Description |
|---|---|---|
| `join_session` | `{ sessionId, role: "visitor" \| "admin" }` | Join a chat room |
| `send_message` | `{ sessionId, sender, senderName, message }` | Send a message |
| `typing` | `{ sessionId, sender }` | Emit typing indicator |
| `stop_typing` | `{ sessionId, sender }` | Stop typing indicator |

| Event (listen) | Payload | Description |
|---|---|---|
| `receive_message` | Message object | New message in the room |
| `typing` | `{ sender }` | Other party is typing |
| `stop_typing` | `{ sender }` | Other party stopped typing |
| `new_visitor_message` | `{ sessionId, senderName, message }` | Broadcast to admin dashboard |
| `unread_count_changed` | — | Triggers admin badge refresh |

---

## Architecture Notes

### MVC Pattern
- **Models** — pure async functions that query MongoDB collections. No classes, no Mongoose.
- **Controllers** — HTTP handlers. Every `res.*` call is preceded by `return` to prevent multiple response errors.
- **Routes** — Express routers. Static routes always declared before dynamic `/:param` routes.

### Database Access Pattern
All collection access flows through `config/db.js` which exports typed collection functions:
```js
// config/db.js
export const posts = () => getCollection("posts");
export const sermons = () => getCollection("sermons");
// etc.
```
Models import these directly — no `getDB()` call needed in controllers.

### Upload Architecture
Three Cloudinary storage types:
- `imageStorage` — `resource_type: "image"` → folder `pastor_akintola/images`
- `audioStorage` — `resource_type: "video"` (Cloudinary uses this for audio) → folder `pastor_akintola/sermons`
- `pdfStorage` — `resource_type: "raw"` → folder `pastor_akintola/ebooks`

Sermon and ebook uploads use custom storage engines that route each field to the correct storage config by checking `file.fieldname`.

### Session vs JWT
- **Admin** uses `express-session` stored in MongoDB via `connect-mongo`. Cookie is `httpOnly`, `secure` in production.
- **Visitors** use JWT returned on login, stored in `localStorage` on the frontend, and sent as `Authorization: Bearer <token>` header on protected requests.

---

## Security

| Measure | Implementation |
|---|---|
| HTML sanitization | `sanitize-html` on all Quill content and user text inputs |
| Rate limiting | `express-rate-limit` — 100 req/15min globally, 20 req/15min on auth, 5 req/15min on OTP |
| Password hashing | `bcrypt` with salt rounds 12 |
| Session security | `httpOnly`, `secure: true` in production, `sameSite: "none"` |
| Admin enforcement | `adminExists()` check blocks second admin registration permanently |
| MIME validation | All file uploads validated by MIME type before reaching Cloudinary |
| CORS | Restricted to `CLIENT_URL` only |

---

## Deployment — Render

1. Push code to GitHub
2. Create a **Web Service** on Render
3. Root directory: `server`
4. Build: `npm install`
5. Start: `node index.js`
6. Add all `.env` variables in Render's Environment tab
7. Set `NODE_ENV=production`
8. Set `CLIENT_URL` to your live frontend URL

> Render free tier spins down after inactivity. Use a paid instance or set a keep-alive ping for production use.
