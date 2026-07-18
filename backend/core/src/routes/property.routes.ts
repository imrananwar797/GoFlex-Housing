import express from 'express';
import { getProperties, getFeaturedProperties, getPropertyById, searchProperties, getCities } from '../controllers/property.controller';

const router = express.Router();

router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/search', searchProperties);
router.get('/cities', getCities);
router.get('/:id', getPropertyById);

export default router;
