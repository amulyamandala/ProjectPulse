import { Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const dashboardController = {
  async getProjectDashboard(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const data = await dashboardService.getProjectDashboard(projectId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getUserDashboard(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const data = await dashboardService.getUserDashboard(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
