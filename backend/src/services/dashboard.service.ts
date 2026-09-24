import { Project, Sprint, Task, Issue } from '../models';
import { SprintStatus, TaskStatus } from '@projectpulse/shared';
import mongoose from 'mongoose';

export const dashboardService = {
  async getProjectDashboard(projectId: string) {
    const activeSprintsCount = await Sprint.countDocuments({ projectId, status: SprintStatus.ACTIVE });
    const plannedSprintsCount = await Sprint.countDocuments({ projectId, status: SprintStatus.PLANNED });
    
    // Tasks breakdown
    const tasks = await Task.find({ projectId });
    const taskBreakdown = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === TaskStatus.TODO || t.status === TaskStatus.BACKLOG).length,
      inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.IN_REVIEW).length,
      done: tasks.filter(t => t.status === TaskStatus.DONE).length,
    };

    // Open issues
    const openIssuesCount = await Issue.countDocuments({ projectId, status: { $ne: TaskStatus.DONE } });

    return {
      sprints: {
        active: activeSprintsCount,
        planned: plannedSprintsCount
      },
      tasks: taskBreakdown,
      issues: {
        open: openIssuesCount
      }
    };
  },

  async getUserDashboard(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    const assignedTasks = await Task.find({ assigneeId: userObjectId, status: { $ne: TaskStatus.DONE } })
      .populate('projectId', 'name')
      .sort({ priority: -1, createdAt: 1 })
      .limit(10);
      
    const assignedIssues = await Issue.find({ assigneeId: userObjectId, status: { $ne: TaskStatus.DONE } })
      .populate('projectId', 'name')
      .sort({ severity: -1, createdAt: 1 })
      .limit(10);

    return {
      assignedTasks,
      assignedIssues
    };
  }
};
