import { Router } from 'express';
import { login, register, validate2FA } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/2fa/validate-login', validate2FA);

export default router;
