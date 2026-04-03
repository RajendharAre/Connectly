import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔐 Request Config:', config.method.toUpperCase(), config.url, 'Token:', token ? '✅ Present' : '❌ Missing');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Log responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.data.message || 'Success');
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  signin: (data) => api.post('/auth/signin', data),
  getCurrentUser: () => api.get('/auth/me')
};

// Posts API
export const postsAPI = {
  getAllPosts: (page = 1) => api.get('/posts', { params: { page } }),
  
  createPost: (data) => api.post('/posts', data),
  
  createPostWithFile: (content, file) => {
    console.log('📤 Creating FormData for file upload...');
    const formData = new FormData();
    formData.append('content', content);
    formData.append('image', file);
    
    console.log('📁 FormData prepared:', {
      content: content || 'empty',
      image: file.name,
      size: file.size,
      type: file.type
    });
    
    // Create a custom axios request to send FormData
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/posts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
  },
  
  getPost: (id) => api.get(`/posts/${id}`),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.put(`/posts/${id}/like`),
  addComment: (id, text) => api.post(`/posts/${id}/comment`, { text }),
  deleteComment: (postId, commentId) => api.delete(`/posts/${postId}/comment/${commentId}`)
};

export default api;
