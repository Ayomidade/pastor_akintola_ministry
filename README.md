# Pastor Akintola Ministries — Full Stack Platform

A full-stack ministry platform for Pastor Akintola Ministries, built to manage and deliver spiritual content, engage with members, and provide real-time counselling. The platform covers everything from sermon uploads and blog posts to a live 1-to-1 chat system between visitors and the pastor.

---

## Project Structure

```
pastor-akintola/
├── server/          # Node.js + Express REST API + Socket.io
└── client/          # React + Vite frontend
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, MongoDB (native driver), Socket.io |
| Frontend | React 18, Vite, React Router v6 |
| Auth (Admin) | express-session + bcrypt |
| Auth (Visitor) | JWT (jsonwebtoken) + bcrypt |
| File Uploads | Multer + Cloudinary (images, audio, PDFs) |
| Real-time | Socket.io (1-to-1 counselling chat) |
| Email | Nodemailer + Gmail SMTP |
| Payments | Paystack (inline) + Bank Transfer |
| Styling | Custom CSS variables (no framework) |

---

## Features

### Public
- 🏠 Home page with livestream banner, sermons, posts, events, social links
- 📝 Blog with category filtering and pagination
- 🎙️ Sermon audio player with listen/download tracking
- 📚 Ebook library with PDF downloads
- 📅 Events & programs calendar
- 🖼️ Media gallery with lightbox
- 📺 YouTube video channel page (YouTube Data API v3)
- 💬 1-to-1 counselling chat (Socket.io, requires visitor account)
- 🙏 Contact & prayer request form
- 💝 Donation page (Paystack + bank transfer)
- ℹ️ About page with biography and ministry timeline

### Admin Dashboard
- 📊 Dashboard with live metrics
- ✍️ Full post CRUD (Quill rich text editor)
- 🎙️ Sermon upload/manage (audio + thumbnail)
- 📚 Ebook upload/manage (PDF + cover image)
- 📅 Event management
- 🖼️ Media library (bulk upload/delete)
- 💬 Comment moderation (approve/delete)
- 📬 Contact & prayer request inbox
- 📧 Newsletter subscriber list
- 📡 Livestream YouTube URL management
- 💬 Real-time chat dashboard with unread badge

### Auth
- Single admin account (manual one-time setup)
- Password reset via current password OR email OTP
- Visitor accounts (JWT) for chat access

---

## Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Gmail account with App Password enabled
- Paystack account (for donation feature)
- YouTube Data API v3 key (for videos page)

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Ayomidade/pastor_ministry.git
cd pastor-akintola
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 3. Set up the frontend

```bash
cd client
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 4. Create your admin account

Once the server is running, visit:
```
POST http://localhost:5000/api/auth/setup
```
Or use the `/admin/login` page on first visit — it will show the setup form automatically.

---

## Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pastor_akintola
DB_NAME=pastor_akintola
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_FROM=Pastor Akintola Ministries <yourgmail@gmail.com>
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_YOUTUBE_API_KEY=your_youtube_data_api_v3_key
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxx
```

---

## Deployment

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set root directory to `server`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add all environment variables from `server/.env`
6. Set `NODE_ENV=production`

> **Important:** Set `CLIENT_URL` to your deployed Vercel frontend URL

### Frontend → Vercel

1. Import your repo on [vercel.com](https://vercel.com)
2. Set root directory to `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add all environment variables from `client/.env`

> **Important:** Set `VITE_API_URL` to your deployed Render backend URL

---

## API Overview

The full API is documented in `server/README.md`. Key base routes:

| Base Route | Description |
|---|---|
| `/api/auth` | Admin authentication & setup |
| `/api/visitors` | Visitor registration & login |
| `/api/posts` | Blog post management |
| `/api/sermons` | Sermon upload & management |
| `/api/ebooks` | Ebook upload & management |
| `/api/comments` | Comment moderation |
| `/api/likes` | Post likes |
| `/api/events` | Events management |
| `/api/media` | Media library |
| `/api/livestream` | Livestream management |
| `/api/newsletter` | Newsletter subscriptions |
| `/api/contact` | Contact & prayer requests |
| `/api/chat` | Chat session management (REST) |
| `ws /chat` | Chat real-time (Socket.io namespace) |

---

## Contributing

This is a private ministry platform. For changes or feature requests, contact the development team.

