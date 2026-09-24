import { requirePermission, requireOrgMembership } from './rbac.middleware';
import { OrganizationMember, ProjectMember } from '../models';
import { Role, Permission } from '@projectpulse/shared';
import mongoose from 'mongoose';

describe('RBAC Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockReq = {
      user: { _id: new mongoose.Types.ObjectId() },
      params: { orgId: new mongoose.Types.ObjectId().toString() },
      body: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe('requireOrgMembership', () => {
    it('should return 400 if no orgId is provided', async () => {
      mockReq.params = {};
      await requireOrgMembership(mockReq, mockRes, nextFunction);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Valid Organization ID is required' });
    });

    it('should return 403 if user is not a member', async () => {
      OrganizationMember.findOne = jest.fn().mockResolvedValue(null);
      await requireOrgMembership(mockReq, mockRes, nextFunction);
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it('should attach membership and call next if user is a member', async () => {
      const mockMembership = { role: Role.ORG_ADMIN };
      OrganizationMember.findOne = jest.fn().mockResolvedValue(mockMembership);
      
      await requireOrgMembership(mockReq, mockRes, nextFunction);
      
      expect(mockReq.orgMembership).toBe(mockMembership);
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('requirePermission', () => {
    it('should return 403 if user lacks permission at both org and project level', async () => {
      mockReq.orgMembership = { role: Role.STAKEHOLDER }; // Stakeholder only has READ
      
      const middleware = requirePermission(Permission.PROJECT_CREATE);
      await middleware(mockReq, mockRes, nextFunction);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it('should allow if user has org-level permission', async () => {
      mockReq.orgMembership = { role: Role.ORG_ADMIN }; // Admin has all permissions
      
      const middleware = requirePermission(Permission.PROJECT_CREATE);
      await middleware(mockReq, mockRes, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should allow if user lacks org-level permission but has project-level permission', async () => {
      // Stakeholder at org level
      mockReq.orgMembership = { role: Role.STAKEHOLDER };
      mockReq.params.projectId = new mongoose.Types.ObjectId().toString();
      
      // But acts as a PROJECT_MANAGER at the project level
      ProjectMember.findOne = jest.fn().mockResolvedValue({ role: Role.PROJECT_MANAGER });

      const middleware = requirePermission(Permission.SPRINT_CREATE);
      await middleware(mockReq, mockRes, nextFunction);
      
      expect(ProjectMember.findOne).toHaveBeenCalled();
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
