import { Router } from 'express';
import { getPaymentMethods, initiatePayment, handleWebhook } from '../controllers/payment.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/methods', authenticateJWT, getPaymentMethods);
router.post('/initiate', authenticateJWT, initiatePayment);
router.post('/webhook', handleWebhook); // Public webhook endpoint

export default router;
