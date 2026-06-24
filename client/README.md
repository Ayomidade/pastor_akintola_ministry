# Pastor Akintola Ministries — Frontend Client

React + Vite frontend for the Pastor Akintola Ministries platform. Built with React Router v6, Axios, Socket.io-client, React Quill, and a custom CSS design system inspired by the "Sacred Editorial" aesthetic — deep navy, warm gold, and cream.

---

## Tech Stack

| Technology       | Purpose                                |
| ---------------- | -------------------------------------- |
| React 18         | UI framework                           |
| Vite             | Build tool & dev server                |
| React Router v6  | Client-side routing with nested routes |
| Axios            | HTTP client with interceptors          |
| Socket.io-client | Real-time chat connection              |
| React Quill      | Rich text editor for post creation     |
| React Hot Toast  | Toast notifications                    |
| Lucide React     | Icon library                           |
| date-fns         | Date formatting                        |

---

## Folder Structure

```
client/
├── index.html
├── vite.config.js
├── package.json
├── .env                        # Real values — never commit
├── .env.example                # Template
│
└── src/
    ├── main.jsx                # App entry point + Toaster config
    ├── App.jsx                 # All routes + layout logic
    ├── index.css               # Global CSS variables + utility classes
    │
    ├── api/
    │   └── axios.js            # Axios instance with base URL + JWT interceptor
    │
    ├── config/
    │   └── socials.js          # Social media handles + YouTube channel config
    │
    ├── services/               # One file per API resource
    │   ├── auth.service.js
    │   ├── visitor.service.js
    │   ├── post.service.js
    │   ├── sermon.service.js
    │   ├── ebook.service.js
    │   ├── comment.service.js
    │   ├── like.service.js
    │   ├── event.service.js
    │   ├── media.service.js
    │   ├── livestream.service.js
    │   ├── newsletter.service.js
    │   ├── contact.service.js
    │   └── chat.service.js
    │
    ├── context/
    │   ├── AuthContext.jsx         # Admin session state + login/logout
    │   ├── VisitorAuthContext.jsx  # Visitor JWT state + login/logout
    │   └── SocketContext.jsx       # Socket.io client instance
    │
    ├── components/
    │   ├── ProtectedRoute.jsx      # Admin route guard
    │   ├── VisitorRoute.jsx        # Visitor route guard
    │   ├── AudioPlayer.jsx         # Custom HTML5 audio player
    │   └── shared/
    │       ├── Navbar.jsx          # Responsive nav with mobile hamburger
    │       ├── Footer.jsx          # Footer with newsletter signup
    │       ├── Skeleton.jsx        # Loading skeleton components
    │       └── ConfirmModal.jsx    # Delete confirmation modal
    │
    └── pages/
        ├── public/
        │   ├── Home.jsx            # Landing page
        │   ├── About.jsx           # Pastor biography + timeline
        │   ├── Blog.jsx            # Post listing with category filter
        │   ├── PostDetail.jsx      # Post detail + comments + likes
        │   ├── Sermons.jsx         # Sermon listing
        │   ├── SermonDetail.jsx    # Sermon detail + audio player
        │   ├── Ebooks.jsx          # Ebook library
        │   ├── Events.jsx          # Events listing
        │   ├── Media.jsx           # Photo gallery with lightbox
        │   ├── Videos.jsx          # YouTube channel videos page
        │   ├── Contact.jsx         # Contact + prayer request form
        │   ├── Donate.jsx          # Donation page (Paystack + bank transfer)
        │   ├── Register.jsx        # Visitor registration
        │   ├── VisitorLogin.jsx    # Visitor login
        │   └── Chat.jsx            # 1-to-1 counselling chat
        │
        └── admin/
            ├── Login.jsx           # Admin login / setup / forgot password
            ├── AdminLayout.jsx     # Sidebar + topbar shell for admin pages
            ├── Dashboard.jsx       # Metrics overview + quick actions
            ├── Comments.jsx        # Comment moderation
            ├── Contacts.jsx        # Contact & prayer request inbox
            ├── Newsletter.jsx      # Subscriber list
            ├── Livestream.jsx      # Set/deactivate YouTube livestream
            ├── posts/
            │   ├── PostList.jsx
            │   ├── CreatePost.jsx
            │   └── EditPost.jsx
            ├── sermons/
            │   ├── SermonList.jsx
            │   ├── CreateSermon.jsx
            │   └── EditSermon.jsx
            ├── ebooks/
            │   ├── EbookList.jsx
            │   ├── UploadEbook.jsx
            │   └── EditEbook.jsx
            ├── events/
            │   ├── EventList.jsx
            │   ├── CreateEvent.jsx
            │   └── EditEvent.jsx
            ├── media/
            │   └── MediaLibrary.jsx
            └── chat/
                ├── ChatDashboard.jsx   # All chat sessions + unread badge
                └── ChatWindow.jsx      # Individual chat interface
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

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_YOUTUBE_API_KEY=your_youtube_data_api_v3_key
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxx
```

### 3. Update social media handles

Open `src/config/socials.js` and replace all placeholder values:

```js
export const SOCIALS = {
  youtube: {
    url: "https://www.youtube.com/@YourHandle",
    channelId: "UCxxxxxxxxxxxxxxxxxx", // For Videos page API fetch
    handle: "@YourHandle",
  },
  facebook: { url: "https://www.facebook.com/YourPage" },
  instagram: {
    url: "https://www.instagram.com/yourhandle",
    handle: "@yourhandle",
  },
  twitter: { url: "https://www.twitter.com/yourhandle", handle: "@yourhandle" },
  whatsapp: { url: "https://wa.me/234XXXXXXXXXX" },
};
```

### 4. Start development server

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Environment Variables

| Variable                   | Required | Description                                 |
| -------------------------- | -------- | ------------------------------------------- |
| `VITE_API_URL`             | ✅       | Backend API base URL                        |
| `VITE_SOCKET_URL`          | ✅       | Backend Socket.io server URL (no `/api`)    |
| `VITE_YOUTUBE_API_KEY`     | Optional | YouTube Data API v3 key for the Videos page |
| `VITE_PAYSTACK_PUBLIC_KEY` | Optional | Paystack public key for online donations    |

> `VITE_YOUTUBE_API_KEY` — without this, the Videos page shows a "Visit YouTube Channel" fallback. Get a free key at [console.cloud.google.com](https://console.cloud.google.com), enable YouTube Data API v3, and create an API key.

> `VITE_PAYSTACK_PUBLIC_KEY` — without this, the online payment tab on the Donate page will not process payments. Bank transfer tab still works.

---

## Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start Vite dev server            |
| `npm run build`   | Build for production → `dist/`   |
| `npm run preview` | Preview production build locally |

---

## Design System

The entire UI is built on CSS custom properties defined in `src/index.css`. No external CSS framework.

### Color Palette

| Variable          | Value     | Usage                        |
| ----------------- | --------- | ---------------------------- |
| `--primary`       | `#212121` | Primary background, headings |
| `--primary-light` | `#2E2E2E` | Sidebar, cards on dark bg    |
| `--accent`        | `#16A34A` | Accents, buttons, highlights |
| `--accent-light`  | `#22C55E` | Gold hover state             |
| `--accent-dark`   | `#15803D` | Gold pressed state           |
| `--cream`         | `#FAFAFA` | Page background              |
| `--cream-dark`    | `#F0FAF4` | Section alternates           |
| `--border`        | `#E5E5E5` | Card borders, dividers       |

### Typography

| Font             | Usage                                      |
| ---------------- | ------------------------------------------ |
| Playfair Display | Headings, display text, editorial elements |
| Lato             | Body text, UI labels, buttons              |

Both loaded from Google Fonts via `index.html`.

### Utility Classes

```css
.container        /* max-width 1200px centered */
.section          /* 80px vertical padding */
.btn              /* Base button */
.btn-primary      /* Gold button */
.btn-outline      /* Gold outline button */
.btn-dark         /* Navy button */
.btn-sm           /* Smaller button variant */
.btn-danger       /* Red destructive button */
.tag              /* Gold label badge */
.gold-divider     /* 60px × 3px gold line */
.card             /* White card with hover shadow */
.form-group       /* Form field wrapper */
.form-label       /* Uppercase small label */
.form-input       /* Styled input/textarea/select */
.skeleton         /* Shimmer loading animation */
.grid-2/3/4       /* Responsive grid columns */
.page-header      /* Navy page hero section */
```

---

## Routing

### Public Routes

| Path                | Component      | Description                      |
| ------------------- | -------------- | -------------------------------- |
| `/`                 | `Home`         | Landing page                     |
| `/about`            | `About`        | Pastor biography                 |
| `/blog`             | `Blog`         | Post listing                     |
| `/blog/:slug`       | `PostDetail`   | Individual post                  |
| `/sermons`          | `Sermons`      | Sermon listing                   |
| `/sermons/:slug`    | `SermonDetail` | Individual sermon                |
| `/ebooks`           | `Ebooks`       | Ebook library                    |
| `/events`           | `Events`       | Events listing                   |
| `/media`            | `Media`        | Photo gallery                    |
| `/videos`           | `Videos`       | YouTube videos                   |
| `/contact`          | `Contact`      | Contact & prayer form            |
| `/donate`           | `Donate`       | Donation page                    |
| `/visitor/register` | `Register`     | Visitor signup                   |
| `/visitor/login`    | `VisitorLogin` | Visitor login                    |
| `/chat`             | `Chat`         | Counselling chat (visitor guard) |

### Admin Routes (all protected by `ProtectedRoute`)

| Path                      | Component       |
| ------------------------- | --------------- |
| `/admin/login`            | `AdminLogin`    |
| `/admin/dashboard`        | `Dashboard`     |
| `/admin/posts`            | `PostList`      |
| `/admin/posts/create`     | `CreatePost`    |
| `/admin/posts/edit/:id`   | `EditPost`      |
| `/admin/sermons`          | `SermonList`    |
| `/admin/sermons/create`   | `CreateSermon`  |
| `/admin/sermons/edit/:id` | `EditSermon`    |
| `/admin/ebooks`           | `EbookList`     |
| `/admin/ebooks/upload`    | `UploadEbook`   |
| `/admin/ebooks/edit/:id`  | `EditEbook`     |
| `/admin/events`           | `EventList`     |
| `/admin/events/create`    | `CreateEvent`   |
| `/admin/events/edit/:id`  | `EditEvent`     |
| `/admin/media`            | `MediaLibrary`  |
| `/admin/comments`         | `Comments`      |
| `/admin/contacts`         | `Contacts`      |
| `/admin/newsletter`       | `Newsletter`    |
| `/admin/livestream`       | `Livestream`    |
| `/admin/chat`             | `ChatDashboard` |
| `/admin/chat/:sessionId`  | `ChatWindow`    |

---

## Auth Flow

### Admin

1. On app load, `AuthContext` calls `GET /api/auth/setup-status`
2. If `isSetupDone: false` → redirect to setup form
3. If `isSetupDone: true` → call `GET /api/auth/me`
4. Session cookie is sent automatically with every request (`withCredentials: true`)
5. `ProtectedRoute` checks `admin` state — redirects to `/admin/login` if null

### Visitor

1. Visitor registers → `POST /api/visitors/register`
2. Visitor logs in → `POST /api/visitors/login` → receives JWT
3. JWT stored in `localStorage` as `visitorToken`
4. Axios interceptor attaches it as `Authorization: Bearer <token>` on every request
5. `VisitorRoute` checks `visitor` state — redirects to `/visitor/login` if null
6. On app load, `VisitorAuthContext` calls `GET /api/visitors/me` to restore session

---

## Chat System

The counselling chat uses Socket.io on the `/chat` namespace.

### Visitor Flow

1. Must be logged in (`VisitorRoute` guard)
2. On mount, `POST /api/chat/session` creates or returns existing session
3. Past messages loaded via `GET /api/chat/session/:id/messages`
4. Socket joins the session room: `socket.emit("join_session", { sessionId, role: "visitor" })`
5. Messages sent via `socket.emit("send_message", { ... })`
6. Received via `socket.on("receive_message", ...)`

### Admin Flow

1. `ChatDashboard` polls `GET /api/chat/admin/unread` every 30 seconds for badge count
2. Socket listens for `new_visitor_message` and `unread_count_changed` events
3. Opening `ChatWindow` joins the room as admin — marks session as read
4. Typing indicators via `typing` and `stop_typing` events

---

## Key Implementation Notes

### Axios base instance

All API calls go through `src/api/axios.js`:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends session cookie for admin routes
});
// Attaches visitor JWT if present in localStorage
```

### YouTube Videos page

- Requires `VITE_YOUTUBE_API_KEY` in `.env`
- Also requires correct `channelId` in `src/config/socials.js`
- Falls back to a "Visit YouTube" CTA if API key is missing
- Fetches uploads playlist → paginates with `nextPageToken`
- Videos play in an embedded iframe modal

### Paystack Donations

- Loaded via CDN script tag in `Donate.jsx`
- Triggered via `window.PaystackPop.setup({ ... }).openIframe()`
- Requires `VITE_PAYSTACK_PUBLIC_KEY` in `.env`
- Falls back gracefully if Paystack script hasn't loaded

### Quill Rich Text Editor

- Used in `CreatePost` and `EditPost`
- Content is sanitized on the **backend** with `sanitize-html` before storage
- Minimum height set to 300px via CSS override

---

## Mobile Responsiveness

Every page is fully responsive. Key breakpoints:

| Breakpoint | Behaviour                                   |
| ---------- | ------------------------------------------- |
| `< 1024px` | 4-col grids → 2-col, sidebar collapses      |
| `< 900px`  | 2-col layouts → 1-col, admin tables → cards |
| `< 768px`  | Most grids → 1-col, mobile nav active       |
| `< 480px`  | Newsletter form stacks, amount grid 2-col   |

Admin panel uses a collapsible sidebar — collapses to icon-only mode on smaller screens. Tables on mobile are replaced with card-based layouts.

---

## Deployment — Vercel

1. Push code to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Root directory: `client`
4. Framework preset: **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`
7. Add environment variables in Vercel's dashboard

### Important for React Router

Create a `vercel.json` in the `client/` folder:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Without this, direct URL access (e.g. `/admin/dashboard`) returns a 404.

---

## Updating Social Media Handles

All social media configuration lives in one file:

```
src/config/socials.js
```

Update it once and every page — Navbar, Footer, Home, About, Contact, Donate, Videos — reflects the change automatically.
