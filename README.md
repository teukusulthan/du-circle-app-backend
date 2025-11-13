# Circle – Social Threads App (Backend)

Circle is a real-time social threads app where users can post short updates, reply, like, and follow each other.  
This repository contains the **backend API** for Circle: authentication, threads, follows, and real-time updates via WebSocket.

---

## ✨ Features

- User authentication & profiles
- Create, update, and delete threads
- Replies and likes
- Follow / unfollow users
- Real-time updates (new threads, replies, likes) via WebSocket
- Feed pagination

---

## 💿 Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL / Neon
- Redis (for cache )
- WebSocket (Socket.IO / ws)

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/teukusulthan/circle-be
cd circle-be
npm install
```

### 2. Enviroments Variables

```bash
DATABASE_URL= <your_db_url>
PORT= <your_port>
JWT_SECRET= <your_secret_key>
REDIS_URL= <your_redis_url>
```

### 3. Run Locally

```bash
npm run dev
```

The API & WebSocket server will be available at:
HTTP: your localhost
WebSocket: ws://localhost:4000 (or a specific path, depending on your setup)
