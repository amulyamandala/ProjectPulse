import { Project, Sprint, Task, Issue, ActivityLog, Requirement, UserStory, DefinitionOfDone, Milestone, TeamMember, User, ProjectMember, TaskDependency } from '../models';
import { SprintStatus, TaskStatus, Priority, DependencyType } from '@projectpulse/shared';
import mongoose from 'mongoose';

export const dashboardService = {
  async getOverview(projectId?: string, organizationId?: string, userId?: string) {
    const query: any = {};
    if (projectId) query.projectId = projectId;
    
    const activeSprints = await Sprint.countDocuments({ ...query, status: SprintStatus.ACTIVE });
    
    const tasks = await Task.find({ ...query, status: { $ne: TaskStatus.DONE } });
    const openTasks = tasks.length;
    const blockedTasks = await TaskDependency.countDocuments({ targetTaskId: { $in: tasks.map(t => t._id) }, type: DependencyType.BLOCKS });

    const openIssues = await Issue.countDocuments({ ...query, status: { $ne: TaskStatus.DONE } });

    let completedThisSprint = 0;
    if (projectId) {
      const activeSprintObj = await Sprint.findOne({ projectId, status: SprintStatus.ACTIVE });
      if (activeSprintObj) {
        completedThisSprint = await Task.countDocuments({ sprintId: activeSprintObj._id, status: TaskStatus.DONE });
      }
    }

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingDeadlines = await Task.countDocuments({ ...query, dueDate: { $lte: nextWeek, $gte: new Date() }, status: { $ne: TaskStatus.DONE } });

    return {
      activeSprints,
      openTasks,
      blockedTasks,
      openIssues,
      completedThisSprint,
      upcomingDeadlines
    };
  },

  async getSprintHealth(projectId: string) {
    const activeSprint = await Sprint.findOne({ projectId, status: SprintStatus.ACTIVE });
    if (!activeSprint) return null;

    const tasks = await Task.find({ sprintId: activeSprint._id });
    const totalPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
    const completedPoints = tasks.filter(t => t.status === TaskStatus.DONE).reduce((sum, t) => sum + (t.storyPoints || 0), 0);
    
    const startDate = activeSprint.startDate || new Date();
    const endDate = activeSprint.endDate || new Date(new Date().getTime() + 86400000 * 14);

    const tasksAddedAfterStart = tasks.filter(t => (t.createdAt as any) > startDate);
    const scopeChange = tasksAddedAfterStart.reduce((sum, t) => sum + (t.storyPoints || 0), 0);

    const blocked = await TaskDependency.countDocuments({ targetTaskId: { $in: tasks.map(t => t._id) }, type: DependencyType.BLOCKS });
    const remainingPoints = totalPoints - completedPoints;

    let status = 'HEALTHY';
    let reasons: string[] = [];
    
    const timeRatio = (new Date().getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime());
    const progressRatio = totalPoints > 0 ? completedPoints / totalPoints : 0;

    if (blocked > 0) {
      status = 'AT RISK';
      reasons.push(`${blocked} tasks are blocked`);
    }
    if (scopeChange > totalPoints * 0.2) {
      status = status === 'HEALTHY' ? 'WATCH' : status;
      reasons.push(`Significant scope creep (+${scopeChange} pts)`);
    }
    if (timeRatio > 0.8 && progressRatio < 0.5) {
      status = 'CRITICAL';
      reasons.push(`Remaining workload is too high for remaining time`);
    }

    if (reasons.length === 0) reasons.push("Sprint is progressing as planned");

    return {
      sprint: activeSprint,
      plannedPoints: totalPoints - scopeChange,
      completedPoints,
      remainingPoints,
      scopeChange,
      blockedTasks: blocked,
      status,
      reasons
    };
  },

  async getWorkload(projectId: string) {
    const project = await Project.findById(projectId);
    if (!project) return [];

    const members = await ProjectMember.find({ projectId }).populate('userId', 'firstName lastName avatarUrl email');
    const activeSprint = await Sprint.findOne({ projectId, status: SprintStatus.ACTIVE });
    
    let tasks: any[] = [];
    if (activeSprint) {
      tasks = await Task.find({ sprintId: activeSprint._id });
    }

    return members.map((member: any) => {
      const userTasks = tasks.filter(t => t.assigneeId?.toString() === member.userId._id.toString());
      const assigned = userTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
      const completed = userTasks.filter(t => t.status === TaskStatus.DONE).reduce((sum, t) => sum + (t.storyPoints || 0), 0);
      
      const capacity = member.weeklyCapacity || 20; 
      const workloadPct = capacity > 0 ? (assigned / capacity) * 100 : 0;

      let status = 'Healthy';
      if (workloadPct > 110) status = 'Overloaded';
      else if (workloadPct < 50) status = 'Under Capacity';
      else if (workloadPct >= 90) status = 'Near Capacity';

      return {
        user: member.userId,
        assignedPoints: assigned,
        completedPoints: completed,
        remainingPoints: assigned - completed,
        capacity,
        workloadPercentage: workloadPct,
        status
      };
    });
  },

  async getVelocity(projectId: string) {
    const completedSprints = await Sprint.find({ projectId, status: SprintStatus.CLOSED })
      .sort({ endDate: 1 })
      .limit(10);

    const velocityData = await Promise.all(completedSprints.map(async sprint => {
      const tasks = await Task.find({ sprintId: sprint._id, status: TaskStatus.DONE });
      const completed = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
      return {
        sprintId: sprint._id,
        sprintName: sprint.name,
        completedPoints: completed
      };
    }));

    const total = velocityData.reduce((sum, data) => sum + data.completedPoints, 0);
    const average = velocityData.length > 0 ? Math.round(total / velocityData.length) : 0;

    return {
      history: velocityData,
      average
    };
  },

  async getActivity(projectId?: string, organizationId?: string) {
    const query: any = {};
    if (projectId) query.projectId = projectId;
    else if (organizationId) query.organizationId = organizationId;

    const activities = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('actorId', 'firstName lastName')
      .lean();

    return activities;
  },

  async getDeadlines(projectId?: string, organizationId?: string, userId?: string) {
    const query: any = {};
    if (projectId) query.projectId = projectId;

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 14);

    const tasks = await Task.find({ ...query, dueDate: { $exists: true, $lte: nextWeek }, status: { $ne: TaskStatus.DONE } })
      .populate('assigneeId', 'firstName lastName')
      .sort({ dueDate: 1 })
      .limit(5);

    const milestones = await Milestone.find({ ...query, targetDate: { $exists: true, $lte: nextWeek }, status: { $ne: 'COMPLETED' } })
      .sort({ targetDate: 1 })
      .limit(5);

    const items = [
      ...tasks.map(t => ({
        id: t._id,
        title: t.title,
        type: 'Task',
        dueDate: t.dueDate,
        status: t.status
      })),
      ...milestones.map(m => ({
        id: m._id,
        title: m.name,
        type: 'Milestone',
        dueDate: m.targetDate,
        status: m.status
      }))
    ];

    return items.sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()).slice(0, 8);
  },

  async getTraceability(projectId: string) {
    const requirementsCount = await Requirement.countDocuments({ projectId });
    if (requirementsCount === 0) return { requirements: 0, fullyTraced: 0, missingLinks: 0, coverage: 0 };

    const storiesCount = await UserStory.countDocuments({ projectId });
    const coverage = Math.min(100, Math.round((storiesCount / (requirementsCount || 1)) * 100));

    return {
      requirements: requirementsCount,
      fullyTraced: Math.min(requirementsCount, storiesCount),
      missingLinks: Math.max(0, requirementsCount - storiesCount),
      coverage
    };
  },

  async getDod(projectId: string) {
    const activeSprint = await Sprint.findOne({ projectId, status: SprintStatus.ACTIVE });
    if (!activeSprint) return { compliance: 0, completed: 0, incomplete: 0, blocked: 0 };

    const dodos = await DefinitionOfDone.find({ sprintId: activeSprint._id });
    
    let totalItems = 0;
    let completedItems = 0;

    dodos.forEach((dod: any) => {
      if (dod.status === 'COMPLETED') completedItems++;
      totalItems++;
    });

    const compliance = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
      compliance,
      completed: completedItems,
      incomplete: totalItems - completedItems,
      blocked: 0
    };
  }
};

