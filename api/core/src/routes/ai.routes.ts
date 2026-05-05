import { Router } from 'express';
import { aiService } from '../services/ai.service';
const router = Router();

router.get('/recommendations', async (req, res) => {
  const { user_id } = req.query;
  try {
    const data = await aiService.getRecommendations(Number(user_id));
    res.json(data);
  } catch (error) {
    res.status(500).json({ detail: 'AI Service error' });
  }
});

export default router;
