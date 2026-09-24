import { agileService } from './agile.service';
import { Sprint, Task, DefinitionOfDoneItem } from '../models';
import { SprintStatus, TaskStatus } from '@projectpulse/shared';
import mongoose from 'mongoose';

describe('Agile Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Sprints', () => {
    it('should create a sprint', async () => {
      Sprint.create = jest.fn().mockResolvedValue({ _id: 'sprint1' });
      const sprint = await agileService.createSprint('org1', 'proj1', 'Sprint 1', 'Goal', new Date(), new Date());
      expect(Sprint.create).toHaveBeenCalled();
      expect(sprint).toBeDefined();
    });

    it('should start a planned sprint', async () => {
      const mockSprint = { _id: 'sprint1', status: SprintStatus.PLANNED, save: jest.fn() };
      Sprint.findById = jest.fn().mockResolvedValue(mockSprint);
      
      const sprint = await agileService.startSprint('sprint1');
      expect(sprint.status).toBe(SprintStatus.ACTIVE);
      expect(mockSprint.save).toHaveBeenCalled();
    });

    it('should not start an active sprint', async () => {
      const mockSprint = { _id: 'sprint1', status: SprintStatus.ACTIVE, save: jest.fn() };
      Sprint.findById = jest.fn().mockResolvedValue(mockSprint);
      
      await expect(agileService.startSprint('sprint1')).rejects.toThrow('Only PLANNED sprints can be started');
    });
  });

  describe('Tasks', () => {
    it('should create a task', async () => {
      Task.countDocuments = jest.fn().mockResolvedValue(5);
      Task.create = jest.fn().mockResolvedValue({ _id: 'task1', key: 'TASK-6' });

      const task = await agileService.createTask('org1', 'proj1', 'Task 1');
      expect(Task.create).toHaveBeenCalledWith(expect.objectContaining({
        key: 'TASK-6',
        title: 'Task 1'
      }));
      expect(task).toBeDefined();
    });

    it('should fail transition to DONE if DoD is incomplete', async () => {
      const mockTask = { _id: 'task1', status: TaskStatus.IN_PROGRESS, save: jest.fn() };
      Task.findById = jest.fn().mockResolvedValue(mockTask);
      
      DefinitionOfDoneItem.find = jest.fn().mockResolvedValue([
        { isCompleted: true },
        { isCompleted: false } // incomplete item
      ]);

      await expect(agileService.updateTaskStatus('task1', TaskStatus.DONE, 'user1'))
        .rejects.toThrow('Cannot transition to DONE: Definition of Done is not fully satisfied.');
    });

    it('should transition to DONE if DoD is complete', async () => {
      const mockTask = { _id: 'task1', status: TaskStatus.IN_PROGRESS, save: jest.fn() };
      Task.findById = jest.fn().mockResolvedValue(mockTask);
      
      DefinitionOfDoneItem.find = jest.fn().mockResolvedValue([
        { isCompleted: true }
      ]);

      const task = await agileService.updateTaskStatus('task1', TaskStatus.DONE, 'user1');
      expect(task.status).toBe(TaskStatus.DONE);
      expect(mockTask.save).toHaveBeenCalled();
    });
  });
});
