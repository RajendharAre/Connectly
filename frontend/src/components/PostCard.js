import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Avatar,
  Divider,
  TextField,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { postsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';

const PostCard = ({ post, onPostDeleted }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes.some(like => like._id === user?.id));
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleLike = async () => {
    try {
      const response = await postsAPI.likePost(post._id);
      setLiked(response.data.liked);
      setLikes(response.data.post.likes);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const response = await postsAPI.addComment(post._id, commentText);
      setComments(response.data.post.comments);
      setCommentText('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await postsAPI.deleteComment(post._id, commentId);
      setComments(response.data.post.comments);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleDeletePost = async () => {
    setDeleting(true);
    try {
      await postsAPI.deletePost(post._id);
      onPostDeleted();
    } catch (err) {
      console.error('Error deleting post:', err);
    } finally {
      setDeleting(false);
      setAnchorEl(null);
    }
  };

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isAuthor = user?.id === post.author._id;

  return (
    <Card sx={{ mb: 2 }}>
      {/* Post Header */}
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 40, height: 40 }}>
              {post.author.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {post.author.username}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {isAuthor && (
            <>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleDeletePost} disabled={deleting}>
                  Delete Post
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Post Content */}
        {post.content && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {post.content}
          </Typography>
        )}

        {/* Post Image */}
        {post.image && (
          <Box sx={{ mt: 2 }}>
            <img src={post.image} alt="post" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
          </Box>
        )}
      </CardContent>

      {/* Post Stats */}
      <CardContent sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="caption" color="textSecondary">
            {likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </Typography>
        </Box>
      </CardContent>

      <Divider />

      {/* Action Buttons */}
      <CardActions sx={{ justifyContent: 'space-around', py: 1 }}>
        <Button
          startIcon={liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
          onClick={handleLike}
          size="small"
          sx={{ color: liked ? '#1976d2' : 'inherit' }}
        >
          Like
        </Button>
        <Button
          startIcon={<CommentIcon />}
          onClick={() => setShowComments(!showComments)}
          size="small"
        >
          Comment
        </Button>
      </CardActions>

      {/* Comments Section */}
      {showComments && (
        <>
          <Divider />
          <CardContent sx={{ pt: 2 }}>
            {/* Add Comment */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                placeholder="Add a comment..."
                size="small"
                fullWidth
                multiline
                maxRows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleComment}
                disabled={!commentText.trim()}
              >
                Post
              </Button>
            </Box>

            {/* Comments List */}
            <CommentSection
              comments={comments}
              onDeleteComment={handleDeleteComment}
            />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default PostCard;
