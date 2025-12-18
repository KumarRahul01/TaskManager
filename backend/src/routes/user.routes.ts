import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { handleGetMe, handleUpdateMe } from '../controllers/user.controller';

const router = Router();

router.get('/me', isAuthenticated, handleGetMe);
router.patch('/me', isAuthenticated, handleUpdateMe);

export default router;
