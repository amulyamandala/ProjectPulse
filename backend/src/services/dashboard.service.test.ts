import { dashboardService } from './dashboard.service';
import { Sprint, Task, Issue } from '../models';
import { SprintStatus, TaskStatus } from '@projectpulse/shared';
import mongoose from 'mongoose';

describe('Dashboard Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return project dashboard metrics', async () => {
    Sprint.countDocuments = jest.fn().mockResolvedValue(1); // 1 active, 1 planned in two calls
    
    Task.find = jest.fn().mockResolvedValue([
      { status: TaskStatus.TODO },
      { status: TaskStatus.IN_PROGRESS },
      { status: TaskStatus.DONE }
    ]);

    Issue.countDocuments = jest.fn().mockResolvedValue(2); // 2 open issues

    const result = await dashboardService.getProjectDashboard('proj1');

    expect(Sprint.countDocuments).toHaveBeenCalledTimes(2);
    expect(result.sprints.active).toBe(1);
    expect(result.tasks.total).toBe(3);
    expect(result.tasks.todo).toBe(1);
    expect(result.tasks.inProgress).toBe(1);
    expect(result.tasks.done).toBe(1);
    expect(result.issues.open).toBe(2);
  });

  it('should return user personalized dashboard metrics', async () => {
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ title: 'Mock item' }])
    };

    Task.find = jest.fn().mockReturnValue(mockQuery);
    Issue.find = jest.fn().mockReturnValue(mockQuery);

    const userId = new mongoose.Types.ObjectId().toString();
    const result = await dashboardService.getUserDashboard(userId);

    expect(Task.find).toHaveBeenCalled();
    expect(Issue.find).toHaveBeenCalled();
    expect(result.assignedTasks.length).toBe(1);
    expect(result.assignedIssues.length).toBe(1);
  });
});
