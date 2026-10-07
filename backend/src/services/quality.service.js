import { Issue, TestCase, RequirementTrace } from "../models/index.js";
import { TaskStatus } from "@projectpulse/shared";
import mongoose from "mongoose";

export const qualityService = {
  // Issues
  async getIssues(projectId) {
    return Issue.find({ projectId }).sort({ createdAt: -1 });
  },

  async createIssue(
    orgId,
    projectId,
    title,
    severity,
    description,
    affectedVersion,
    stepsToReproduce,
    requirementId,
  ) {
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
      status: TaskStatus.TODO,
    });

    if (requirementId) {
      await RequirementTrace.create({
        sourceType: "Requirement",
        sourceId: requirementId,
        targetType: "Issue",
        targetId: issue._id,
      });
    }

    return issue;
  },

  async updateIssueStatus(issueId, status, assigneeId) {
    const issue = await Issue.findById(issueId);
    if (!issue) throw new Error("Issue not found");

    if (status) issue.status = status;
    if (assigneeId) issue.assigneeId = new mongoose.Types.ObjectId(assigneeId);
    await issue.save();
    return issue;
  },

  // Test Cases
  async createTestCase(
    orgId,
    projectId,
    requirementId,
    title,
    steps,
    expectedResult,
    description,
  ) {
    const testCase = await TestCase.create({
      organizationId: orgId,
      projectId,
      requirementId,
      title,
      description,
      steps,
      expectedResult,
      status: "DRAFT",
    });

    return testCase;
  },

  async executeTestCase(testCaseId, status, notes) {
    const testCase = await TestCase.findById(testCaseId);
    if (!testCase) throw new Error("Test case not found");

    testCase.status = status;
    // Realistically, you would create a TestExecution record, but for brevity we update the status directly here
    await testCase.save();
    return testCase;
  },
};
