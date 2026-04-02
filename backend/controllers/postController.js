const Post = require('../models/Post');
const User = require('../models/User');

// Create Post
exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const userId = req.userId;

    // Determine image source: Cloudinary upload or Base64
    let imageData = null;
    
    if (req.file) {
      // File uploaded to Cloudinary
      imageData = req.file.path; // Cloudinary URL
    } else if (image) {
      // Base64 image from request body
      imageData = image;
    }

    // Validate that at least content or image exists
    if (!content && !imageData) {
      return res.status(400).json({
        success: false,
        message: 'Post must contain either text or image'
      });
    }

    const post = new Post({
      author: userId,
      content: content || '',
      image: imageData || null
    });

    await post.save();
    await post.populate('author', 'username profilePicture');

    res.status(201).json({
      success: true,
      message: req.file ? 'Post created with Cloudinary image' : 'Post created successfully',
      post
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get All Posts (Feed)
exports.getAllPosts = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username')
      .populate('likes', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      success: true,
      posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get Single Post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username')
      .populate('likes', 'username');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Like Post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const userId = req.userId;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    await post.populate('author', 'username profilePicture');
    await post.populate('comments.author', 'username');
    await post.populate('likes', 'username');

    res.json({
      success: true,
      post,
      liked: !alreadyLiked
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment text cannot be empty'
      });
    }

    post.comments.push({
      author: req.userId,
      text: text.trim()
    });

    await post.save();
    await post.populate('author', 'username profilePicture');
    await post.populate('comments.author', 'username');
    await post.populate('likes', 'username');

    res.json({
      success: true,
      post
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Delete Post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the author of comment
    if (comment.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    post.comments.id(commentId).remove();
    await post.save();
    await post.populate('author', 'username profilePicture');
    await post.populate('comments.author', 'username');
    await post.populate('likes', 'username');

    res.json({
      success: true,
      post
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
