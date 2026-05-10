import { Router } from 'express';
import { getAllProperties, getPropertyById, createProperty, updateProperty, deleteProperty } from '../controllers/property.controller';
import { authenticateJWT as authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.post('/', authenticate, createProperty);
router.put('/:id', authenticate, updateProperty);
router.delete('/:id', authenticate, deleteProperty);

export default router;
