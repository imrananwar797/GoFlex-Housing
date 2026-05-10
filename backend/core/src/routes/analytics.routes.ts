import { Router } from 'express';
import { getPredictiveAnalytics, getResidentLifeTelemetry } from '../controllers/analytics.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/predictive', authenticateJWT, getPredictiveAnalytics);
router.get('/telemetry', authenticateJWT, getResidentLifeTelemetry);

export default router;
