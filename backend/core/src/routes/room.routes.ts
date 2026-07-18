import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { getRoomsByProperty, createRoom, updateRoom, deleteRoom } from '../controllers/room.controller';

const router = express.Router();

router.get('/property/:property_id', getRoomsByProperty);
router.post('/', authenticate, requireRole('OWNER', 'ADMIN'), createRoom);
router.patch('/:id', authenticate, requireRole('OWNER', 'ADMIN'), updateRoom);
router.delete('/:id', authenticate, requireRole('OWNER', 'ADMIN'), deleteRoom);

export default router;
