import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  CircularProgress,
  Pagination
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../api/api';
import CreatePostCard from '../components/CreatePostCard';
import PostCard from '../components/PostCard';

const Feed = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = useCallback(async (pageNum) => {
    try {
      console.log('📄 Fetching posts for page:', pageNum);
      setLoading(true);
      const response = await postsAPI.getAllPosts(pageNum);
      setPosts(response.data.posts);
      setTotalPages(response.data.pagination.pages);
      setPage(pageNum);
      console.log('✅ Posts loaded for page', pageNum, '- Total pages:', response.data.pagination.pages);
      window.scrollTo(0, 0); // Scroll to top when page changes
    } catch (err) {
      console.error('❌ Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    } else {
      fetchPosts(1);
    }
  }, [user, navigate, fetchPosts]);

  const handlePostCreated = async () => {
    console.log('📝 New post created - refreshing to page 1');
    fetchPosts(1);
  };

  const handlePostDeleted = async () => {
    console.log('🗑️ Post deleted - refreshing current page');
    fetchPosts(page);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handlePageChange = (event, value) => {
    console.log('📖 Changing to page:', value);
    fetchPosts(value);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Social Feed
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Welcome, {user?.username}!
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              variant="outlined"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 3 }}>
        {/* Create Post Card */}
        <CreatePostCard onPostCreated={handlePostCreated} />

        {/* Posts Feed */}
        <Box sx={{ mt: 3 }}>
          {loading && page === 1 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : posts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="textSecondary">
                No posts yet. Be the first to post!
              </Typography>
            </Box>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onPostDeleted={handlePostDeleted} />
              ))}

              {/* Professional Numbered Pagination */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  siblingCount={1}
                  boundaryCount={1}
                  showFirstButton
                  showLastButton
                />
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Feed;
