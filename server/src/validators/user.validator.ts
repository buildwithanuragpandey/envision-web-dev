import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'PROJECT_LEAD', 'MEMBER'], {
    errorMap: () => ({ message: 'Role must be ADMIN, PROJECT_LEAD, or MEMBER' }),
  }),
  department: z.string().optional(),
  year: z.string().optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['ADMIN', 'PROJECT_LEAD', 'MEMBER']).optional(),
  department: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});
