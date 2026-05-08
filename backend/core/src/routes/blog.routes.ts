import { Router } from 'express';
import { getAllPosts, getPostBySlug, createPost } from '../controllers/blog.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);
router.post('/', authenticate, createPost);

export default router;

export default router;
