import { prisma } from '../utils/prisma.js';
import { hashPassword } from '../utils/password.js';
import { ActivityService } from './activity.service.js';

export interface UserFilterParams {
  search?: string;
  role?: string;
  department?: string;
  isActive?: boolean;
}

export class UserService {
  static async listUsers(filters: UserFilterParams = {}) {
    const where: any = {};

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.department) {
      where.department = filters.department;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { department: { contains: q } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        department: true,
        year: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projectMembers: true,
            ledProjects: true,
            assignedTasks: true,
          },
        },
      },
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    });

    return users;
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        department: true,
        year: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        ledProjects: {
          select: {
            id: true,
            name: true,
            status: true,
            startDate: true,
            endDate: true,
          },
        },
        projectMembers: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                status: true,
                projectLead: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        },
        assignedTasks: {
          include: {
            project: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    return user;
  }

  static async createUser(data: any, createdById?: string) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw { statusCode: 400, message: 'A user with this email already exists' };
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
        role: data.role,
        department: data.department || null,
        year: data.year || null,
        avatar: data.avatar || null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        year: true,
        avatar: true,
        isActive: true,
        createdAt: true,
      },
    });

    await ActivityService.log({
      userId: createdById,
      action: 'CREATE',
      entityType: 'USER',
      entityId: user.id,
      description: `Created member account for ${user.name} (${user.role})`,
    });

    return user;
  }

  static async updateUser(id: string, data: any, updatedById?: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    if (data.email && data.email.toLowerCase() !== user.email) {
      const existing = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });
      if (existing) {
        throw { statusCode: 400, message: 'Email address is already in use by another account' };
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email.toLowerCase();
    if (data.role !== undefined) updateData.role = data.role;
    if (data.department !== undefined) updateData.department = data.department;
    if (data.year !== undefined) updateData.year = data.year;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        year: true,
        avatar: true,
        isActive: true,
        updatedAt: true,
      },
    });

    await ActivityService.log({
      userId: updatedById,
      action: 'UPDATE',
      entityType: 'USER',
      entityId: id,
      description: `Updated member details for ${updated.name}`,
    });

    return updated;
  }

  static async deleteUser(id: string, deletedById?: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    // Safety: Delete or deactivate
    await prisma.user.delete({ where: { id } });

    await ActivityService.log({
      userId: deletedById,
      action: 'DELETE',
      entityType: 'USER',
      entityId: id,
      description: `Deleted user account ${user.name} (${user.email})`,
    });

    return { message: `User ${user.name} removed successfully` };
  }
}
