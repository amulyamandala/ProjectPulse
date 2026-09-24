import { Router } from 'express';
import { organizationController } from '../controllers/organization.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireOrgMembership, requirePermission } from '../middleware/rbac.middleware';
import { Permission } from '@projectpulse/shared';
import projectRoutes from './project.routes';

const router = Router();

// Requires only authentication
router.post('/', requireAuth, organizationController.create);
router.get('/', requireAuth, organizationController.listMine);

// Requires organization membership and specific permissions
router.post('/:orgId/members', 
  requireAuth, 
  requireOrgMembership, 
  requirePermission(Permission.MEMBER_INVITE), 
  organizationController.invite
);

// Mount project routes under organization
router.use('/:orgId/projects', projectRoutes);

export default router;
