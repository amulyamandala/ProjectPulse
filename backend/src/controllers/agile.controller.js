import { agileService } from "../services/agile.service.js";
import {
  CreateSprintSchema,
  CreateTaskSchema,
  UpdateTaskStatusSchema,
} from "@projectpulse/shared";

export const agileController = {
  // Sprints
  async createSprint(req, res) {
    try {
      const { orgId, projectId } = req.params;
      const data = CreateSprintSchema.parse(req.body);
      const sprint = await agileService.createSprint(
        orgId,
        projectId,
        data.name,
        data.goal,
        new Date(data.startDate),
        new Date(data.endDate),
      );
      res.status(201).json(sprint);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async startSprint(req, res) {
    try {
      const { sprintId } = req.params;
      const sprint = await agileService.startSprint(sprintId);
      res.status(200).json(sprint);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async completeSprint(req, res) {
    try {
      const { sprintId } = req.params;
      const sprint = await agileService.completeSprint(sprintId);
      res.status(200).json(sprint);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getBoard(req, res) {
    try {
      const { projectId } = req.params;
      const board = await agileService.getActiveBoard(projectId);
      res.status(200).json(board);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Tasks
  async createTask(req, res) {
    try {
      const { orgId, projectId } = req.params;
      const data = CreateTaskSchema.parse(req.body);
      const task = await agileService.createTask(
        orgId,
        projectId,
        data.title,
        data.description,
        data.priority,
        data.storyPoints,
        data.userStoryId,
        data.sprintId,
      );
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateTaskStatus(req, res) {
    try {
      const { taskId } = req.params;
      const data = UpdateTaskStatusSchema.parse(req.body);
      const task = await agileService.updateTaskStatus(
        taskId,
        data.status,
        req.user._id.toString(),
      );
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async assignTask(req, res) {
    try {
      const { taskId } = req.params;
      const { assigneeId } = req.body;
      if (!assigneeId) throw new Error("assigneeId is required");
      const task = await agileService.assignTask(taskId, assigneeId);
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
