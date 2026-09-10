import { prisma } from '../utils/prisma.js';

export interface LogActivityParams {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
}

export class ActivityService {
  static async log(params: LogActivityParams) {
    try {
      return await prisma.activityLog.create({
        data: {
          userId: params.userId || null,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId || null,
          description: params.description,
        },
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
      return null;
    }
  }

  static async getRecentLogs(limit = 20) {
    return prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
  }
}
