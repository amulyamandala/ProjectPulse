import { z } from 'zod';
import { TaskStatus, Priority } from '../types';

export const CreateSprintSchema = z.object({
  name: z.string().min(2),
  goal: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime()
});

export const CreateTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  storyPoints: z.number().min(0).optional(),
  userStoryId: z.string().optional()
});

export const UpdateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus)
});
