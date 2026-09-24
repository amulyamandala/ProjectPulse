import { projectService } from './project.service';
import { Project, ProjectMember } from '../models';
import mongoose from 'mongoose';

describe('Project Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a project and add the lead as a member', async () => {
      const mockOrgId = new mongoose.Types.ObjectId().toString();
      const mockUserId = new mongoose.Types.ObjectId().toString();
      const mockProject = { _id: new mongoose.Types.ObjectId(), key: 'TEST' };

      // Mock transaction methods
      const session = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      };
      jest.spyOn(mongoose, 'startSession').mockResolvedValue(session as any);

      // We chain .session(session) so we mock that too
      const findOneMock = {
        session: jest.fn().mockResolvedValue(null)
      };
      Project.findOne = jest.fn().mockReturnValue(findOneMock);
      
      Project.create = jest.fn().mockResolvedValue([mockProject]);
      ProjectMember.create = jest.fn().mockResolvedValue([{}]);

      const result = await projectService.createProject(mockOrgId, 'Test Project', 'TEST', 'Desc', mockUserId);
      
      expect(Project.create).toHaveBeenCalled();
      expect(ProjectMember.create).toHaveBeenCalled();
      expect(session.commitTransaction).toHaveBeenCalled();
      expect(result).toBe(mockProject);
    });
  });
});
