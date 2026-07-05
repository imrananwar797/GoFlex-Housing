import { Router } from 'express';
import { login, register, validate2FA, getMe } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/2fa/validate-login', validate2FA);
router.get('/me', authenticateJWT, getMe);

export default router;
