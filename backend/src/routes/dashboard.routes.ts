import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/overview', dashboardController.getOverview);
router.get('/sprint-health', dashboardController.getSprintHealth);
router.get('/workload', dashboardController.getWorkload);
router.get('/velocity', dashboardController.getVelocity);
router.get('/activity', dashboardController.getActivity);
router.get('/deadlines', dashboardController.getDeadlines);
router.get('/traceability', dashboardController.getTraceability);
router.get('/dod', dashboardController.getDod);

export default router;
