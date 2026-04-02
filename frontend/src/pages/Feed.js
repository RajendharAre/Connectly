import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  CircularProgress
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
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllPosts(page);
      setPosts(response.data.posts);
      setHasMore(page < response.data.pagination.pages);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const loadMorePosts = useCallback(async () => {
    try {
      const response = await postsAPI.getAllPosts(page);
      setPosts([...posts, ...response.data.posts]);
      setHasMore(page < response.data.pagination.pages);
    } catch (err) {
      console.error('Error loading more posts:', err);
    }
  }, [page, posts]);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    } else {
      setPage(1);
      fetchPosts();
    }
  }, [user, navigate, fetchPosts]);

  const handlePostCreated = async () => {
    setPage(1);
    fetchPosts();
  };

  const handlePostDeleted = async () => {
    fetchPosts();
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (page > 1) {
      loadMorePosts();
    }
  }, [page, loadMorePosts]);

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

              {hasMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button variant="outlined" onClick={handleLoadMore}>
                    Load More
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Feed;
