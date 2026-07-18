import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getMyPayments, getPaymentReceipt, initializePayment, getOwnerPaymentsSummary } from '../controllers/payment.controller';

const router = express.Router();

router.use(authenticate);
router.get('/', getMyPayments);
router.get('/receipt/:id', getPaymentReceipt);
router.post('/initialize', initializePayment);
router.get('/owner/summary', getOwnerPaymentsSummary);

export default router;
