import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Get the personalized dashboard for the authenticated user
router.get('/me', requireAuth, dashboardController.getUserDashboard);

export default router;
