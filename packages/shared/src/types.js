export let Role = /*#__PURE__*/ (function (Role) {
  Role["ORG_ADMIN"] = "ORG_ADMIN";
  Role["PROJECT_MANAGER"] = "PROJECT_MANAGER";
  Role["TEAM_LEAD"] = "TEAM_LEAD";
  Role["DEVELOPER"] = "DEVELOPER";
  Role["STAKEHOLDER"] = "STAKEHOLDER";
  return Role;
})({});

export let TaskStatus = /*#__PURE__*/ (function (TaskStatus) {
  TaskStatus["BACKLOG"] = "BACKLOG";
  TaskStatus["TODO"] = "TODO";
  TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
  TaskStatus["IN_REVIEW"] = "IN_REVIEW";
  TaskStatus["TESTING"] = "TESTING";
  TaskStatus["DONE"] = "DONE";
  return TaskStatus;
})({});

export let Priority = /*#__PURE__*/ (function (Priority) {
  Priority["URGENT"] = "URGENT";
  Priority["HIGH"] = "HIGH";
  Priority["MEDIUM"] = "MEDIUM";
  Priority["LOW"] = "LOW";
  return Priority;
})({});

export let IssueSeverity = /*#__PURE__*/ (function (IssueSeverity) {
  IssueSeverity["CRITICAL"] = "CRITICAL";
  IssueSeverity["HIGH"] = "HIGH";
  IssueSeverity["MEDIUM"] = "MEDIUM";
  IssueSeverity["LOW"] = "LOW";
  return IssueSeverity;
})({});

export let SprintStatus = /*#__PURE__*/ (function (SprintStatus) {
  SprintStatus["PLANNED"] = "PLANNED";
  SprintStatus["ACTIVE"] = "ACTIVE";
  SprintStatus["CLOSED"] = "CLOSED";
  return SprintStatus;
})({});

export let DependencyType = /*#__PURE__*/ (function (DependencyType) {
  DependencyType["BLOCKS"] = "BLOCKS";
  DependencyType["BLOCKED_BY"] = "BLOCKED_BY";
  DependencyType["RELATES_TO"] = "RELATES_TO";
  return DependencyType;
})({});

export let ActivityAction = /*#__PURE__*/ (function (ActivityAction) {
  ActivityAction["CREATED"] = "CREATED";
  ActivityAction["UPDATED"] = "UPDATED";
  ActivityAction["DELETED"] = "DELETED";
  ActivityAction["ASSIGNED"] = "ASSIGNED";
  ActivityAction["STATUS_CHANGED"] = "STATUS_CHANGED";
  ActivityAction["COMMENTED"] = "COMMENTED";
  ActivityAction["SPRINT_STARTED"] = "SPRINT_STARTED";
  ActivityAction["SPRINT_CLOSED"] = "SPRINT_CLOSED";
  ActivityAction["DOD_OVERRIDDEN"] = "DOD_OVERRIDDEN";
  return ActivityAction;
})({});

export let Permission = /*#__PURE__*/ (function (Permission) {
  // Organization
  Permission["ORG_READ"] = "organization.read";
  Permission["ORG_UPDATE"] = "organization.update";
  Permission["ORG_DELETE"] = "organization.delete";
  Permission["MEMBER_INVITE"] = "member.invite";
  Permission["MEMBER_REMOVE"] = "member.remove";

  // Project
  Permission["PROJECT_READ"] = "project.read";
  Permission["PROJECT_CREATE"] = "project.create";
  Permission["PROJECT_UPDATE"] = "project.update";
  Permission["PROJECT_DELETE"] = "project.delete";
  Permission["PROJECT_MANAGE_MEMBERS"] = "project.manage_members";

  // Sprint
  Permission["SPRINT_CREATE"] = "sprint.create";
  Permission["SPRINT_UPDATE"] = "sprint.update";
  Permission["SPRINT_START"] = "sprint.start";
  Permission["SPRINT_CLOSE"] = "sprint.close";

  // Task
  Permission["TASK_CREATE"] = "task.create";
  Permission["TASK_UPDATE"] = "task.update";
  Permission["TASK_DELETE"] = "task.delete";
  Permission["TASK_ASSIGN"] = "task.assign";
  Permission["TASK_MOVE"] = "task.move";

  // Issue
  Permission["ISSUE_CREATE"] = "issue.create";
  Permission["ISSUE_UPDATE"] = "issue.update";
  Permission["ISSUE_RESOLVE"] = "issue.resolve";
  return Permission;
})({});

export const RolePermissions = {
  [Role.ORG_ADMIN]: Object.values(Permission),
  [Role.PROJECT_MANAGER]: [
    Permission.ORG_READ,
    Permission.PROJECT_READ,
    Permission.PROJECT_CREATE,
    Permission.PROJECT_UPDATE,
    Permission.PROJECT_DELETE,
    Permission.PROJECT_MANAGE_MEMBERS,
    Permission.SPRINT_CREATE,
    Permission.SPRINT_UPDATE,
    Permission.SPRINT_START,
    Permission.SPRINT_CLOSE,
    Permission.TASK_CREATE,
    Permission.TASK_UPDATE,
    Permission.TASK_DELETE,
    Permission.TASK_ASSIGN,
    Permission.TASK_MOVE,
    Permission.ISSUE_CREATE,
    Permission.ISSUE_UPDATE,
    Permission.ISSUE_RESOLVE,
  ],
  [Role.TEAM_LEAD]: [
    Permission.ORG_READ,
    Permission.PROJECT_READ,
    Permission.SPRINT_CREATE,
    Permission.SPRINT_UPDATE,
    Permission.SPRINT_START,
    Permission.SPRINT_CLOSE,
    Permission.TASK_CREATE,
    Permission.TASK_UPDATE,
    Permission.TASK_DELETE,
    Permission.TASK_ASSIGN,
    Permission.TASK_MOVE,
    Permission.ISSUE_CREATE,
    Permission.ISSUE_UPDATE,
    Permission.ISSUE_RESOLVE,
  ],
  [Role.DEVELOPER]: [
    Permission.ORG_READ,
    Permission.PROJECT_READ,
    Permission.TASK_CREATE,
    Permission.TASK_UPDATE,
    Permission.TASK_ASSIGN,
    Permission.TASK_MOVE,
    Permission.ISSUE_CREATE,
    Permission.ISSUE_UPDATE,
    Permission.ISSUE_RESOLVE,
  ],
  [Role.STAKEHOLDER]: [Permission.ORG_READ, Permission.PROJECT_READ],
};
