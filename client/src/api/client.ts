import axios from 'axios';
import {
  User,
  Project,
  Task,
  ActivityLog,
  AdminDashboardData,
  LeadDashboardData,
  MemberDashboardData,
  ApiResponse,
} from '../types';

const apiBase = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

export const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clubflow_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't loop if already on login page
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('clubflow_token');
        localStorage.removeItem('clubflow_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', credentials);
    return res.data;
  },
  logout: async () => {
    const res = await api.post<ApiResponse>('/auth/logout');
    return res.data;
  },
  getMe: async () => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
  changePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    const res = await api.post<ApiResponse>('/auth/change-password', passwords);
    return res.data;
  },
  updateProfile: async (data: Partial<User>) => {
    const res = await api.patch<ApiResponse<User>>('/auth/profile', data);
    return res.data;
  },
};

// User APIs
export const userApi = {
  getUsers: async (params?: { search?: string; role?: string; department?: string; isActive?: boolean }) => {
    const res = await api.get<ApiResponse<User[]>>('/users', { params });
    return res.data;
  },
  getUserById: async (id: string) => {
    const res = await api.get<ApiResponse<User>>(`/users/${id}`);
    return res.data;
  },
  createUser: async (data: any) => {
    const res = await api.post<ApiResponse<User>>('/users', data);
    return res.data;
  },
  updateUser: async (id: string, data: any) => {
    const res = await api.patch<ApiResponse<User>>(`/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id: string) => {
    const res = await api.delete<ApiResponse>(`/users/${id}`);
    return res.data;
  },
};

// Project APIs
export const projectApi = {
  getProjects: async (params?: { search?: string; status?: string; projectLeadId?: string; myProjectsOnly?: boolean }) => {
    const res = await api.get<ApiResponse<Project[]>>('/projects', { params });
    return res.data;
  },
  getProjectById: async (id: string) => {
    const res = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return res.data;
  },
  createProject: async (data: any) => {
    const res = await api.post<ApiResponse<Project>>('/projects', data);
    return res.data;
  },
  updateProject: async (id: string, data: any) => {
    const res = await api.patch<ApiResponse<Project>>(`/projects/${id}`, data);
    return res.data;
  },
  deleteProject: async (id: string) => {
    const res = await api.delete<ApiResponse>(`/projects/${id}`);
    return res.data;
  },
  getMembers: async (projectId: string) => {
    const res = await api.get<ApiResponse<User[]>>(`/projects/${projectId}/members`);
    return res.data;
  },
  addMember: async (projectId: string, userId: string) => {
    const res = await api.post<ApiResponse>(`/projects/${projectId}/members`, { userId });
    return res.data;
  },
  removeMember: async (projectId: string, userId: string) => {
    const res = await api.delete<ApiResponse>(`/projects/${projectId}/members/${userId}`);
    return res.data;
  },
  setProjectLead: async (projectId: string, projectLeadId: string | null) => {
    const res = await api.patch<ApiResponse<Project>>(`/projects/${projectId}/lead`, { projectLeadId });
    return res.data;
  },
};

// Task APIs
export const taskApi = {
  getTasks: async (params?: {
    search?: string;
    status?: string;
    priority?: string;
    projectId?: string;
    assignedToId?: string;
    assignedToMe?: boolean;
    dueFilter?: string;
  }) => {
    const res = await api.get<ApiResponse<Task[]>>('/tasks', { params });
    return res.data;
  },
  getTaskById: async (id: string) => {
    const res = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return res.data;
  },
  createTask: async (data: any) => {
    const res = await api.post<ApiResponse<Task>>('/tasks', data);
    return res.data;
  },
  updateTask: async (id: string, data: any) => {
    const res = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
    return res.data;
  },
  updateTaskStatus: async (id: string, status: string) => {
    const res = await api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, { status });
    return res.data;
  },
  deleteTask: async (id: string) => {
    const res = await api.delete<ApiResponse>(`/tasks/${id}`);
    return res.data;
  },
};

// Dashboard APIs
export const dashboardApi = {
  getAdminDashboard: async () => {
    const res = await api.get<ApiResponse<AdminDashboardData>>('/dashboard/admin');
    return res.data;
  },
  getLeadDashboard: async () => {
    const res = await api.get<ApiResponse<LeadDashboardData>>('/dashboard/lead');
    return res.data;
  },
  getMemberDashboard: async () => {
    const res = await api.get<ApiResponse<MemberDashboardData>>('/dashboard/member');
    return res.data;
  },
};

// Activity API
export const activityApi = {
  getActivities: async (limit = 25) => {
    const res = await api.get<ApiResponse<ActivityLog[]>>('/activities', { params: { limit } });
    return res.data;
  },
};
