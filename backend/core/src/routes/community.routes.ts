import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// GET /api/community?property_id=X — get posts for a property
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { property_id } = req.query;
    const posts = await prisma.communityPost.findMany({
      where: property_id ? { property_id: Number(property_id) } : undefined,
      include: { author: { select: { full_name: true, username: true } } },
      orderBy: [{ is_pinned: 'desc' }, { created_at: 'desc' }],
    });
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch community posts' });
  }
});

// POST /api/community — create a community post
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { property_id, type, title, content, image_url, is_pinned } = req.body;
    const post = await prisma.communityPost.create({
      data: {
        property_id: Number(property_id),
        author_id: user.id,
        type: type || 'announcement',
        title,
        content,
        image_url,
        is_pinned: is_pinned || false,
      },
    });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create post' });
  }
});

// DELETE /api/community/:id — delete a post (owner or admin)
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    await prisma.communityPost.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete post' });
  }
});

export default router;
