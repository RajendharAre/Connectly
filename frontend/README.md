# Connectly Frontend

A React-based social feed application built with Material-UI.

## Setup Instructions

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Create .env file** (copy from .env.example)
   ```bash
   cp .env.example .env
   ```

3. **Configure .env file** with your backend API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Run the development server**
   ```bash
   npm start
   ```

The app will run on `http://localhost:3000`

## Features

- User authentication (signup/signin)
- Create posts with text and/or images
- View public feed of all posts
- Like and unlike posts
- Comment on posts
- Delete own posts and comments
- Responsive Material-UI design

## Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy! 🚀

## Project Structure

```
src/
├── pages/           # Page components (Feed, Signin, Signup)
├── components/      # Reusable components (PostCard, etc.)
├── context/         # Auth context
├── api/             # API services
├── theme.js         # Material-UI theme
└── App.js           # Main app component
```
