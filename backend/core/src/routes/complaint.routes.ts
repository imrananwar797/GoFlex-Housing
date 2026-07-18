import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getPropertyComplaints,
  updateComplaintStatus,
  getComplaintById,
} from '../controllers/complaint.controller';

const router = express.Router();

router.use(authenticate);
router.post('/', createComplaint);
router.get('/mine', getMyComplaints);
router.get('/property', getPropertyComplaints); // owner: their properties
router.get('/all', requireRole('ADMIN'), getAllComplaints);
router.get('/:id', getComplaintById);
router.patch('/:id/status', requireRole('ADMIN', 'OWNER'), updateComplaintStatus);

export default router;
