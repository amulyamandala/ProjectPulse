import { z } from 'zod';
import { IssueSeverity, TaskStatus } from '../types';

export const CreateIssueSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  severity: z.nativeEnum(IssueSeverity),
  affectedVersion: z.string().optional(),
  stepsToReproduce: z.string().optional()
});

export const UpdateIssueSchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(), // Issues often share task states (TODO, IN_PROGRESS, DONE) or have their own
  assigneeId: z.string().optional()
});

export const CreateTestCaseSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  steps: z.string(),
  expectedResult: z.string()
});

export const ExecuteTestCaseSchema = z.object({
  status: z.enum(['PASSED', 'FAILED', 'BLOCKED']),
  notes: z.string().optional()
});
