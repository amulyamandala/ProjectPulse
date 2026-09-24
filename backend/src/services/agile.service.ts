import { Sprint, Task, DefinitionOfDone, DefinitionOfDoneItem } from '../models';
import { SprintStatus, TaskStatus, Priority } from '@projectpulse/shared';
import mongoose from 'mongoose';

export const agileService = {
  // --- SPRINTS ---
  async createSprint(orgId: string, projectId: string, name: string, goal?: string, startDate?: Date, endDate?: Date) {
    return Sprint.create({
      organizationId: orgId,
      projectId,
      name,
      goal,
      startDate,
      endDate,
      status: SprintStatus.PLANNED
    });
  },

  async startSprint(sprintId: string) {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) throw new Error('Sprint not found');
    if (sprint.status !== SprintStatus.PLANNED) throw new Error('Only PLANNED sprints can be started');

    sprint.status = SprintStatus.ACTIVE;
    // Basic logic: auto-set startDate if not set
    if (!sprint.startDate) sprint.startDate = new Date();
    await sprint.save();
    return sprint;
  },

  async completeSprint(sprintId: string) {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) throw new Error('Sprint not found');
    if (sprint.status !== SprintStatus.ACTIVE) throw new Error('Only ACTIVE sprints can be completed');

    // Move unfinished tasks to backlog or next sprint? Let's just complete the sprint for now.
    sprint.status = SprintStatus.CLOSED;
    sprint.endDate = new Date();
    await sprint.save();
    return sprint;
  },

  // --- TASKS ---
  async createTask(orgId: string, projectId: string, title: string, description?: string, priority?: Priority, storyPoints?: number, userStoryId?: string) {
    const count = await Task.countDocuments({ projectId });
    const key = `TASK-${count + 1}`;

    return Task.create({
      organizationId: orgId,
      projectId,
      key,
      title,
      description,
      priority,
      storyPoints,
      userStoryId,
      status: TaskStatus.TODO
    });
  },

  async updateTaskStatus(taskId: string, newStatus: TaskStatus, userId: string) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    // Basic DoD Check before moving to DONE
    if (newStatus === TaskStatus.DONE) {
      const dodItems = await DefinitionOfDoneItem.find({ targetId: taskId, targetType: 'Task' });
      const incomplete = dodItems.some((item: any) => !item.isCompleted);
      if (incomplete) {
        throw new Error('Cannot transition to DONE: Definition of Done is not fully satisfied.');
      }
    }

    task.status = newStatus;
    await task.save();
    return task;
  },

  async assignTask(taskId: string, assigneeId: string) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    task.assigneeId = new mongoose.Types.ObjectId(assigneeId);
    await task.save();
    return task;
  }
};
