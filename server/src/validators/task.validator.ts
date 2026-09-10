import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(2, 'Task title must be at least 2 characters'),
  description: z.string().optional(),
  projectId: z.string().uuid('Valid project ID is required'),
  assignedToId: z.string().uuid('Valid user ID').optional().nullable().or(z.literal('')),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).default('TODO'),
  deadline: z.string().datetime().optional().nullable().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/).optional().nullable()),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2, 'Task title must be at least 2 characters').optional(),
  description: z.string().optional().nullable(),
  projectId: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional().nullable().or(z.literal('')),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).optional(),
  deadline: z.string().datetime().optional().nullable().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/).optional().nullable()),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED'], {
    errorMap: () => ({ message: 'Status must be TODO, IN_PROGRESS, or COMPLETED' }),
  }),
});
