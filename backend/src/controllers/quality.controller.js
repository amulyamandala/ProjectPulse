import { qualityService } from "../services/quality.service.js";
import {
  CreateIssueSchema,
  UpdateIssueSchema,
  CreateTestCaseSchema,
  ExecuteTestCaseSchema,
} from "@projectpulse/shared";

export const qualityController = {
  // Issues
  async getIssues(req, res) {
    try {
      const { projectId } = req.params;
      const issues = await qualityService.getIssues(projectId);
      res.status(200).json(issues);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async createIssue(req, res) {
    try {
      const { orgId, projectId } = req.params;
      const { requirementId } = req.query; // optional linking
      const data = CreateIssueSchema.parse(req.body);
      const issue = await qualityService.createIssue(
        orgId,
        projectId,
        data.title,
        data.severity,
        data.description,
        data.affectedVersion,
        data.stepsToReproduce,
        requirementId,
      );
      res.status(201).json(issue);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateIssue(req, res) {
    try {
      const { issueId } = req.params;
      const data = UpdateIssueSchema.parse(req.body);
      if (!data.status && !data.assigneeId)
        throw new Error("Provide status or assigneeId to update");
      // Normally we check if req.user has permission to reassign. That is handled by middleware.
      // If we don't pass status, we need to handle that inside the service.
      const issue = await qualityService.updateIssueStatus(
        issueId,
        data.status,
        data.assigneeId,
      );
      res.status(200).json(issue);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Test Cases
  async createTestCase(req, res) {
    try {
      const { orgId, projectId } = req.params;
      const { requirementId } = req.query;
      if (!requirementId)
        throw new Error("requirementId query param is required");
      const data = CreateTestCaseSchema.parse(req.body);
      const testCase = await qualityService.createTestCase(
        orgId,
        projectId,
        requirementId,
        data.title,
        data.steps,
        data.expectedResult,
        data.description,
      );
      res.status(201).json(testCase);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async executeTestCase(req, res) {
    try {
      const { testCaseId } = req.params;
      const data = ExecuteTestCaseSchema.parse(req.body);
      const testCase = await qualityService.executeTestCase(
        testCaseId,
        data.status,
        data.notes,
      );
      res.status(200).json(testCase);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
