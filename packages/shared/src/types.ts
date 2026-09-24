export enum Role {
  ORG_ADMIN = 'ORG_ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  TEAM_LEAD = 'TEAM_LEAD',
  DEVELOPER = 'DEVELOPER',
  STAKEHOLDER = 'STAKEHOLDER'
}

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  TESTING = 'TESTING',
  DONE = 'DONE'
}

export enum Priority {
  URGENT = 'URGENT',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum IssueSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum SprintStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED'
}

export enum DependencyType {
  BLOCKS = 'BLOCKS',
  BLOCKED_BY = 'BLOCKED_BY',
  RELATES_TO = 'RELATES_TO'
}

export enum ActivityAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  ASSIGNED = 'ASSIGNED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  COMMENTED = 'COMMENTED',
  SPRINT_STARTED = 'SPRINT_STARTED',
  SPRINT_CLOSED = 'SPRINT_CLOSED',
  DOD_OVERRIDDEN = 'DOD_OVERRIDDEN'
}

export enum Permission {
  // Organization
  ORG_READ = 'organization.read',
  ORG_UPDATE = 'organization.update',
  ORG_DELETE = 'organization.delete',
  MEMBER_INVITE = 'member.invite',
  MEMBER_REMOVE = 'member.remove',

  // Project
  PROJECT_READ = 'project.read',
  PROJECT_CREATE = 'project.create',
  PROJECT_UPDATE = 'project.update',
  PROJECT_DELETE = 'project.delete',
  PROJECT_MANAGE_MEMBERS = 'project.manage_members',

  // Sprint
  SPRINT_CREATE = 'sprint.create',
  SPRINT_UPDATE = 'sprint.update',
  SPRINT_START = 'sprint.start',
  SPRINT_CLOSE = 'sprint.close',

  // Task
  TASK_CREATE = 'task.create',
  TASK_UPDATE = 'task.update',
  TASK_DELETE = 'task.delete',
  TASK_ASSIGN = 'task.assign',
  TASK_MOVE = 'task.move',

  // Issue
  ISSUE_CREATE = 'issue.create',
  ISSUE_UPDATE = 'issue.update',
  ISSUE_RESOLVE = 'issue.resolve',
}

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.ORG_ADMIN]: Object.values(Permission),
  [Role.PROJECT_MANAGER]: [
    Permission.ORG_READ,
    Permission.PROJECT_READ, Permission.PROJECT_CREATE, Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE, Permission.PROJECT_MANAGE_MEMBERS,
    Permission.SPRINT_CREATE, Permission.SPRINT_UPDATE, Permission.SPRINT_START, Permission.SPRINT_CLOSE,
    Permission.TASK_CREATE, Permission.TASK_UPDATE, Permission.TASK_DELETE, Permission.TASK_ASSIGN, Permission.TASK_MOVE,
    Permission.ISSUE_CREATE, Permission.ISSUE_UPDATE, Permission.ISSUE_RESOLVE
  ],
  [Role.TEAM_LEAD]: [
    Permission.ORG_READ, Permission.PROJECT_READ,
    Permission.SPRINT_CREATE, Permission.SPRINT_UPDATE, Permission.SPRINT_START, Permission.SPRINT_CLOSE,
    Permission.TASK_CREATE, Permission.TASK_UPDATE, Permission.TASK_DELETE, Permission.TASK_ASSIGN, Permission.TASK_MOVE,
    Permission.ISSUE_CREATE, Permission.ISSUE_UPDATE, Permission.ISSUE_RESOLVE
  ],
  [Role.DEVELOPER]: [
    Permission.ORG_READ, Permission.PROJECT_READ,
    Permission.TASK_CREATE, Permission.TASK_UPDATE, Permission.TASK_ASSIGN, Permission.TASK_MOVE,
    Permission.ISSUE_CREATE, Permission.ISSUE_UPDATE, Permission.ISSUE_RESOLVE
  ],
  [Role.STAKEHOLDER]: [
    Permission.ORG_READ, Permission.PROJECT_READ
  ]
};
