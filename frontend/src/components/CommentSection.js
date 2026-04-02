import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ comments, onDeleteComment }) => {
  const { user } = useAuth();

  if (comments.length === 0) {
    return (
      <Typography variant="caption" color="textSecondary">
        No comments yet
      </Typography>
    );
  }

  return (
    <Box>
      {comments.map((comment, index) => (
        <Box key={comment._id}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
              {comment.author.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {comment.author.username}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {comment.text}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(comment.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            {user?.id === comment.author._id && (
              <IconButton
                size="small"
                onClick={() => onDeleteComment(comment._id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          {index < comments.length - 1 && <Divider sx={{ my: 1 }} />}
        </Box>
      ))}
    </Box>
  );
};

export default CommentSection;
