import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { OrganizationMember, ProjectMember } from '../models';
import { RolePermissions, Permission } from '@projectpulse/shared';
import mongoose from 'mongoose';

export const requireOrgMembership = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const orgId = req.params.orgId || req.body.organizationId || req.query.orgId;
    
    if (!orgId || !mongoose.Types.ObjectId.isValid(orgId)) {
      return res.status(400).json({ error: 'Valid Organization ID is required' });
    }

    const membership = await OrganizationMember.findOne({
      organizationId: orgId,
      userId: req.user._id
    });

    if (!membership) {
      return res.status(403).json({ error: 'Forbidden: You do not belong to this organization' });
    }

    // Attach membership to request for later use
    (req as any).orgMembership = membership;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const requirePermission = (requiredPermission: Permission) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // 1. Check org-level permission
      const orgMembership = (req as any).orgMembership;
      
      if (!orgMembership) {
        // Fallback: fetch if not attached
        return res.status(500).json({ error: 'Internal: orgMembership not found. Use requireOrgMembership first.' });
      }

      const orgPermissions = RolePermissions[orgMembership.role as keyof typeof RolePermissions] || [];
      
      if (orgPermissions.includes(requiredPermission)) {
        return next();
      }

      // 2. If not covered by org role, check project-level permission (if project context exists)
      const projectId = req.params.projectId || req.body.projectId || req.query.projectId;
      
      if (projectId && mongoose.Types.ObjectId.isValid(projectId as string)) {
        const projMembership = await ProjectMember.findOne({
          projectId,
          userId: req.user._id
        });

        if (projMembership) {
          const projPermissions = RolePermissions[projMembership.role as keyof typeof RolePermissions] || [];
          if (projPermissions.includes(requiredPermission)) {
            return next();
          }
        }
      }

      return res.status(403).json({ error: `Forbidden: Missing permission ${requiredPermission}` });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};
