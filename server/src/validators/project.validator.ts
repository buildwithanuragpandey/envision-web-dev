import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'COMPLETED', 'ARCHIVED']).default('ACTIVE'),
  startDate: z.string().datetime().optional().nullable().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/).optional().nullable()),
  endDate: z.string().datetime().optional().nullable().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/).optional().nullable()),
  projectLeadId: z.string().uuid().optional().nullable().or(z.literal('')),
  memberIds: z.array(z.string().uuid()).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters').optional(),
  description: z.string().optional().nullable(),
  status: z.enum(['PLANNING', 'ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
  startDate: z.string().datetime().optional().nullable().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/).optional().nullable()),
  endDate: z.string().datetime().optional().nullable().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/).optional().nullable()),
  projectLeadId: z.string().uuid().optional().nullable().or(z.literal('')),
});

export const addProjectMemberSchema = z.object({
  userId: z.string().uuid('Valid user ID is required'),
});

export const setProjectLeadSchema = z.object({
  projectLeadId: z.string().uuid('Valid project lead ID is required').nullable().or(z.literal('')),
});
