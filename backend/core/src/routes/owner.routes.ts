import { Router } from 'express';
import axios from 'axios';

const router = Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || 'goflex-internal-m2m-secret';

const aiHeaders = (req: any) => ({
  'X-Internal-Secret': INTERNAL_SECRET,
  Authorization: req.headers.authorization
});

// Analytics
router.get('/dashboard', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/analytics/owner`, {
      headers: aiHeaders(req)
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ detail: 'AI Service error' });
  }
});

// Residents
router.get('/residents', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/owner/residents`, {
      headers: aiHeaders(req)
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ detail: 'AI Service error' });
  }
});

// Issue Bill
router.post('/issue-bill', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/owner/issue-bill`, req.body, {
      headers: aiHeaders(req)
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ detail: 'AI Service error' });
  }
});

// Properties
router.get('/properties', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/owner/properties`, {
      headers: aiHeaders(req)
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ detail: 'AI Service error' });
  }
});

export default router;
