import { Requirement, Epic, UserStory, RequirementTrace } from '../models';
import mongoose from 'mongoose';

export const backlogService = {
  async createRequirement(orgId: string, projectId: string, title: string, description?: string) {
    const count = await Requirement.countDocuments({ projectId });
    const key = `REQ-${count + 1}`;
    
    return Requirement.create({
      organizationId: orgId,
      projectId,
      key,
      title,
      description
    });
  },

  async createEpic(orgId: string, projectId: string, title: string, description?: string, requirementId?: string) {
    const epic = await Epic.create({
      organizationId: orgId,
      projectId,
      requirementId,
      title,
      description
    });

    if (requirementId) {
      await RequirementTrace.create({
        sourceType: 'Requirement',
        sourceId: requirementId,
        targetType: 'Epic',
        targetId: epic._id
      });
    }

    return epic;
  },

  async createUserStory(orgId: string, projectId: string, title: string, description?: string, epicId?: string, acceptanceCriteria?: string, storyPoints?: number) {
    const story = await UserStory.create({
      organizationId: orgId,
      projectId,
      epicId,
      title,
      description,
      acceptanceCriteria,
      storyPoints
    });

    if (epicId) {
      await RequirementTrace.create({
        sourceType: 'Epic',
        sourceId: epicId,
        targetType: 'UserStory',
        targetId: story._id
      });
    }

    return story;
  },
  
  async getBacklog(projectId: string) {
    const epics = await Epic.find({ projectId });
    const stories = await UserStory.find({ projectId });
    const requirements = await Requirement.find({ projectId });
    
    return { requirements, epics, stories };
  }
};
