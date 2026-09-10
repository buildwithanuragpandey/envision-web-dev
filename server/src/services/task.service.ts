import { prisma } from '../utils/prisma.js';
import { AuthenticatedUser } from '../types/index.js';
import { ActivityService } from './activity.service.js';

export interface TaskFilterParams {
  search?: string;
  status?: string;
  priority?: string;
  projectId?: string;
  assignedToId?: string;
  assignedToMe?: boolean;
  dueFilter?: 'overdue' | 'today' | 'upcoming';
}

export class TaskService {
  static async listTasks(currentUser: AuthenticatedUser, filters: TaskFilterParams = {}) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters.assignedToId) {
      where.assignedToId = filters.assignedToId;
    }

    if (filters.assignedToMe) {
      where.assignedToId = currentUser.id;
    }

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
      ];
    }

    // Due filter logic
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (filters.dueFilter === 'overdue') {
      where.deadline = { lt: startOfToday };
      where.status = { not: 'COMPLETED' };
    } else if (filters.dueFilter === 'today') {
      where.deadline = { gte: startOfToday, lte: endOfToday };
    } else if (filters.dueFilter === 'upcoming') {
      where.deadline = { gt: endOfToday };
    }

    // Role-based scoping:
    // If role is MEMBER and not explicitly searching another scope, ensure they only see tasks for their projects or assigned to them
    if (currentUser.role === 'MEMBER' && !filters.projectId && !filters.assignedToMe) {
      where.OR = [
        { assignedToId: currentUser.id },
        {
          project: {
            members: {
              some: { userId: currentUser.id },
            },
          },
        },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
            projectLeadId: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            department: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }],
    });

    // Annotate deadline urgency flags
    return tasks.map((task) => {
      let isOverdue = false;
      let isDueToday = false;

      if (task.deadline && task.status !== 'COMPLETED') {
        const d = new Date(task.deadline);
        if (d < startOfToday) {
          isOverdue = true;
        } else if (d >= startOfToday && d <= endOfToday) {
          isDueToday = true;
        }
      }

      return {
        ...task,
        isOverdue,
        isDueToday,
      };
    });
  }

  static async getTaskById(id: string, currentUser: AuthenticatedUser) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            projectLead: {
              select: { id: true, name: true, email: true },
            },
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatar: true },
                },
              },
            },
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            department: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw { statusCode: 404, message: 'Task not found' };
    }

    // Role check: If MEMBER, verify they are in project or assigned
    if (currentUser.role === 'MEMBER') {
      const isMember = task.project.members.some((m) => m.userId === currentUser.id);
      const isAssigned = task.assignedToId === currentUser.id;
      if (!isMember && !isAssigned) {
        throw { statusCode: 403, message: 'You do not have permission to view this task' };
      }
    }

    return task;
  }

  static async createTask(data: any, currentUser: AuthenticatedUser) {
    // Check project existence
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      include: { members: true },
    });

    if (!project) {
      throw { statusCode: 404, message: 'Project not found' };
    }

    // RBAC: Only Admin or Lead of THIS project can create tasks
    if (currentUser.role !== 'ADMIN' && project.projectLeadId !== currentUser.id) {
      throw { statusCode: 403, message: 'Forbidden: You can only create tasks in projects you lead or as an Admin' };
    }

    // Validate assigned user if provided
    let assignedUserName = 'Unassigned';
    if (data.assignedToId) {
      const assignedUser = await prisma.user.findUnique({ where: { id: data.assignedToId } });
      if (!assignedUser) {
        throw { statusCode: 400, message: 'Assigned user does not exist' };
      }
      // Ensure assigned user is a member of the project
      const isProjectMember = project.members.some((m) => m.userId === data.assignedToId);
      if (!isProjectMember) {
        // Auto-add to project members
        await prisma.projectMember.create({
          data: {
            projectId: project.id,
            userId: data.assignedToId,
          },
        }).catch(() => {});
      }
      assignedUserName = assignedUser.name;
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        projectId: data.projectId,
        assignedToId: data.assignedToId || null,
        createdById: currentUser.id,
        priority: data.priority || 'MEDIUM',
        status: data.status || 'TODO',
        deadline: data.deadline ? new Date(data.deadline) : null,
      },
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true, avatar: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    await ActivityService.log({
      userId: currentUser.id,
      action: 'CREATE',
      entityType: 'TASK',
      entityId: task.id,
      description: `Created task "${task.title}" in project "${project.name}" (Assigned: ${assignedUserName})`,
    });

    return task;
  }

  static async updateTask(id: string, data: any, currentUser: AuthenticatedUser) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task) {
      throw { statusCode: 404, message: 'Task not found' };
    }

    // Admin or Project Lead of this project can fully edit the task
    const isLeadOrAdmin = currentUser.role === 'ADMIN' || task.project.projectLeadId === currentUser.id;

    if (!isLeadOrAdmin) {
      throw { statusCode: 403, message: 'Forbidden: Only Admins or the Project Lead can modify task details' };
    }

    const updatePayload: any = {};
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.priority !== undefined) updatePayload.priority = data.priority;
    if (data.deadline !== undefined) updatePayload.deadline = data.deadline ? new Date(data.deadline) : null;
    if (data.assignedToId !== undefined) {
      updatePayload.assignedToId = data.assignedToId || null;
      if (data.assignedToId) {
        // Ensure user is in project
        await prisma.projectMember.upsert({
          where: { projectId_userId: { projectId: task.projectId, userId: data.assignedToId } },
          create: { projectId: task.projectId, userId: data.assignedToId },
          update: {},
        });
      }
    }
    if (data.status !== undefined) {
      updatePayload.status = data.status;
      if (data.status === 'COMPLETED' && task.status !== 'COMPLETED') {
        updatePayload.completedAt = new Date();
      } else if (data.status !== 'COMPLETED') {
        updatePayload.completedAt = null;
      }
    }

    const updated = await prisma.task.update({
      where: { id },
      data: updatePayload,
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true, avatar: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    await ActivityService.log({
      userId: currentUser.id,
      action: 'UPDATE',
      entityType: 'TASK',
      entityId: id,
      description: `Updated task "${updated.title}"`,
    });

    return updated;
  }

  static async updateTaskStatus(id: string, status: string, currentUser: AuthenticatedUser) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task) {
      throw { statusCode: 404, message: 'Task not found' };
    }

    const isAdmin = currentUser.role === 'ADMIN';
    const isLead = task.project.projectLeadId === currentUser.id;
    const isAssigned = task.assignedToId === currentUser.id;

    if (!isAdmin && !isLead && !isAssigned) {
      throw { statusCode: 403, message: 'Forbidden: You can only update the status of tasks assigned to you or in projects you lead' };
    }

    const completedAt = status === 'COMPLETED' ? new Date() : null;

    const updated = await prisma.task.update({
      where: { id },
      data: {
        status,
        completedAt,
      },
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    await ActivityService.log({
      userId: currentUser.id,
      action: 'STATUS_CHANGE',
      entityType: 'TASK',
      entityId: id,
      description: `Changed status of task "${task.title}" to ${status}`,
    });

    return updated;
  }

  static async deleteTask(id: string, currentUser: AuthenticatedUser) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task) {
      throw { statusCode: 404, message: 'Task not found' };
    }

    const isLeadOrAdmin = currentUser.role === 'ADMIN' || task.project.projectLeadId === currentUser.id;

    if (!isLeadOrAdmin) {
      throw { statusCode: 403, message: 'Forbidden: Only Admins or Project Leads can delete tasks' };
    }

    await prisma.task.delete({ where: { id } });

    await ActivityService.log({
      userId: currentUser.id,
      action: 'DELETE',
      entityType: 'TASK',
      entityId: id,
      description: `Deleted task "${task.title}" from project "${task.project.name}"`,
    });

    return { message: `Task "${task.title}" deleted successfully` };
  }
}
