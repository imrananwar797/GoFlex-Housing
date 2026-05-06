import { Router } from 'express';
import axios from 'axios';

const router = Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || 'goflex-internal-m2m-secret';

const aiHeaders = (req: any) => ({
  'X-Internal-Secret': INTERNAL_SECRET,
  Authorization: req.headers.authorization
});

router.get('/plans', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/subscriptions/plans`, {
      headers: { 'X-Internal-Secret': INTERNAL_SECRET }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ detail: 'AI Service error' });
  }
});

router.get('/current', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/subscriptions/my-subscription`, {
      headers: aiHeaders(req)
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ detail: 'AI Service error' });
  }
});

router.post('/create', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/subscriptions/create-checkout-session`, req.body, {
      headers: aiHeaders(req)
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ detail: 'AI Service error' });
  }
});

export default router;
