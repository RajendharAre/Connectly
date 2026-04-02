const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Create Post (supports file upload or Base64 image)
router.post('/', authMiddleware, upload.single('image'), [
  body('content').optional().trim(),
  body('image').optional()
], postController.createPost);

// Get All Posts (Feed)
router.get('/', postController.getAllPosts);

// Get Single Post
router.get('/:id', postController.getPost);

// Like/Unlike Post
router.put('/:id/like', authMiddleware, postController.likePost);

// Add Comment
router.post('/:id/comment', authMiddleware, [
  body('text').trim().notEmpty().withMessage('Comment cannot be empty')
], postController.addComment);

// Delete Post
router.delete('/:id', authMiddleware, postController.deletePost);

// Delete Comment
router.delete('/:postId/comment/:commentId', authMiddleware, postController.deleteComment);

module.exports = router;
