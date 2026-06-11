import Post from '../models/Post.js';

export const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Post.countDocuments();
    const posts = await Post.find()
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { content, image } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Post content is required.' });
    }

    const post = await Post.create({
      author: req.user._id,
      content: content.trim(),
      image: image || '',
    });

    const populated = await post.populate('author', 'name avatar');

    res.status(201).json({ success: true, post: populated });
  } catch (err) {
    next(err);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const userId = req.user._id;
    const alreadyLiked = post.likes.some((id) => id.toString() === userId.toString());

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const populated = await Post.populate(post, [
      { path: 'author', select: 'name avatar' },
      { path: 'comments.user', select: 'name avatar' },
    ]);

    res.json({ success: true, post: populated });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    post.comments.push({ user: req.user._id, text: text.trim() });
    await post.save();

    const populated = await Post.populate(post, [
      { path: 'author', select: 'name avatar' },
      { path: 'comments.user', select: 'name avatar' },
    ]);

    res.status(201).json({ success: true, post: populated });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found.' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete your own comments.' });
    }

    comment.deleteOne();
    await post.save();

    const populated = await Post.populate(post, [
      { path: 'author', select: 'name avatar' },
      { path: 'comments.user', select: 'name avatar' },
    ]);

    res.json({ success: true, post: populated });
  } catch (err) {
    next(err);
  }
};

export const getTrending = async (_req, res, next) => {
  try {
    const [mostLiked, allPosts] = await Promise.all([
      Post.find().populate('author', 'name avatar').sort({ likes: -1 }).limit(5),
      Post.find().populate('author', 'name avatar'),
    ]);

    const mostCommented = allPosts
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 5);

    res.json({
      success: true,
      trending: { mostLiked, mostCommented },
    });
  } catch (err) {
    next(err);
  }
};
