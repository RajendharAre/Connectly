# Connectly Backend

A simple social post backend built with Node.js, Express, and MongoDB.

## Setup Instructions

1. **Clone/Setup the project**
   ```bash
   cd backend
   npm install
   ```

2. **Create .env file** (copy from .env.example)
   ```bash
   cp .env.example .env
   ```

3. **Configure .env file** with:
   - MongoDB Atlas connection string
   - JWT Secret (any random string)
   - Cloudinary credentials (optional for deployment)
   - Frontend URL

4. **Run the server**
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts (feed)
- `POST /api/posts` - Create post (protected)
- `GET /api/posts/:id` - Get single post
- `DELETE /api/posts/:id` - Delete post (protected)
- `PUT /api/posts/:id/like` - Like/Unlike post (protected)
- `POST /api/posts/:id/comment` - Add comment (protected)
- `DELETE /api/posts/:postId/comment/:commentId` - Delete comment (protected)

## Deployment on Render

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy! 🚀
