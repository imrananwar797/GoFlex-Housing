import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import {
  getSystemStats,
  getAllUsers,
  updateUserRole,
  getAllKYCRequests,
  reviewKYC,
  getAllFraudAlerts,
  getAllBookingsAdmin,
  togglePropertyVerification,
} from '../controllers/admin.controller';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('ADMIN'));

router.get('/stats', getSystemStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.get('/kyc', getAllKYCRequests);
router.patch('/kyc/:id', reviewKYC);
router.get('/fraud-alerts', getAllFraudAlerts);
router.get('/bookings', getAllBookingsAdmin);
router.patch('/properties/:id/verify', togglePropertyVerification);

export default router;
