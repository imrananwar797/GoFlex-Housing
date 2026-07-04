import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

const SERVICE_CATALOGUE = [
  { id: 'cleaning', label: 'House Cleaning', icon: '🧹', price_from: 299, turnaround: '2-4 hrs' },
  { id: 'laundry', label: 'Laundry', icon: '👕', price_from: 150, turnaround: 'Next day' },
  { id: 'repairs', label: 'Repairs & Maintenance', icon: '🔧', price_from: 200, turnaround: 'Same day' },
  { id: 'internet', label: 'Internet Installation', icon: '📶', price_from: 499, turnaround: '1-2 days' },
  { id: 'groceries', label: 'Grocery Delivery', icon: '🛒', price_from: 0, turnaround: '2 hrs' },
  { id: 'shifting', label: 'House Shifting', icon: '📦', price_from: 1999, turnaround: '1 day' },
  { id: 'painting', label: 'Painting', icon: '🎨', price_from: 5000, turnaround: '2-3 days' },
  { id: 'pest_control', label: 'Pest Control', icon: '🪲', price_from: 799, turnaround: '1 day' },
];

// GET /api/services — return service catalogue
router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: SERVICE_CATALOGUE });
});

// POST /api/services/request — book a service
router.post('/request', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { property_id, service_type, description, scheduled_at, cost_estimate } = req.body;
    const request = await prisma.serviceRequest.create({
      data: {
        resident_id: user.id,
        property_id: Number(property_id),
        service_type,
        description,
        scheduled_at: scheduled_at ? new Date(scheduled_at) : undefined,
        cost_estimate: cost_estimate ? Number(cost_estimate) : undefined,
        status: 'pending',
      },
    });
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to book service' });
  }
});

// GET /api/services/requests — list my service requests
router.get('/requests', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const requests = await prisma.serviceRequest.findMany({
      where: { resident_id: user.id },
      orderBy: { created_at: 'desc' },
    });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch service requests' });
  }
});

export default router;
