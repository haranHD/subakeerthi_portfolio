import { Router } from 'express';
import { PublicController } from '../controllers/public.controller.js';
import { enquiryRateLimiter, publicApiRateLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.use(publicApiRateLimiter);

router.get('/profile', PublicController.getProfile);
router.get('/services', PublicController.getServices);
router.get('/programmes', PublicController.getProgrammes);
router.get('/credentials', PublicController.getCredentials);
router.get('/audiences', PublicController.getAudiences);
router.get('/site-settings', PublicController.getSiteSettings);
router.get('/media', PublicController.getMediaList);

router.post('/enquiries', enquiryRateLimiter, PublicController.createEnquiry);

export default router;
