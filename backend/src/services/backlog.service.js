import { Requirement, Epic, UserStory, RequirementTrace } from "../models/index.js";

export const backlogService = {
  async createRequirement(orgId, projectId, title, description) {
    const count = await Requirement.countDocuments({ projectId });
    const key = `REQ-${count + 1}`;
    return Requirement.create({
      organizationId: orgId,
      projectId,
      key,
      title,
      description,
    });
  },

  async createEpic(orgId, projectId, title, description, requirementId) {
    const epic = await Epic.create({
      organizationId: orgId,
      projectId,
      requirementId,
      title,
      description,
    });

    if (requirementId) {
      await RequirementTrace.create({
        sourceType: "Requirement",
        sourceId: requirementId,
        targetType: "Epic",
        targetId: epic._id,
      });
    }

    return epic;
  },

  async createUserStory(
    orgId,
    projectId,
    title,
    description,
    epicId,
    acceptanceCriteria,
    storyPoints,
  ) {
    const story = await UserStory.create({
      organizationId: orgId,
      projectId,
      epicId,
      title,
      description,
      acceptanceCriteria,
      storyPoints,
    });

    if (epicId) {
      await RequirementTrace.create({
        sourceType: "Epic",
        sourceId: epicId,
        targetType: "UserStory",
        targetId: story._id,
      });
    }

    return story;
  },
  async getBacklog(projectId) {
    const epics = await Epic.find({ projectId });
    const stories = await UserStory.find({ projectId });
    const requirements = await Requirement.find({ projectId });
    return { requirements, epics, stories };
  },
};
