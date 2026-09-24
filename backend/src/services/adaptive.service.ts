import { Sprint, Task } from '../models';
import { SprintStatus, TaskStatus, Priority } from '@projectpulse/shared';

export interface RiskAnalysis {
  sprintId: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  insights: string[];
  metrics: {
    totalStoryPoints: number;
    completedStoryPoints: number;
    completionPercentage: number;
    timeElapsedPercentage: number;
  };
}

export const adaptiveService = {
  async analyzeSprintRisk(sprintId: string): Promise<RiskAnalysis> {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) throw new Error('Sprint not found');
    
    if (sprint.status === SprintStatus.CLOSED) {
      throw new Error('Cannot analyze a closed sprint');
    }

    const tasks = await Task.find({ sprintId });

    let totalStoryPoints = 0;
    let completedStoryPoints = 0;
    let highPriorityAtRisk = 0;
    let blockedTasks = 0;

    for (const task of tasks) {
      const points = task.storyPoints || 0;
      totalStoryPoints += points;
      
      if (task.status === TaskStatus.DONE) {
        completedStoryPoints += points;
      } else {
        if (task.priority === Priority.URGENT || task.priority === Priority.HIGH) {
          highPriorityAtRisk++;
        }
        if (task.isBlocked) {
          blockedTasks++;
        }
      }
    }

    const completionPercentage = totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0;

    let timeElapsedPercentage = 0;
    const now = new Date();
    
    if (sprint.startDate && sprint.endDate) {
      const totalDuration = sprint.endDate.getTime() - sprint.startDate.getTime();
      const elapsedDuration = now.getTime() - sprint.startDate.getTime();
      
      if (totalDuration > 0) {
        timeElapsedPercentage = Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));
      }
    }

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    const insights: string[] = [];

    // Analyze Risk
    if (timeElapsedPercentage > 0 && completionPercentage < timeElapsedPercentage - 20) {
      riskLevel = 'HIGH';
      insights.push(`Velocity is lagging significantly. ${Math.round(timeElapsedPercentage)}% of time elapsed, but only ${Math.round(completionPercentage)}% of points completed.`);
    } else if (timeElapsedPercentage > 0 && completionPercentage < timeElapsedPercentage - 10) {
      riskLevel = 'MEDIUM';
      insights.push(`Velocity is slightly behind. Consider reducing scope.`);
    } else {
      insights.push('Sprint is on track.');
    }

    if (blockedTasks > 0) {
      riskLevel = riskLevel === 'LOW' ? 'MEDIUM' : 'HIGH';
      insights.push(`There are ${blockedTasks} blocked tasks delaying progress.`);
    }

    if (highPriorityAtRisk > 0 && timeElapsedPercentage > 75) {
      riskLevel = 'HIGH';
      insights.push(`There are ${highPriorityAtRisk} high-priority tasks incomplete late in the sprint.`);
    }

    return {
      sprintId,
      riskLevel,
      insights,
      metrics: {
        totalStoryPoints,
        completedStoryPoints,
        completionPercentage,
        timeElapsedPercentage
      }
    };
  }
};
