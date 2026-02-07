# 💬 TalkM Backend - Real-Time Chat Application Server

Backend server for TalkM, a modern real-time chat application built with Node.js, Express, and Socket.IO. This server handles user authentication, real-time messaging, room management, and online presence tracking.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## 🌟 Features

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure token-based user authentication
- **Session Management**: Smooth login/logout with persistent sessions
- **Password Encryption**: Bcrypt hashing for secure password storage
- **Protected Routes**: Middleware-based route protection

### 💬 Real-Time Communication
- **WebSocket Integration**: Bi-directional real-time communication using Socket.IO
- **Instant Messaging**: Zero-latency message delivery
- **Typing Indicators**: Real-time typing status updates
- **Message Acknowledgments**: Delivery and read receipts

### 👥 User Management
- **Online Presence Tracking**: Live user status updates
- **User Profiles**: Customizable user information
- **Active Users List**: Real-time list of currently online users

### 🏠 Room & Chat Management
- **Group Chats**: Create and manage group conversations
- **Private Chats**: One-on-one messaging
- **Room-Based Communication**: Organized chat rooms
- **Message History**: Persistent chat storage with MongoDB

### 📊 Additional Features
- **Message Persistence**: All messages stored in MongoDB
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Cross-origin resource sharing enabled
- **Scalable Architecture**: Designed for horizontal scaling

## 🛠️ Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **Socket.IO** - Real-time bidirectional event-based communication
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **cookie-parser** - Parse HTTP cookies
- **dotenv** - Environment variable management

### Utilities
- **CORS** - Cross-origin resource sharing
- **morgan** - HTTP request logger middleware

## 📁 Project Structure

```
chatapp_backend/
├── controllers/          # Request handlers and business logic
│   ├── authController.js    # Authentication logic
│   ├── messageController.js # Message handling
│   └── userController.js    # User management
├── middleware/          # Custom middleware functions
│   ├── authMiddleware.js    # JWT verification
│   └── errorHandler.js      # Error handling
├── models/              # Mongoose schemas and models
│   ├── User.js             # User schema
│   ├── Message.js          # Message schema
│   └── Room.js             # Chat room schema
├── routes/              # API route definitions
│   ├── authRoutes.js       # Authentication routes
│   ├── messageRoutes.js    # Message routes
│   └── userRoutes.js       # User routes
├── utils/               # Utility functions
│   ├── generateToken.js    # JWT token generation
│   └── socketHandler.js    # Socket.IO event handlers
├── .gitignore           # Git ignore file
├── package.json         # Project dependencies
├── package-lock.json    # Dependency lock file
└── server.js            # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Bisha18/chatapp_backend.git
cd chatapp_backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/talkm
# OR use MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/talkm

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Session Secret
SESSION_SECRET=your_session_secret_here
```

4. **Start MongoDB**

For local MongoDB:
```bash
mongod
```

For MongoDB Atlas, ensure your connection string is correctly configured in `.env`

5. **Run the server**

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### User Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | Yes |
| GET | `/api/users/:id` | Get user by ID | Yes |
| PUT | `/api/users/:id` | Update user profile | Yes |
| GET | `/api/users/online` | Get online users | Yes |

### Message Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/messages/:roomId` | Get room messages | Yes |
| POST | `/api/messages` | Send message | Yes |
| DELETE | `/api/messages/:id` | Delete message | Yes |

### Room Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/rooms` | Get all rooms | Yes |
| POST | `/api/rooms` | Create room | Yes |
| GET | `/api/rooms/:id` | Get room details | Yes |
| PUT | `/api/rooms/:id` | Update room | Yes |
| DELETE | `/api/rooms/:id` | Delete room | Yes |

## 🔌 Socket.IO Events

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join_room` | `{ roomId, userId }` | Join a chat room |
| `leave_room` | `{ roomId, userId }` | Leave a chat room |
| `send_message` | `{ roomId, message, userId }` | Send a message |
| `typing` | `{ roomId, userId, isTyping }` | Typing indicator |
| `user_online` | `{ userId }` | Mark user as online |
| `user_offline` | `{ userId }` | Mark user as offline |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `message_received` | `{ message }` | New message received |
| `user_joined` | `{ userId, roomId }` | User joined room |
| `user_left` | `{ userId, roomId }` | User left room |
| `typing_update` | `{ userId, isTyping }` | Typing status update |
| `online_users` | `{ users[] }` | List of online users |
| `error` | `{ message }` | Error notification |

## 🔒 Authentication Flow

1. **Registration**
   - User submits registration form
   - Password is hashed using bcrypt
   - User document created in MongoDB
   - JWT token generated and sent to client

2. **Login**
   - User submits credentials
   - Password verified against hashed password
   - JWT token generated
   - Token sent in HTTP-only cookie

3. **Protected Routes**
   - Client sends JWT token in Authorization header or cookie
   - Middleware verifies token
   - User ID extracted from token
   - Request proceeds if valid

## 💾 Database Schema

### User Schema
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  avatar: String (optional),
  isOnline: Boolean (default: false),
  lastSeen: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Schema
```javascript
{
  sender: ObjectId (ref: 'User'),
  room: ObjectId (ref: 'Room'),
  content: String (required),
  type: String (text/image/file),
  readBy: [ObjectId] (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Room Schema
```javascript
{
  name: String (required),
  type: String (group/private),
  participants: [ObjectId] (ref: 'User'),
  admin: ObjectId (ref: 'User'),
  lastMessage: ObjectId (ref: 'Message'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

Run tests (if configured):
```bash
npm test
```

## 🚀 Deployment

### Deploy to Heroku

1. Install Heroku CLI
2. Login to Heroku
```bash
heroku login
```

3. Create new Heroku app
```bash
heroku create talkm-backend
```

4. Set environment variables
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set FRONTEND_URL=your_frontend_url
```

5. Deploy
```bash
git push heroku main
```

### Deploy to Railway/Render

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push to main

## 🔗 Frontend Repository

This backend pairs with the TalkM frontend application:
- **Frontend Repo**: [chatweb_frontend](https://github.com/Bisha18/chatweb_frontend)
- **Live Demo**: [talksyweb.vercel.app](https://talksyweb.vercel.app)

## 🛡️ Security Best Practices

- Environment variables for sensitive data
- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt (10 salt rounds)
- Input validation and sanitization
- Rate limiting on authentication endpoints
- CORS configuration for trusted origins
- Helmet.js for security headers

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Bishal Paul**

- GitHub: [@Bisha18](https://github.com/Bisha18)
- LinkedIn: [Bishal Paul](https://www.linkedin.com/in/bishal-paul-2897a624b/)
- Email: d.bishalpaul@gmail.com

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [Socket.IO](https://socket.io/) - Real-time bidirectional event-based communication
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication

## 📊 Project Status

This project is actively maintained and open for contributions. Feel free to report issues or suggest features!

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Bishal Paul

</div>
