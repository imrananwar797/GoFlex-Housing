import { Router } from 'express';
import { getAllProperties, getPropertyById } from '../controllers/property.controller';

const router = Router();

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

export default router;
