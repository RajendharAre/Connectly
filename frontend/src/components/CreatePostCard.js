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
  const [imageFile, setImageFile] = useState(null); // Store actual file for Cloudinary
  const [imageBase64, setImageBase64] = useState(null); // Backup Base64
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('📸 Image selected:', file.name, 'Size:', file.size, 'Type:', file.type);
      setImageFile(file); // Store actual file for Cloudinary
      
      // Create preview AND Base64 backup
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImageBase64(reader.result); // Keep Base64 as fallback
        console.log('✅ Image preview created + Base64 backup ready');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📤 Submitting post...');
    
    if (!content.trim() && !imageFile) {
      setError('Post must contain text or image');
      console.error('❌ No content or image');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('🚀 Creating post with file:', { content: content.trim() ? 'text' : 'no text', hasFile: !!imageFile });
      
      // If we have a file, TRY CLOUDINARY FIRST
      if (imageFile) {
        try {
          console.log('☁️ Attempting Cloudinary upload...');
          const response = await postsAPI.createPostWithFile(content.trim(), imageFile);
          console.log('✅ Post created with Cloudinary:', response.data);
        } catch (cloudinaryErr) {
          // CLOUDINARY FAILED - FALLBACK TO BASE64
          console.warn('⚠️ Cloudinary failed:', cloudinaryErr.message);
          console.log('📥 Falling back to Base64 storage...');
          
          const response = await postsAPI.createPost({
            content: content.trim(),
            image: imageBase64  // Use Base64 backup
          });
          console.log('✅ Post created with Base64 (Cloudinary was unavailable):', response.data);
        }
      } else {
        // No file, just text
        console.log('📝 Sending post with text only...');
        const response = await postsAPI.createPost({
          content: content.trim()
        });
        console.log('✅ Post created:', response.data);
      }
      
      setContent('');
      setImage('');
      setImageFile(null);
      setImageBase64(null);
      onPostCreated();
    } catch (err) {
      console.error('❌ Error creating post:', err.response?.data || err.message);
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
                onClick={() => {
                  setImage('');
                  setImageFile(null);
                  setImageBase64(null);
                  console.log('🗑️ Image removed');
                }}
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
