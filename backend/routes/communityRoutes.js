import { Router } from 'express';
import {
  getPosts,
  createPost,
  getPostById,
  toggleLike,
  addComment,
  deleteComment,
  getTrending,
} from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/trending', getTrending);
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.post('/posts', protect, createPost);
router.post('/posts/:id/like', protect, toggleLike);
router.post('/posts/:id/comment', protect, addComment);
router.delete('/posts/:id/comment/:commentId', protect, deleteComment);

export default router;
