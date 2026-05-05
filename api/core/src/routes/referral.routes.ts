import { Router } from 'express';
import { getReferralStats } from '../controllers/referral.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);
router.get('/stats', getReferralStats);

export default router;
