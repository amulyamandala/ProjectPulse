import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireOrgMembership, requirePermission } from '../middleware/rbac.middleware';
import { Permission } from '@projectpulse/shared';

import { agileController } from '../controllers/agile.controller';

const router = Router({ mergeParams: true }); // Allows accessing :orgId from parent router if needed

// Projects
router.post('/', 
  requireAuth, 
  requireOrgMembership, 
  requirePermission(Permission.PROJECT_CREATE), 
  projectController.create
);

router.get('/', 
  requireAuth, 
  requireOrgMembership, 
  requirePermission(Permission.ORG_READ), // Minimal permission to list projects in org
  projectController.list
);

// Backlog (Requirements, Epics, Stories)
router.post('/:projectId/requirements',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.ISSUE_CREATE), // Treat requirements/epics/stories as issues or similar for permission mapping
  projectController.createRequirement
);

router.post('/:projectId/epics',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.ISSUE_CREATE),
  projectController.createEpic
);

router.post('/:projectId/stories',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.TASK_CREATE), // User Story ~ Task or Issue
  projectController.createUserStory
);

router.get('/:projectId/backlog',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.PROJECT_READ),
  projectController.getBacklog
);

router.post('/:projectId/milestones',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.PROJECT_UPDATE),
  projectController.createMilestone
);

// --- Sprints ---
router.post('/:projectId/sprints',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.SPRINT_CREATE),
  agileController.createSprint
);

router.post('/:projectId/sprints/:sprintId/start',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.SPRINT_START),
  agileController.startSprint
);

router.post('/:projectId/sprints/:sprintId/complete',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.SPRINT_CLOSE),
  agileController.completeSprint
);

// --- Tasks ---
router.post('/:projectId/tasks',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.TASK_CREATE),
  agileController.createTask
);

router.patch('/:projectId/tasks/:taskId/status',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.TASK_UPDATE),
  agileController.updateTaskStatus
);

router.post('/:projectId/tasks/:taskId/assign',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.TASK_ASSIGN),
  agileController.assignTask
);

// --- Quality & Issues ---
import { qualityController } from '../controllers/quality.controller';

router.post('/:projectId/issues',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.ISSUE_CREATE),
  qualityController.createIssue
);

router.patch('/:projectId/issues/:issueId',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.ISSUE_UPDATE),
  qualityController.updateIssue
);

router.post('/:projectId/testcases',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.PROJECT_UPDATE), // Assuming project update or similar for test cases
  qualityController.createTestCase
);

router.post('/:projectId/testcases/:testCaseId/execute',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.PROJECT_UPDATE),
  qualityController.executeTestCase
);

// --- Adaptive Delivery Engine ---
import { adaptiveController } from '../controllers/adaptive.controller';

router.get('/:projectId/sprints/:sprintId/analyze',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.PROJECT_READ), // Assuming anyone who can read project can view risk analysis
  adaptiveController.analyzeSprintRisk
);

// --- Dashboard ---
import { dashboardController } from '../controllers/dashboard.controller';

router.get('/:projectId/dashboard',
  requireAuth,
  requireOrgMembership,
  requirePermission(Permission.PROJECT_READ),
  dashboardController.getProjectDashboard
);

export default router;
