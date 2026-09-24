import { Response } from 'express';
import { projectService } from '../services/project.service';
import { backlogService } from '../services/backlog.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { z } from 'zod';
import { 
  CreateProjectSchema, 
  CreateEpicSchema, 
  CreateRequirementSchema, 
  CreateUserStorySchema 
} from '@projectpulse/shared';

export const projectController = {
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const orgId = req.params.orgId;
      const data = CreateProjectSchema.parse(req.body);
      const project = await projectService.createProject(orgId, data.name, data.key, data.description, req.user._id.toString());
      res.status(201).json(project);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation Error', details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  },

  async list(req: AuthenticatedRequest, res: Response) {
    try {
      const orgId = req.params.orgId;
      const projects = await projectService.getProjectsForOrg(orgId, req.user._id.toString());
      res.status(200).json(projects);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  },

  async createRequirement(req: AuthenticatedRequest, res: Response) {
    try {
      const { orgId, projectId } = req.params;
      const data = CreateRequirementSchema.parse(req.body);
      const reqDoc = await backlogService.createRequirement(orgId, projectId, data.title, data.description);
      res.status(201).json(reqDoc);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async createEpic(req: AuthenticatedRequest, res: Response) {
    try {
      const { orgId, projectId } = req.params;
      const data = CreateEpicSchema.parse(req.body);
      const epic = await backlogService.createEpic(orgId, projectId, data.title, data.description, data.requirementId);
      res.status(201).json(epic);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async createUserStory(req: AuthenticatedRequest, res: Response) {
    try {
      const { orgId, projectId } = req.params;
      const data = CreateUserStorySchema.parse(req.body);
      const story = await backlogService.createUserStory(
        orgId, projectId, data.title, data.description, data.epicId, data.acceptanceCriteria, data.storyPoints
      );
      res.status(201).json(story);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getBacklog(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const backlog = await backlogService.getBacklog(projectId);
      res.status(200).json(backlog);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch backlog' });
    }
  },

  async createMilestone(req: AuthenticatedRequest, res: Response) {
    try {
      const { orgId, projectId } = req.params;
      const { CreateMilestoneSchema } = await import('@projectpulse/shared');
      const data = CreateMilestoneSchema.parse(req.body);
      
      const milestone = await projectService.createMilestone(orgId, projectId, data.name, data.description, new Date(data.targetDate));
      res.status(201).json(milestone);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
