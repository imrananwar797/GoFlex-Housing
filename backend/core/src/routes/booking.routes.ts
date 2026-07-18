import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { createBooking, getMyBookings, getBookingById, cancelBooking, confirmBooking } from '../controllers/booking.controller';

const router = express.Router();

router.use(authenticate);
router.post('/', createBooking);
router.get('/', getMyBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);
router.patch('/:id/confirm', confirmBooking);

export default router;
