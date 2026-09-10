import { prisma } from '../utils/prisma.js';
import { AuthenticatedUser } from '../types/index.js';
import { ActivityService } from './activity.service.js';

export interface ProjectFilterParams {
  search?: string;
  status?: string;
  projectLeadId?: string;
  myProjectsOnly?: boolean;
}

export class ProjectService {
  static async listProjects(currentUser: AuthenticatedUser, filters: ProjectFilterParams = {}) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.projectLeadId) {
      where.projectLeadId = filters.projectLeadId;
    }

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
      ];
    }

    // Role-based visibility scoping:
    // If user is MEMBER and requested myProjectsOnly or is regular member, we can filter or flag membership
    if (currentUser.role === 'MEMBER' && filters.myProjectsOnly) {
      where.members = {
        some: {
          userId: currentUser.id,
        },
      };
    } else if (currentUser.role === 'PROJECT_LEAD' && filters.myProjectsOnly) {
      where.OR = [
        { projectLeadId: currentUser.id },
        { members: { some: { userId: currentUser.id } } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        projectLead: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                department: true,
              },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            status: true,
            priority: true,
            deadline: true,
          },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute progress and task statistics for each project
    return projects.map((p) => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter((t) => t.status === 'COMPLETED').length;
      const inProgressTasks = p.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
      const todoTasks = p.tasks.filter((t) => t.status === 'TODO').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const isMember = p.members.some((m) => m.userId === currentUser.id);
      const isLead = p.projectLeadId === currentUser.id;

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        startDate: p.startDate,
        endDate: p.endDate,
        projectLeadId: p.projectLeadId,
        projectLead: p.projectLead,
        createdBy: p.createdBy,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        memberCount: p.members.length,
        members: p.members.map((m) => m.user),
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        progress,
        isMember,
        isLead,
      };
    });
  }

  static async getProjectById(id: string, currentUser: AuthenticatedUser) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        projectLead: {
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
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                department: true,
                year: true,
              },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }],
        },
      },
    });

    if (!project) {
      throw { statusCode: 404, message: 'Project not found' };
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks = project.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todoTasks = project.tasks.filter((t) => t.status === 'TODO').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate individual member stats in this project
    const memberStats = project.members.map((m) => {
      const userTasks = project.tasks.filter((t) => t.assignedToId === m.userId);
      const userCompleted = userTasks.filter((t) => t.status === 'COMPLETED').length;
      const userProgress = userTasks.length > 0 ? Math.round((userCompleted / userTasks.length) * 100) : 0;
      return {
        ...m.user,
        joinedAt: m.joinedAt,
        totalTasks: userTasks.length,
        completedTasks: userCompleted,
        progress: userProgress,
      };
    });

    const isMember = project.members.some((m) => m.userId === currentUser.id);
    const isLead = project.projectLeadId === currentUser.id;

    return {
      ...project,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      progress,
      isMember,
      isLead,
      memberStats,
    };
  }

  static async createProject(data: any, currentUser: AuthenticatedUser) {
    if (currentUser.role !== 'ADMIN') {
      throw { statusCode: 403, message: 'Only Admins can create projects' };
    }

    // Validate projectLeadId if provided
    if (data.projectLeadId) {
      const leadUser = await prisma.user.findUnique({
        where: { id: data.projectLeadId },
      });
      if (!leadUser) {
        throw { statusCode: 400, message: 'Specified Project Lead user does not exist' };
      }
    }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description || null,
        status: data.status || 'ACTIVE',
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        createdById: currentUser.id,
        projectLeadId: data.projectLeadId || null,
      },
      include: {
        projectLead: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Auto-add project lead to project members if assigned
    const memberIdsToAdd = new Set<string>();
    if (data.projectLeadId) {
      memberIdsToAdd.add(data.projectLeadId);
    }
    if (Array.isArray(data.memberIds)) {
      data.memberIds.forEach((id: string) => memberIdsToAdd.add(id));
    }

    if (memberIdsToAdd.size > 0) {
      for (const userId of memberIdsToAdd) {
        await prisma.projectMember.create({
          data: {
            projectId: project.id,
            userId,
          },
        }).catch(() => {}); // ignore duplicates
      }
    }

    await ActivityService.log({
      userId: currentUser.id,
      action: 'CREATE',
      entityType: 'PROJECT',
      entityId: project.id,
      description: `Created new project "${project.name}"`,
    });

    return this.getProjectById(project.id, currentUser);
  }

  static async updateProject(id: string, data: any, currentUser: AuthenticatedUser) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw { statusCode: 404, message: 'Project not found' };
    }

    // Check permissions: Admin or assigned Project Lead
    if (currentUser.role !== 'ADMIN' && project.projectLeadId !== currentUser.id) {
      throw { statusCode: 403, message: 'You do not have permission to update this project' };
    }

    // If changing projectLeadId, only ADMIN can do that
    if (data.projectLeadId !== undefined && data.projectLeadId !== project.projectLeadId) {
      if (currentUser.role !== 'ADMIN') {
        throw { statusCode: 403, message: 'Only Admins can change the Project Lead' };
      }
      if (data.projectLeadId) {
        const leadUser = await prisma.user.findUnique({ where: { id: data.projectLeadId } });
        if (!leadUser) {
          throw { statusCode: 400, message: 'Specified Project Lead user does not exist' };
        }
        // ensure lead is added as project member
        await prisma.projectMember.upsert({
          where: { projectId_userId: { projectId: id, userId: data.projectLeadId } },
          create: { projectId: id, userId: data.projectLeadId },
          update: {},
        });
      }
    }

    const updatePayload: any = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.startDate !== undefined) updatePayload.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined) updatePayload.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.projectLeadId !== undefined) updatePayload.projectLeadId = data.projectLeadId || null;

    const updated = await prisma.project.update({
      where: { id },
      data: updatePayload,
    });

    await ActivityService.log({
      userId: currentUser.id,
      action: 'UPDATE',
      entityType: 'PROJECT',
      entityId: id,
      description: `Updated project "${updated.name}" details`,
    });

    return this.getProjectById(id, currentUser);
  }

  static async deleteProject(id: string, currentUser: AuthenticatedUser) {
    if (currentUser.role !== 'ADMIN') {
      throw { statusCode: 403, message: 'Only Admins can delete projects' };
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw { statusCode: 404, message: 'Project not found' };
    }

    await prisma.project.delete({ where: { id } });

    await ActivityService.log({
      userId: currentUser.id,
      action: 'DELETE',
      entityType: 'PROJECT',
      entityId: id,
      description: `Deleted project "${project.name}"`,
    });

    return { message: `Project "${project.name}" deleted successfully` };
  }

  static async getMembers(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                department: true,
                year: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw { statusCode: 404, message: 'Project not found' };
    }

    return project.members.map((m) => ({
      ...m.user,
      joinedAt: m.joinedAt,
    }));
  }

  static async addMember(projectId: string, userId: string, currentUser: AuthenticatedUser) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw { statusCode: 404, message: 'Project not found' };
    }

    if (currentUser.role !== 'ADMIN' && project.projectLeadId !== currentUser.id) {
      throw { statusCode: 403, message: 'Only Admins or the Project Lead can add members to this project' };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw { statusCode: 404, message: 'User to add not found' };
    }

    const existing = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    if (existing) {
      throw { statusCode: 400, message: 'User is already a member of this project' };
    }

    await prisma.projectMember.create({
      data: {
        projectId,
        userId,
      },
    });

    await ActivityService.log({
      userId: currentUser.id,
      action: 'MEMBER_ADD',
      entityType: 'PROJECT',
      entityId: projectId,
      description: `Added ${user.name} to project "${project.name}"`,
    });

    return { message: `Added ${user.name} to project successfully` };
  }

  static async removeMember(projectId: string, userId: string, currentUser: AuthenticatedUser) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw { statusCode: 404, message: 'Project not found' };
    }

    if (currentUser.role !== 'ADMIN' && project.projectLeadId !== currentUser.id) {
      throw { statusCode: 403, message: 'Only Admins or the Project Lead can remove members from this project' };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    if (!membership) {
      throw { statusCode: 404, message: 'User is not a member of this project' };
    }

    // If removing the project lead, disassociate lead
    if (project.projectLeadId === userId) {
      await prisma.project.update({
        where: { id: projectId },
        data: { projectLeadId: null },
      });
    }

    // Unassign tasks assigned to this user in this project
    await prisma.task.updateMany({
      where: { projectId, assignedToId: userId },
      data: { assignedToId: null },
    });

    await prisma.projectMember.delete({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    await ActivityService.log({
      userId: currentUser.id,
      action: 'MEMBER_REMOVE',
      entityType: 'PROJECT',
      entityId: projectId,
      description: `Removed ${user.name} from project "${project.name}"`,
    });

    return { message: `Removed ${user.name} from project successfully` };
  }

  static async setProjectLead(projectId: string, projectLeadId: string | null, currentUser: AuthenticatedUser) {
    if (currentUser.role !== 'ADMIN') {
      throw { statusCode: 403, message: 'Only Admins can assign or change Project Leads' };
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw { statusCode: 404, message: 'Project not found' };
    }

    let leadName = 'None';
    if (projectLeadId) {
      const leadUser = await prisma.user.findUnique({ where: { id: projectLeadId } });
      if (!leadUser) {
        throw { statusCode: 404, message: 'Project Lead user not found' };
      }
      leadName = leadUser.name;

      // Ensure new lead is a member of the project
      await prisma.projectMember.upsert({
        where: { projectId_userId: { projectId, userId: projectLeadId } },
        create: { projectId, userId: projectLeadId },
        update: {},
      });
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { projectLeadId },
      include: {
        projectLead: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    await ActivityService.log({
      userId: currentUser.id,
      action: 'ASSIGN',
      entityType: 'PROJECT',
      entityId: projectId,
      description: `Assigned ${leadName} as Project Lead for "${project.name}"`,
    });

    return updated;
  }
}
