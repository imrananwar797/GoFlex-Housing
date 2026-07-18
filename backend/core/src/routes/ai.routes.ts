import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getRecommendations } from '../services/ai.service';

const router = Router();

router.post('/recommendations', authenticate, async (req, res) => {
  try {
    const { budget, city, amenities } = req.body;
    const user_id = (req as any).user?.user_id;
    const recommendations = await getRecommendations({ budget: Number(budget) || 10000, city, amenities, user_id });
    res.json(recommendations);
  } catch (error) {
    console.error('[AI Route]', error);
    res.status(500).json({ detail: 'Recommendation service error' });
  }
});

router.get('/recommendations', async (req, res) => {
  try {
    const { budget, city } = req.query;
    const recommendations = await getRecommendations({
      budget: Number(budget) || 10000,
      city: city ? String(city) : undefined,
    });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ detail: 'Recommendation service error' });
  }
});

export default router;
