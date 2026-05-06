import { Router } from 'express';
import { uploadKYCDocument, getKYCStatus } from '../controllers/kyc.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.post('/upload', uploadKYCDocument);
// router.post('/upload-file', uploadFile);
router.get('/status', getKYCStatus);

export default router;
