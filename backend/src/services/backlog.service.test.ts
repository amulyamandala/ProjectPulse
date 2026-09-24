import { backlogService } from './backlog.service';
import { Epic, Requirement, UserStory, RequirementTrace } from '../models';
import mongoose from 'mongoose';

describe('Backlog Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an epic and trace if requirementId is provided', async () => {
    const orgId = new mongoose.Types.ObjectId().toString();
    const projectId = new mongoose.Types.ObjectId().toString();
    const reqId = new mongoose.Types.ObjectId().toString();
    const mockEpic = { _id: new mongoose.Types.ObjectId(), title: 'Epic 1' };

    Epic.create = jest.fn().mockResolvedValue(mockEpic);
    RequirementTrace.create = jest.fn().mockResolvedValue({});

    const result = await backlogService.createEpic(orgId, projectId, 'Epic 1', 'Desc', reqId);
    
    expect(Epic.create).toHaveBeenCalled();
    expect(RequirementTrace.create).toHaveBeenCalledWith({
      sourceType: 'Requirement',
      sourceId: reqId,
      targetType: 'Epic',
      targetId: mockEpic._id
    });
    expect(result).toBe(mockEpic);
  });

  it('should create a story and trace if epicId is provided', async () => {
    const orgId = new mongoose.Types.ObjectId().toString();
    const projectId = new mongoose.Types.ObjectId().toString();
    const epicId = new mongoose.Types.ObjectId().toString();
    const mockStory = { _id: new mongoose.Types.ObjectId(), title: 'Story 1' };

    UserStory.create = jest.fn().mockResolvedValue(mockStory);
    RequirementTrace.create = jest.fn().mockResolvedValue({});

    const result = await backlogService.createUserStory(orgId, projectId, 'Story 1', 'Desc', epicId);
    
    expect(UserStory.create).toHaveBeenCalled();
    expect(RequirementTrace.create).toHaveBeenCalledWith({
      sourceType: 'Epic',
      sourceId: epicId,
      targetType: 'UserStory',
      targetId: mockStory._id
    });
    expect(result).toBe(mockStory);
  });
});
