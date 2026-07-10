# 💬 Pulse Chat

<div align="center">

### A Modern AI-Powered Real-Time Chat Application

Pulse Chat is a full-stack MERN chat application that enables seamless real-time communication through one-to-one messaging, group chats, and an integrated AI assistant. Built with **React**, **Node.js**, **MongoDB**, **Socket.IO**, and **Google Gemini AI**, it delivers a fast, secure, and responsive messaging experience.

[🚀 Live Demo](https://pulse-chat-frontend-pa8h.onrender.com) 

</div>

---

## ✨ Features

- 🔐 JWT Authentication with Refresh Tokens
- 💬 Real-Time One-to-One Messaging
- 👥 Create & Manage Group Chats
- 🤖 AI Chat Assistant powered by Google Gemini
- 📷 Image Sharing with Cloudinary
- 😀 Emoji Support
- ✍️ Typing Indicators
- 👀 Read Receipts & Online Status
- ❤️ Message Reactions
- 📌 Pin & Unpin Messages
- ✏️ Edit & Delete Messages
- 🔍 User & Message Search
- 🖼️ Shared Media Gallery
- 👤 Profile & Settings Management
- 🔒 Forgot & Reset Password
- 📱 Fully Responsive UI

---

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Context API
- React Router
- Axios
- Socket.IO Client
- Framer Motion
- React Hook Form

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI
- Nodemailer

---
## 📂 Project Structure

```text
Realtime-ChatApp/
│
├── backend/
│   ├── ai/
│   │   └── gemini.js
│   │
│   ├── config/
│   │   └── index.js
│   │
│   ├── controllers/
│   │   ├── ai.controller.js
│   │   ├── auth.controller.js
│   │   ├── group.controller.js
│   │   ├── message.controller.js
│   │   └── user.controller.js
│   │
│   ├── lib/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   ├── email.js
│   │   ├── socket.js
│   │   └── utils.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── aiconversation.model.js
│   │   ├── group.model.js
│   │   ├── media.model.js
│   │   ├── message.model.js
│   │   ├── refreshToken.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── ai.route.js
│   │   ├── auth.route.js
│   │   ├── group.route.js
│   │   ├── message.route.js
│   │   └── user.route.js
│   │
│   ├── utils/
│   │   ├── response.js
│   │   └── token.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── group.validator.js
│   │   └── message.validator.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── ai/
│   │   │   ├── chat/
│   │   │   ├── common/
│   │   │   ├── group/
│   │   │   └── ui/
│   │   │
│   │   ├── context/
│   │   │   ├── AiContext.jsx
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ChatContext.jsx
│   │   │   ├── GroupContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── UiContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │
│   │   ├── layouts/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── MobileTabBar.jsx
│   │   │   └── NavRail.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AI/
│   │   │   │   └── AiPage.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Signup.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   ├── Chat/
│   │   │   │   └── ChatPage.jsx
│   │   │   ├── Groups/
│   │   │   │   └── GroupsPage.jsx
│   │   │   └── Settings/
│   │   │       └── SettingsPage.jsx
│   │   │
│   │   ├── routes/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── authService.js
│   │   │   ├── groupService.js
│   │   │   ├── messageService.js
│   │   │   └── userService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── fileToBase64.js
│   │   │   ├── formatTime.js
│   │   │   └── misc.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
``` 
---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/harshpatel-oss/pulse-chat
cd pulse-chat
```

### Install Dependencies

#### Backend

```bash
cd backend
npm install
npm run server
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **backend** directory.

```env
PORT=5000
MONGODB_URI=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=
CLIENT_URL=
GEMINI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
NODE_ENV=
COOKIE_SAME_SITE=
```

Create a `.env` file inside the **frontend** directory.

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📡 API Highlights

### Authentication
- Login / Signup
- Refresh Token
- Forgot & Reset Password
- Update Profile

### Chat
- Send & Receive Messages
- Edit/Delete Messages
- React to Messages
- Pin Messages
- Shared Media
- Read Receipts

### Groups
- Create & Join Groups
- Add/Remove Members
- Promote/Demote Members
- Discover Public Groups

### AI
- AI Conversations
- AI Message Generation
- Conversation History

---

## 🚀 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Render |
| Backend | Render |
| Database | MongoDB Atlas |
| Media Storage | Cloudinary |
| AI | Google Gemini |

---

## 🔮 Future Improvements

- 🎙️ Voice Messages
- 📞 Audio & Video Calling
- 📂 File Sharing
- 🔔 Push Notifications
- 🔐 End-to-End Encryption
- 📌 Pinned Conversations
- 🌙 Enhanced Themes

---

## 👨‍💻 Author

**Harsh Patel**

- GitHub: https://github.com/harshpatel-oss
- LinkedIn: https://www.linkedin.com/in/harshpatel1305/

---

## ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub!