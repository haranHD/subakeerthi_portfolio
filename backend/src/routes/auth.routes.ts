import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { loginRateLimiter } from '../middlewares/rateLimiter.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', loginRateLimiter, AuthController.login);
router.post('/logout', requireAuth, AuthController.logout);
router.get('/me', AuthController.me);

export default router;
