import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import { postsAPI } from '../api/api';

const CreatePostCard = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      setError('Post must contain text or image');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await postsAPI.createPost({
        content: content.trim(),
        image
      });
      setContent('');
      setImage('');
      onPostCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField
            placeholder="What's on your mind?"
            multiline
            rows={3}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="outlined"
          />

          {image && (
            <Box sx={{ position: 'relative' }}>
              <img src={image} alt="preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              <Button
                size="small"
                onClick={() => setImage('')}
                sx={{ position: 'absolute', top: 0, right: 0 }}
              >
                Remove
              </Button>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              Add Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePostCard;
