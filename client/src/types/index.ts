export type UserRole = 'ADMIN' | 'PROJECT_LEAD' | 'MEMBER';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  department?: string | null;
  year?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    projectMembers: number;
    ledProjects: number;
    assignedTasks: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  projectLeadId?: string | null;
  projectLead?: User | null;
  createdBy?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  members?: User[];
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  progress: number;
  isMember?: boolean;
  isLead?: boolean;
  tasks?: Task[];
  memberStats?: Array<User & { joinedAt: string; totalTasks: number; completedTasks: number; progress: number }>;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  projectId: string;
  project?: {
    id: string;
    name: string;
    status: ProjectStatus;
    projectLeadId?: string | null;
  };
  assignedToId?: string | null;
  assignedTo?: User | null;
  createdById?: string | null;
  createdBy?: { id: string; name: string } | null;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
  isDueToday?: boolean;
}

export interface ActivityLog {
  id: string;
  userId?: string | null;
  user?: User | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  description: string;
  createdAt: string;
}

export interface AdminDashboardData {
  kpis: {
    totalMembers: number;
    activeMembers: number;
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    planningProjects: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    clubCompletionRate: number;
  };
  projectProgressList: Array<{
    id: string;
    name: string;
    status: ProjectStatus;
    projectLead?: { id: string; name: string; avatar?: string } | null;
    memberCount: number;
    taskCount: number;
    completedCount: number;
    progress: number;
  }>;
  taskStatusDistribution: Array<{ name: string; count: number; color: string }>;
  priorityDistribution: Array<{ name: string; count: number; color: string }>;
  departmentDistribution: Array<{ department: string; count: number }>;
  upcomingDeadlines: Task[];
  recentActivities: ActivityLog[];
}

export interface LeadDashboardData {
  kpis: {
    totalLedProjects: number;
    activeProjects: number;
    totalTeamSize: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    completionRate: number;
  };
  projectSummaries: Array<{
    id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    startDate?: string;
    endDate?: string;
    memberCount: number;
    taskCount: number;
    completed: number;
    inProg: number;
    todo: number;
    progress: number;
  }>;
  memberPerformance: Array<User & {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    progress: number;
  }>;
  upcomingDeadlines: Task[];
}

export interface MemberDashboardData {
  kpis: {
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    completionRate: number;
  };
  projects: Array<{
    id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    projectLead?: User | null;
    memberCount: number;
    totalTasks: number;
    overallProgress: number;
    myTaskCount: number;
    myCompletedCount: number;
    myProgress: number;
    joinedAt: string;
  }>;
  assignedTasks: Task[];
  upcomingTasks: Task[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  details?: any;
}
