import { adaptiveService } from "../services/adaptive.service.js";

export const adaptiveController = {
  async analyzeSprintRisk(req, res) {
    try {
      const { sprintId } = req.params;
      const analysis = await adaptiveService.analyzeSprintRisk(sprintId);
      res.status(200).json(analysis);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
