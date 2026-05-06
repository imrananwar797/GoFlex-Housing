import { Router } from 'express';
import { getEscrowStatus, disputeEscrow, releaseEscrow } from '../controllers/escrow.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/status', getEscrowStatus);
router.post('/dispute', disputeEscrow);
router.post('/release', authorizeRole('ADMIN'), releaseEscrow);

export default router;
