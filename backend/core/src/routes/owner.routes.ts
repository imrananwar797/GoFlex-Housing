import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import {
  getOwnerDashboard,
  getOwnerProperties,
  createProperty,
  updateProperty,
  getOwnerResidents,
  getOwnerRevenue,
  getOwnerBookings,
  getOwnerAgreements,
  ownerSignAgreement,
} from '../controllers/owner.controller';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('OWNER', 'ADMIN'));

router.get('/dashboard', getOwnerDashboard);
router.get('/properties', getOwnerProperties);
router.post('/properties', createProperty);
router.patch('/properties/:id', updateProperty);
router.get('/residents', getOwnerResidents);
router.get('/revenue', getOwnerRevenue);
router.get('/bookings', getOwnerBookings);
router.get('/agreements', getOwnerAgreements);
router.patch('/agreements/:id/sign', ownerSignAgreement);

export default router;
