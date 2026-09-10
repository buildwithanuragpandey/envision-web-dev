import { Request } from 'express';

export type UserRole = 'ADMIN' | 'PROJECT_LEAD' | 'MEMBER';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  department?: string | null;
  year?: string | null;
  avatar?: string | null;
  isActive: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}
