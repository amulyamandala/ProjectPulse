import { adaptiveService } from './adaptive.service';
import { Sprint, Task } from '../models';
import { SprintStatus, TaskStatus, Priority } from '@projectpulse/shared';

describe('Adaptive Delivery Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should analyze sprint risk and identify HIGH risk when behind schedule', async () => {
    const mockSprint = { 
      _id: 'sprint1', 
      status: SprintStatus.ACTIVE,
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Started 5 days ago
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // Ends in 5 days (50% elapsed)
    };
    Sprint.findById = jest.fn().mockResolvedValue(mockSprint);

    // Mock tasks: 100 points total, only 10 points DONE.
    Task.find = jest.fn().mockResolvedValue([
      { storyPoints: 10, status: TaskStatus.DONE, priority: Priority.MEDIUM },
      { storyPoints: 90, status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH }
    ]);

    const result = await adaptiveService.analyzeSprintRisk('sprint1');
    
    expect(result.metrics.completionPercentage).toBe(10);
    expect(result.metrics.timeElapsedPercentage).toBeCloseTo(50, -1);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.insights.some(i => i.includes('Velocity is lagging significantly'))).toBe(true);
  });

  it('should identify MEDIUM risk for blocked tasks', async () => {
    const mockSprint = { 
      _id: 'sprint1', 
      status: SprintStatus.ACTIVE,
      startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
      endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000) // 10% elapsed
    };
    Sprint.findById = jest.fn().mockResolvedValue(mockSprint);

    // Mock tasks: 100 points total, 10 points DONE. 1 blocked task.
    Task.find = jest.fn().mockResolvedValue([
      { storyPoints: 10, status: TaskStatus.DONE, priority: Priority.MEDIUM, isBlocked: false },
      { storyPoints: 90, status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, isBlocked: true }
    ]);

    const result = await adaptiveService.analyzeSprintRisk('sprint1');
    
    expect(result.riskLevel).toBe('MEDIUM');
    expect(result.insights.some(i => i.includes('blocked tasks'))).toBe(true);
  });

  it('should throw if sprint is CLOSED', async () => {
    const mockSprint = { _id: 'sprint1', status: SprintStatus.CLOSED };
    Sprint.findById = jest.fn().mockResolvedValue(mockSprint);

    await expect(adaptiveService.analyzeSprintRisk('sprint1')).rejects.toThrow('Cannot analyze a closed sprint');
  });
});
