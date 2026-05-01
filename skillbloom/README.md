# SkillBloom - Professional Campus Gigs Platform 🚀

Production-ready **MERN Stack** upgrade from prototype.

## ✨ Features
- JWT Authentication (Student/Business)
- Post creation w/ image/video (Cloudinary)
- Real-time feed & profiles
- Job applications system
- Modern React UI (TailwindCSS)
- MongoDB Atlas + secure APIs
- Responsive mobile-first design

## 🛠️ Tech Stack
```
Frontend: React 18 + Vite + TailwindCSS + React Router
Backend: Node.js + Express + MongoDB + Cloudinary
Security: JWT + bcrypt + helmet + rate-limit
```
## 🚀 Quick Start

### 1. Clone & Install
```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 2. Environment Setup (.env files)

**backend/.env**
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here_min32chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 3. Run Development
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 4. Test APIs (Postman)
```
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/posts (auth header)
GET  http://localhost:5000/api/posts
```

## 📱 Screenshots
*(Will add after completion)*

## 🚀 Deploy
- **Backend**: Railway/Render
- **Frontend**: Vercel/Netlify
- **Database**: MongoDB Atlas (free tier)
- **Media**: Cloudinary (free tier)

## 📄 License
MIT - Built by BLACKBOXAI for Adity's 4th Sem Project 🎓

