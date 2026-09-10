import { prisma } from '../utils/prisma.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { UserRole } from '../types/index.js';
import { ActivityService } from './activity.service.js';

export class AuthService {
  static async login(email: string, passwordPlain: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    if (!user.isActive) {
      throw { statusCode: 403, message: 'Your account has been deactivated. Please contact an administrator.' };
    }

    const isValidPassword = await comparePassword(passwordPlain, user.passwordHash);
    if (!isValidPassword) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      name: user.name,
    });

    await ActivityService.log({
      userId: user.id,
      action: 'LOGIN',
      entityType: 'USER',
      entityId: user.id,
      description: `${user.name} logged into the system`,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        department: user.department,
        year: user.year,
        avatar: user.avatar,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
        updatedAt: true,
        _count: {
          select: {
            projectMembers: true,
            ledProjects: true,
            assignedTasks: true,
          },
        },
      },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    return user;
  }

  static async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const isMatch = await comparePassword(currentPass, user.passwordHash);
    if (!isMatch) {
      throw { statusCode: 400, message: 'Current password is incorrect' };
    }

    const newHash = await hashPassword(newPass);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    await ActivityService.log({
      userId: user.id,
      action: 'UPDATE',
      entityType: 'USER',
      entityId: user.id,
      description: `${user.name} changed their password`,
    });

    return { message: 'Password updated successfully' };
  }

  static async updateProfile(userId: string, data: { name?: string; department?: string; year?: string; avatar?: string }) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.department !== undefined ? { department: data.department } : {}),
        ...(data.year !== undefined ? { year: data.year } : {}),
        ...(data.avatar !== undefined ? { avatar: data.avatar || null } : {}),
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
      },
    });

    return updated;
  }
}
