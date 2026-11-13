import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { uploadMedia } from '../middlewares/upload.middleware.js';

const router = Router();

// Protect all admin routes
router.use(requireAuth);

// Dashboard
router.get('/dashboard', AdminController.getDashboardMetrics);

// Profile
router.get('/profile', AdminController.getProfile);
router.put('/profile', AdminController.updateProfile);

// Services
router.get('/services', AdminController.getServices);
router.post('/services', AdminController.createService);
router.put('/services/:id', AdminController.updateService);
router.delete('/services/:id', AdminController.deleteService);

// Programmes
router.get('/programmes', AdminController.getProgrammes);
router.post('/programmes', AdminController.createProgramme);
router.put('/programmes/:id', AdminController.updateProgramme);
router.delete('/programmes/:id', AdminController.deleteProgramme);

// Credentials
router.get('/credentials', AdminController.getCredentials);
router.post('/credentials', AdminController.createCredential);
router.put('/credentials/:id', AdminController.updateCredential);
router.delete('/credentials/:id', AdminController.deleteCredential);

// Audiences
router.get('/audiences', AdminController.getAudiences);
router.post('/audiences', AdminController.createAudience);
router.put('/audiences/:id', AdminController.updateAudience);
router.delete('/audiences/:id', AdminController.deleteAudience);

// Enquiries
router.get('/enquiries', AdminController.getEnquiries);
router.get('/enquiries/:id', AdminController.getEnquiryById);
router.put('/enquiries/:id/status', AdminController.updateEnquiryStatus);

// Media
router.get('/media', AdminController.getMediaList);
router.post('/media', uploadMedia.single('file'), AdminController.uploadMedia);
router.put('/media/:id', AdminController.updateMedia);
router.delete('/media/:id', AdminController.deleteMedia);

// Settings
router.get('/settings', AdminController.getSettings);
router.put('/settings', AdminController.updateSetting);

// Audit Logs
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
