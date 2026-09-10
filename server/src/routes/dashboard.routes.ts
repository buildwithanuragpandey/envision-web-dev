import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authenticate, requireAdmin, requireLeadOrAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/admin', requireAdmin, DashboardController.getAdminDashboard);
router.get('/lead', requireLeadOrAdmin, DashboardController.getProjectLeadDashboard);
router.get('/member', DashboardController.getMemberDashboard);

export default router;
