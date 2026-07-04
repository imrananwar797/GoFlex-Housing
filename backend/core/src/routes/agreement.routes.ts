import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// GET /api/agreements — list agreements for current user
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const where = user.role === 'OWNER'
      ? { owner_id: user.id }
      : user.role === 'ADMIN'
      ? {}
      : { resident_id: user.id };
    const agreements = await prisma.rentalAgreement.findMany({
      where,
      include: {
        property: { select: { name: true, city: true } },
        resident: { select: { full_name: true, email: true } },
        owner: { select: { full_name: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json({ success: true, data: agreements });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch agreements' });
  }
});

// GET /api/agreements/:id — get single agreement
router.get('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const agreement = await prisma.rentalAgreement.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        property: true,
        resident: { select: { full_name: true, email: true, phone: true } },
        owner: { select: { full_name: true, email: true, phone: true } },
      },
    });
    if (!agreement) return res.status(404).json({ success: false, error: 'Agreement not found' });
    res.json({ success: true, data: agreement });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch agreement' });
  }
});

// POST /api/agreements/generate — owner creates a new agreement
router.post('/generate', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { property_id, resident_id, room_id, rent_amount, security_deposit, start_date, end_date, notice_period, clauses } = req.body;
    const agreement = await prisma.rentalAgreement.create({
      data: {
        property_id: Number(property_id),
        resident_id: Number(resident_id),
        owner_id: user.id,
        room_id: room_id ? Number(room_id) : undefined,
        rent_amount: Number(rent_amount),
        security_deposit: security_deposit ? Number(security_deposit) : undefined,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        notice_period: notice_period ? Number(notice_period) : 30,
        clauses: clauses || null,
        status: 'draft',
        renewal_reminder: new Date(new Date(end_date).getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    });
    res.json({ success: true, data: agreement });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate agreement' });
  }
});

// POST /api/agreements/:id/sign — resident or owner signs the agreement
router.post('/:id/sign', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const agreement = await prisma.rentalAgreement.findUnique({ where: { id: Number(req.params.id) } });
    if (!agreement) return res.status(404).json({ success: false, error: 'Agreement not found' });

    const isOwner = agreement.owner_id === user.id;
    const isResident = agreement.resident_id === user.id;

    const updated = await prisma.rentalAgreement.update({
      where: { id: agreement.id },
      data: {
        ...(isResident ? { resident_signed: true, resident_signed_at: new Date() } : {}),
        ...(isOwner ? { owner_signed: true, owner_signed_at: new Date() } : {}),
        status: isOwner && agreement.resident_signed ? 'signed' : isResident && agreement.owner_signed ? 'signed' : 'sent',
      },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to sign agreement' });
  }
});

export default router;
