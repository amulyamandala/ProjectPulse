import { Response } from 'express';
import { qualityService } from '../services/quality.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { z } from 'zod';
import { 
  CreateIssueSchema, 
  UpdateIssueSchema,
  CreateTestCaseSchema,
  ExecuteTestCaseSchema
} from '@projectpulse/shared';

export const qualityController = {
  // Issues
  async createIssue(req: AuthenticatedRequest, res: Response) {
    try {
      const { orgId, projectId } = req.params;
      const { requirementId } = req.query; // optional linking
      const data = CreateIssueSchema.parse(req.body);
      
      const issue = await qualityService.createIssue(
        orgId, projectId, data.title, data.severity, data.description, data.affectedVersion, data.stepsToReproduce, requirementId as string
      );
      res.status(201).json(issue);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateIssue(req: AuthenticatedRequest, res: Response) {
    try {
      const { issueId } = req.params;
      const data = UpdateIssueSchema.parse(req.body);
      
      if (!data.status && !data.assigneeId) throw new Error('Provide status or assigneeId to update');
      
      // Normally we check if req.user has permission to reassign. That is handled by middleware.
      // If we don't pass status, we need to handle that inside the service.
      const issue = await qualityService.updateIssueStatus(issueId, data.status as any, data.assigneeId);
      res.status(200).json(issue);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  // Test Cases
  async createTestCase(req: AuthenticatedRequest, res: Response) {
    try {
      const { orgId, projectId } = req.params;
      const { requirementId } = req.query;
      
      if (!requirementId) throw new Error('requirementId query param is required');
      
      const data = CreateTestCaseSchema.parse(req.body);
      const testCase = await qualityService.createTestCase(
        orgId, projectId, requirementId as string, data.title, data.steps, data.expectedResult, data.description
      );
      res.status(201).json(testCase);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async executeTestCase(req: AuthenticatedRequest, res: Response) {
    try {
      const { testCaseId } = req.params;
      const data = ExecuteTestCaseSchema.parse(req.body);
      
      const testCase = await qualityService.executeTestCase(testCaseId, data.status, data.notes);
      res.status(200).json(testCase);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
