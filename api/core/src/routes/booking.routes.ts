import { Router } from 'express';
import { createBooking, getMyBookings } from '../controllers/booking.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);
router.post('/', createBooking);
router.get('/my', getMyBookings);

export default router;
