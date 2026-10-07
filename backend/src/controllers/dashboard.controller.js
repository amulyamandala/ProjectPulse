import { dashboardService } from "../services/dashboard.service.js";

export const dashboardController = {
  async getOverview(req, res) {
    try {
      const { projectId, organizationId } = req.query;
      const data = await dashboardService.getOverview(
        projectId,
        organizationId,
        req.user.id,
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getSprintHealth(req, res) {
    try {
      const { projectId } = req.query;
      if (!projectId) throw new Error("projectId is required");
      const data = await dashboardService.getSprintHealth(projectId);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getWorkload(req, res) {
    try {
      const { projectId } = req.query;
      if (!projectId) throw new Error("projectId is required");
      const data = await dashboardService.getWorkload(projectId);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getVelocity(req, res) {
    try {
      const { projectId } = req.query;
      if (!projectId) throw new Error("projectId is required");
      const data = await dashboardService.getVelocity(projectId);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getActivity(req, res) {
    try {
      const { projectId, organizationId } = req.query;
      const data = await dashboardService.getActivity(
        projectId,
        organizationId,
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getDeadlines(req, res) {
    try {
      const { projectId, organizationId } = req.query;
      const data = await dashboardService.getDeadlines(
        projectId,
        organizationId,
        req.user.id,
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getTraceability(req, res) {
    try {
      const { projectId } = req.query;
      if (!projectId) throw new Error("projectId is required");
      const data = await dashboardService.getTraceability(projectId);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getDod(req, res) {
    try {
      const { projectId } = req.query;
      if (!projectId) throw new Error("projectId is required");
      const data = await dashboardService.getDod(projectId);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
