# 🚀 TaskFlow — Full-Stack Auth + Task Management

Modern, production-ready web application with React frontend, Node.js/Express backend, MongoDB database, and JWT authentication.

## ✨ Features
- 🔐 JWT Authentication (Register / Login / Logout)
- 📋 Full CRUD Task Management
- 🔍 Search, Filter & Sort tasks
- 👤 User profile management
- 🔒 Password hashing with bcrypt
- 🛡️ Rate limiting, CORS, Helmet security headers
- 📱 Fully responsive dark UI

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| HTTP Client | Axios |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas URI
- npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow

# Backend
cd backend && npm install
cp .env.example .env
# Edit .env with your values

# Frontend  
cd ../frontend && npm install
```

### 2. Configure Environment
Edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your-256-bit-secret-here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Start Development
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

App runs at: **http://localhost:5173**

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Create account |
| POST | /api/auth/login | ❌ | Login + get JWT |
| GET | /api/auth/me | ✅ | Get current user |
| GET | /api/profile | ✅ | Profile + task stats |
| PUT | /api/profile | ✅ | Update profile |
| PUT | /api/profile/password | ✅ | Change password |
| GET | /api/tasks | ✅ | List tasks (filterable) |
| POST | /api/tasks | ✅ | Create task |
| PUT | /api/tasks/:id | ✅ | Update task |
| DELETE | /api/tasks/:id | ✅ | Delete task |
| DELETE | /api/tasks/completed | ✅ | Bulk delete completed |

deploy the frontend end the backend locally or using a free application
