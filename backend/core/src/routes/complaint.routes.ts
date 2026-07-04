import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// POST /api/complaints — raise a new complaint
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { property_id, room_id, category, priority, title, description } = req.body;
    const user = (req as any).user;
    const complaint = await prisma.complaint.create({
      data: {
        resident_id: user.id,
        property_id: property_id ? Number(property_id) : undefined,
        room_id: room_id ? Number(room_id) : undefined,
        category,
        priority: priority || 'medium',
        title,
        description,
      },
    });
    res.json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create complaint' });
  }
});

// GET /api/complaints — list complaints for current resident
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const where = user.role === 'OWNER' || user.role === 'ADMIN'
      ? {} // owners/admins see all
      : { resident_id: user.id };
    const complaints = await prisma.complaint.findMany({
      where,
      include: { property: { select: { name: true } }, room: { select: { name: true } } },
      orderBy: { created_at: 'desc' },
    });
    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch complaints' });
  }
});

// PATCH /api/complaints/:id/status — update complaint status
router.patch('/:id/status', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await prisma.complaint.update({
      where: { id: Number(req.params.id) },
      data: {
        status,
        resolved_at: status === 'resolved' ? new Date() : undefined,
      },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update complaint' });
  }
});

export default router;
