import { Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

export const dashboardController = {
  async getOverview(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId, organizationId } = req.query;
      const data = await dashboardService.getOverview(
        projectId as string, 
        organizationId as string,
        req.user.id
      );
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getSprintHealth(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.query;
      if (!projectId) throw new Error('projectId is required');
      const data = await dashboardService.getSprintHealth(projectId as string);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getWorkload(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.query;
      if (!projectId) throw new Error('projectId is required');
      const data = await dashboardService.getWorkload(projectId as string);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getVelocity(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.query;
      if (!projectId) throw new Error('projectId is required');
      const data = await dashboardService.getVelocity(projectId as string);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getActivity(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId, organizationId } = req.query;
      const data = await dashboardService.getActivity(projectId as string, organizationId as string);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getDeadlines(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId, organizationId } = req.query;
      const data = await dashboardService.getDeadlines(projectId as string, organizationId as string, req.user.id);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getTraceability(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.query;
      if (!projectId) throw new Error('projectId is required');
      const data = await dashboardService.getTraceability(projectId as string);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getDod(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.query;
      if (!projectId) throw new Error('projectId is required');
      const data = await dashboardService.getDod(projectId as string);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
