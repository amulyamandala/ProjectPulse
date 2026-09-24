import { Response } from 'express';
import { adaptiveService } from '../services/adaptive.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const adaptiveController = {
  async analyzeSprintRisk(req: AuthenticatedRequest, res: Response) {
    try {
      const { sprintId } = req.params;
      const analysis = await adaptiveService.analyzeSprintRisk(sprintId);
      res.status(200).json(analysis);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
