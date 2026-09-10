import { prisma } from '../utils/prisma.js';
import { ActivityService } from './activity.service.js';

export class DashboardService {
  static async getAdminDashboard() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalMembers,
      activeMembers,
      totalProjects,
      activeProjects,
      completedProjects,
      planningProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      projects,
      recentTasks,
      recentActivities,
      allUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.project.count(),
      prisma.project.count({ where: { status: 'ACTIVE' } }),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.project.count({ where: { status: 'PLANNING' } }),
      prisma.task.count(),
      prisma.task.count({ where: { status: 'COMPLETED' } }),
      prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { status: 'TODO' } }),
      prisma.task.count({
        where: {
          deadline: { lt: startOfToday },
          status: { not: 'COMPLETED' },
        },
      }),
      prisma.project.findMany({
        take: 6,
        orderBy: { updatedAt: 'desc' },
        include: {
          projectLead: { select: { id: true, name: true, avatar: true } },
          _count: { select: { members: true, tasks: true } },
          tasks: { select: { status: true } },
        },
      }),
      prisma.task.findMany({
        take: 6,
        where: { status: { not: 'COMPLETED' } },
        orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }],
        include: {
          project: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true, avatar: true } },
        },
      }),
      ActivityService.getRecentLogs(8),
      prisma.user.findMany({
        select: { department: true, role: true },
      }),
    ]);

    // Calculate project progress list
    const projectProgressList = projects.map((p) => {
      const taskCount = p.tasks.length;
      const completed = p.tasks.filter((t) => t.status === 'COMPLETED').length;
      const progress = taskCount > 0 ? Math.round((completed / taskCount) * 100) : 0;
      return {
        id: p.id,
        name: p.name,
        status: p.status,
        projectLead: p.projectLead,
        memberCount: p._count.members,
        taskCount,
        completedCount: completed,
        progress,
      };
    });

    // Task distribution
    const taskStatusDistribution = [
      { name: 'Completed', count: completedTasks, color: '#10B981' },
      { name: 'In Progress', count: inProgressTasks, color: '#3B82F6' },
      { name: 'To Do', count: todoTasks, color: '#F59E0B' },
    ];

    // Priority distribution
    const [lowPriority, mediumPriority, highPriority, urgentPriority] = await Promise.all([
      prisma.task.count({ where: { priority: 'LOW' } }),
      prisma.task.count({ where: { priority: 'MEDIUM' } }),
      prisma.task.count({ where: { priority: 'HIGH' } }),
      prisma.task.count({ where: { priority: 'URGENT' } }),
    ]);

    const priorityDistribution = [
      { name: 'Low', count: lowPriority, color: '#6B7280' },
      { name: 'Medium', count: mediumPriority, color: '#3B82F6' },
      { name: 'High', count: highPriority, color: '#F97316' },
      { name: 'Urgent', count: urgentPriority, color: '#EF4444' },
    ];

    // Department breakdown
    const departmentCounts: Record<string, number> = {};
    allUsers.forEach((u) => {
      const dept = u.department || 'General';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });
    const departmentDistribution = Object.entries(departmentCounts).map(([department, count]) => ({
      department,
      count,
    }));

    const clubCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      kpis: {
        totalMembers,
        activeMembers,
        totalProjects,
        activeProjects,
        completedProjects,
        planningProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        clubCompletionRate,
      },
      projectProgressList,
      taskStatusDistribution,
      priorityDistribution,
      departmentDistribution,
      upcomingDeadlines: recentTasks,
      recentActivities,
    };
  }

  static async getProjectLeadDashboard(leadUserId: string) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Projects led by this user
    const ledProjects = await prisma.project.findMany({
      where: { projectLeadId: leadUserId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                department: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignedTo: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const projectIds = ledProjects.map((p) => p.id);

    // Aggregate unique team members
    const teamMemberMap = new Map<string, any>();
    ledProjects.forEach((p) => {
      p.members.forEach((m) => {
        if (!teamMemberMap.has(m.userId)) {
          teamMemberMap.set(m.userId, m.user);
        }
      });
    });
    const teamMembers = Array.from(teamMemberMap.values());

    // All tasks across led projects
    const allTasks = ledProjects.flatMap((p) => p.tasks);
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks = allTasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todoTasks = allTasks.filter((t) => t.status === 'TODO').length;
    const overdueTasks = allTasks.filter(
      (t) => t.deadline && new Date(t.deadline) < startOfToday && t.status !== 'COMPLETED'
    ).length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Project cards with progress
    const projectSummaries = ledProjects.map((p) => {
      const taskCount = p.tasks.length;
      const completed = p.tasks.filter((t) => t.status === 'COMPLETED').length;
      const inProg = p.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
      const todo = p.tasks.filter((t) => t.status === 'TODO').length;
      const progress = taskCount > 0 ? Math.round((completed / taskCount) * 100) : 0;

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        startDate: p.startDate,
        endDate: p.endDate,
        memberCount: p.members.length,
        taskCount,
        completed,
        inProg,
        todo,
        progress,
      };
    });

    // Team member workload & performance
    const memberPerformance = teamMembers.map((member) => {
      const memberTasks = allTasks.filter((t) => t.assignedTo?.id === member.id);
      const memberCompleted = memberTasks.filter((t) => t.status === 'COMPLETED').length;
      const progress = memberTasks.length > 0 ? Math.round((memberCompleted / memberTasks.length) * 100) : 0;

      return {
        ...member,
        totalTasks: memberTasks.length,
        completedTasks: memberCompleted,
        inProgressTasks: memberTasks.filter((t) => t.status === 'IN_PROGRESS').length,
        progress,
      };
    });

    // Upcoming deadlines in led projects
    const upcomingTasks = await prisma.task.findMany({
      where: {
        projectId: { in: projectIds },
        status: { not: 'COMPLETED' },
      },
      take: 6,
      orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }],
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, avatar: true } },
      },
    });

    return {
      kpis: {
        totalLedProjects: ledProjects.length,
        activeProjects: ledProjects.filter((p) => p.status === 'ACTIVE').length,
        totalTeamSize: teamMembers.length,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        completionRate,
      },
      projectSummaries,
      memberPerformance,
      upcomingDeadlines: upcomingTasks,
    };
  }

  static async getMemberDashboard(userId: string) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Projects this member belongs to
    const projectMemberships = await prisma.projectMember.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            projectLead: { select: { id: true, name: true, email: true, avatar: true } },
            tasks: { select: { id: true, status: true, assignedToId: true } },
            _count: { select: { members: true, tasks: true } },
          },
        },
      },
    });

    const projects = projectMemberships.map((pm) => {
      const p = pm.project;
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter((t) => t.status === 'COMPLETED').length;
      const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const myTasks = p.tasks.filter((t) => t.assignedToId === userId);
      const myCompleted = myTasks.filter((t) => t.status === 'COMPLETED').length;
      const myProgress = myTasks.length > 0 ? Math.round((myCompleted / myTasks.length) * 100) : 0;

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        projectLead: p.projectLead,
        memberCount: p._count.members,
        totalTasks,
        overallProgress,
        myTaskCount: myTasks.length,
        myCompletedCount: myCompleted,
        myProgress,
        joinedAt: pm.joinedAt,
      };
    });

    // All assigned tasks for this member
    const assignedTasks = await prisma.task.findMany({
      where: { assignedToId: userId },
      include: {
        project: { select: { id: true, name: true } },
      },
      orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }],
    });

    const totalTasks = assignedTasks.length;
    const completedTasks = assignedTasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks = assignedTasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todoTasks = assignedTasks.filter((t) => t.status === 'TODO').length;
    const overdueTasks = assignedTasks.filter(
      (t) => t.deadline && new Date(t.deadline) < startOfToday && t.status !== 'COMPLETED'
    ).length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const upcomingTasks = assignedTasks.filter((t) => t.status !== 'COMPLETED').slice(0, 6);

    return {
      kpis: {
        totalProjects: projects.length,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        completionRate,
      },
      projects,
      assignedTasks,
      upcomingTasks,
    };
  }
}
