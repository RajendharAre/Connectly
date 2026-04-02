# Connectly - Mini Social Post Application

A full-stack social media application inspired by TaskPlanet's social feed. Built with React, Node.js, Express, MongoDB, and Material-UI.

## 📋 Project Overview

This is a mini social post application where users can:
- Create accounts with email and password
- Create posts with text and/or images
- View a public feed of all posts
- Like and unlike posts
- Comment on posts
- Delete their own posts and comments

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Material-UI (MUI) for styling (with TaskPlanet color palette)
- React Router 6 for navigation
- Axios for API calls with request interceptors

**Backend:**
- Node.js v22+ with Express
- MongoDB for database with Mongoose ODM
- JWT for stateless authentication (7-day expiration)
- Bcrypt for password hashing (10 salt rounds)
- Cloudinary for cloud-based image uploads
- Multer for file upload handling (5MB limit)
- Express Validator for input validation

## 📁 Project Structure

```
SocialTL/
├── backend/
│   ├── models/           # MongoDB schemas (User, Post)
│   ├── controllers/      # Business logic (auth, posts)
│   ├── routes/          # API routes (auth, posts)
│   ├── middleware/      # JWT auth, file upload (Cloudinary)
│   ├── server.js        # Express server with CORS
│   ├── package.json     # Dependencies (nodemon v3.1.14+)
│   ├── .env             # Environment variables
│   └── .env.example     # Example env file
└── frontend/
    ├── src/
    │   ├── pages/       # Feed, Signup, Signin pages
    │   ├── components/  # PostCard, CreatePostCard, CommentSection
    │   ├── context/     # AuthContext with localStorage persistence
    │   ├── api/         # Axios instances with JWT interceptor
    │   ├── App.js       # Protected routes & authentication
    │   └── theme.js     # Material-UI theme with TaskPlanet colors
    ├── public/          # index.html with Roboto font
    ├── package.json     # React 18, Material-UI 5+
    └── .env.example     # Frontend API URL config
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v22+)
- MongoDB Atlas account
- Cloudinary account (free tier available at cloudinary.com)

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with:
   ```
   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Connectly
   
   # JWT
   JWT_SECRET=your_super_secret_key_min_32_chars
   PORT=5000
   
   # Cloudinary (get from dashboard.cloudinary.com)
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Frontend
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

✅ Backend will run on `http://localhost:5000`

**Security Features:**
- ✅ JWT authentication (7-day tokens)
- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ Request validation with express-validator
- ✅ CORS enabled for frontend
- ✅ Zero high-severity vulnerabilities

### Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start development server:
   ```bash
   npm start
   ```

✅ Frontend will run on `http://localhost:3000`

**Features:**
- ✅ Material-UI with TaskPlanet color palette
- ✅ JWT token persistence in localStorage
- ✅ Protected routes with authentication checks
- ✅ Automatic token injection in API requests
- ✅ Real-time post feed with pagination
- ✅ Zero ESLint warnings

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `POST /api/posts` - Create new post (protected)
- `GET /api/posts/:id` - Get single post
- `DELETE /api/posts/:id` - Delete post (protected)
- `PUT /api/posts/:id/like` - Like/Unlike post (protected)
- `POST /api/posts/:id/comment` - Add comment (protected)
- `DELETE /api/posts/:postId/comment/:commentId` - Delete comment (protected)

## 🌐 Deployment

### Deploy Backend on Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repository
4. Set environment variables in Render dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
5. Deploy!

### Deploy Frontend on Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Set environment variables:
   - `REACT_APP_API_URL` (your Render backend URL)
4. Deploy!

### Database Setup on MongoDB Atlas

1. Create account on MongoDB Atlas
2. Create a new cluster
3. Create database and collections
4. Copy connection string and add to backend `.env`

## 🎨 Features

- ✅ User authentication with JWT
- ✅ Create posts with text and/or images
- ✅ Public feed with pagination
- ✅ Like and unlike posts
- ✅ Comment on posts
- ✅ Delete own posts and comments
- ✅ Responsive Material-UI design
- ✅ Clean and modern UI (inspired by TaskPlanet)

## 🔐 Security Features

- Password hashing with bcrypt
- JWT authentication for protected routes
- Input validation with express-validator
- CORS configuration
- Secure token storage

## 📝 Validation Rules

- **Username**: Minimum 3 characters
- **Email**: Valid email format
- **Password**: Minimum 6 characters
- **Post**: Must contain either text or image (or both)
- **Comment**: Cannot be empty

## 🐛 Troubleshooting

**Issue**: Backend connection error
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas network access is open

**Issue**: CORS errors in frontend
- Check `FRONTEND_URL` in backend `.env`
- Ensure backend and frontend URLs are correct

**Issue**: Image upload not working
- Cloudinary setup is optional for basic functionality
- Images are stored as Base64 in MongoDB for now

## 📄 License

MIT

## 👨‍💻 Author

Rajendhar Are - Connectly

## 🙏 Acknowledgments

- Material-UI for beautiful components
- MERN stack community

