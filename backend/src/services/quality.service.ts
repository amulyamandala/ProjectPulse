import { Issue, TestCase, RequirementTrace } from '../models';
import { IssueSeverity, TaskStatus } from '@projectpulse/shared';
import mongoose from 'mongoose';

export const qualityService = {
  // Issues
  async createIssue(orgId: string, projectId: string, title: string, severity: IssueSeverity, description?: string, affectedVersion?: string, stepsToReproduce?: string, requirementId?: string) {
    const count = await Issue.countDocuments({ projectId });
    const key = `BUG-${count + 1}`;

    const issue = await Issue.create({
      organizationId: orgId,
      projectId,
      key,
      title,
      description,
      severity,
      affectedVersion,
      stepsToReproduce,
      status: TaskStatus.TODO
    });

    if (requirementId) {
      await RequirementTrace.create({
        sourceType: 'Requirement',
        sourceId: requirementId,
        targetType: 'Issue',
        targetId: issue._id
      });
    }

    return issue;
  },

  async updateIssueStatus(issueId: string, status: TaskStatus, assigneeId?: string) {
    const issue = await Issue.findById(issueId);
    if (!issue) throw new Error('Issue not found');

    if (status) issue.status = status;
    if (assigneeId) issue.assigneeId = new mongoose.Types.ObjectId(assigneeId);
    
    await issue.save();
    return issue;
  },

  // Test Cases
  async createTestCase(orgId: string, projectId: string, requirementId: string, title: string, steps: string, expectedResult: string, description?: string) {
    const testCase = await TestCase.create({
      organizationId: orgId,
      projectId,
      requirementId,
      title,
      description,
      steps,
      expectedResult,
      status: 'DRAFT'
    });

    return testCase;
  },

  async executeTestCase(testCaseId: string, status: 'PASSED' | 'FAILED' | 'BLOCKED', notes?: string) {
    const testCase = await TestCase.findById(testCaseId);
    if (!testCase) throw new Error('Test case not found');

    testCase.status = status;
    // Realistically, you would create a TestExecution record, but for brevity we update the status directly here
    await testCase.save();
    return testCase;
  }
};
