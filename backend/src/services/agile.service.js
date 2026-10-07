import { Sprint, Task, DefinitionOfDoneItem } from "../models/index.js";
import { SprintStatus, TaskStatus } from "@projectpulse/shared";
import mongoose from "mongoose";

export const agileService = {
  // --- SPRINTS ---
  async createSprint(orgId, projectId, name, goal, startDate, endDate) {
    return Sprint.create({
      organizationId: orgId,
      projectId,
      name,
      goal,
      startDate,
      endDate,
      status: SprintStatus.PLANNED,
    });
  },

  async startSprint(sprintId) {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) throw new Error("Sprint not found");
    if (sprint.status !== SprintStatus.PLANNED)
      throw new Error("Only PLANNED sprints can be started");

    sprint.status = SprintStatus.ACTIVE;
    // Basic logic: auto-set startDate if not set
    if (!sprint.startDate) sprint.startDate = new Date();
    await sprint.save();
    return sprint;
  },

  async completeSprint(sprintId) {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) throw new Error("Sprint not found");
    if (sprint.status !== SprintStatus.ACTIVE)
      throw new Error("Only ACTIVE sprints can be completed");

    // Move unfinished tasks to backlog or next sprint? Let's just complete the sprint for now.
    sprint.status = SprintStatus.CLOSED;
    sprint.endDate = new Date();
    await sprint.save();
    return sprint;
  },

  async getActiveBoard(projectId) {
    const sprint = await Sprint.findOne({
      projectId,
      status: { $in: [SprintStatus.PLANNED, SprintStatus.ACTIVE] },
    }).sort({ startDate: 1 });

    if (!sprint) {
      return { sprint: null, tasks: [] };
    }

    const tasks = await Task.find({
      projectId,
      $or: [
        { sprintId: sprint._id },
        { sprintId: { $exists: false } },
        { sprintId: null },
      ],
    }).populate("assigneeId", "firstName lastName");

    return { sprint, tasks };
  },

  // --- TASKS ---
  async createTask(
    orgId,
    projectId,
    title,
    description,
    priority,
    storyPoints,
    userStoryId,
    sprintId,
  ) {
    const count = await Task.countDocuments({ projectId });
    const key = `TASK-${count + 1}`;

    return Task.create({
      organizationId: orgId,
      projectId,
      sprintId,
      key,
      title,
      description,
      priority,
      storyPoints,
      userStoryId,
      status: TaskStatus.TODO,
    });
  },

  async updateTaskStatus(taskId, newStatus, userId) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    // Basic DoD Check before moving to DONE
    if (newStatus === TaskStatus.DONE) {
      const dodItems = await DefinitionOfDoneItem.find({
        targetId: taskId,
        targetType: "Task",
      });
      const incomplete = dodItems.some((item) => !item.isCompleted);
      if (incomplete) {
        throw new Error(
          "Cannot transition to DONE: Definition of Done is not fully satisfied.",
        );
      }
    }

    task.status = newStatus;
    await task.save();
    return task;
  },

  async assignTask(taskId, assigneeId) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    task.assigneeId = new mongoose.Types.ObjectId(assigneeId);
    await task.save();
    return task;
  },
};
