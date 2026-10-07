import { projectService } from "../services/project.service.js";
import { backlogService } from "../services/backlog.service.js";
import { z } from "zod";
import {
  CreateProjectSchema,
  CreateEpicSchema,
  CreateRequirementSchema,
  CreateUserStorySchema,
} from "@projectpulse/shared";

export const projectController = {
  async create(req, res) {
    try {
      const orgId = req.params.orgId;
      const data = CreateProjectSchema.parse(req.body);
      const project = await projectService.createProject(
        orgId,
        data.name,
        data.key,
        data.description,
        req.user._id.toString(),
      );
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Validation Error", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  },

  async list(req, res) {
    try {
      const orgId = req.params.orgId;
      const projects = await projectService.getProjectsForOrg(
        orgId,
        req.user._id.toString(),
      );
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  },

  async createRequirement(req, res) {
    try {
      const { orgId, projectId } = req.params;
      const data = CreateRequirementSchema.parse(req.body);
      const reqDoc = await backlogService.createRequirement(
        orgId,
        projectId,
        data.title,
        data.description,
      );
      res.status(201).json(reqDoc);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async createEpic(req, res) {
    try {
      const { orgId, projectId } = req.params;
      const data = CreateEpicSchema.parse(req.body);
      const epic = await backlogService.createEpic(
        orgId,
        projectId,
        data.title,
        data.description,
        data.requirementId,
      );
      res.status(201).json(epic);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async createUserStory(req, res) {
    try {
      const { orgId, projectId } = req.params;
      const data = CreateUserStorySchema.parse(req.body);
      const story = await backlogService.createUserStory(
        orgId,
        projectId,
        data.title,
        data.description,
        data.epicId,
        data.acceptanceCriteria,
        data.storyPoints,
      );
      res.status(201).json(story);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getBacklog(req, res) {
    try {
      const { projectId } = req.params;
      const backlog = await backlogService.getBacklog(projectId);
      res.status(200).json(backlog);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch backlog" });
    }
  },

  async createMilestone(req, res) {
    try {
      const { orgId, projectId } = req.params;
      const { CreateMilestoneSchema } = await import("@projectpulse/shared");
      const data = CreateMilestoneSchema.parse(req.body);
      const milestone = await projectService.createMilestone(
        orgId,
        projectId,
        data.name,
        data.description,
        new Date(data.targetDate),
      );
      res.status(201).json(milestone);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getMilestones(req, res) {
    try {
      const { projectId } = req.params;
      const milestones = await projectService.getMilestones(projectId);
      res.status(200).json(milestones);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch milestones" });
    }
  },
};
