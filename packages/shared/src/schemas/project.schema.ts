import { z } from 'zod';

export const CreateProjectSchema = z.object({
  name: z.string().min(2),
  key: z.string().min(2).max(10).toUpperCase(),
  description: z.string().optional()
});

export const CreateRequirementSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional()
});

export const CreateEpicSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  requirementId: z.string().optional()
});

export const CreateUserStorySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  epicId: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  storyPoints: z.number().optional()
});

export const CreateMilestoneSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  targetDate: z.string().datetime()
});
