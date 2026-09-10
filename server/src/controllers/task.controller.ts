import { Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service.js';
import { AuthRequest } from '../types/index.js';

export class TaskController {
  static async listTasks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search, status, priority, projectId, assignedToId, assignedToMe, dueFilter } = req.query;

      const filters: any = {};
      if (search) filters.search = String(search);
      if (status) filters.status = String(status);
      if (priority) filters.priority = String(priority);
      if (projectId) filters.projectId = String(projectId);
      if (assignedToId) filters.assignedToId = String(assignedToId);
      if (assignedToMe !== undefined) filters.assignedToMe = assignedToMe === 'true';
      if (dueFilter) filters.dueFilter = String(dueFilter);

      const tasks = await TaskService.listTasks(req.user!, filters);

      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const task = await TaskService.getTaskById(id, req.user!);

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.createTask(req.body, req.user!);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const updated = await TaskService.updateTask(id, req.body, req.user!);

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTaskStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      const updated = await TaskService.updateTaskStatus(id, status, req.user!);

      res.status(200).json({
        success: true,
        message: `Task status updated to ${status}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const result = await TaskService.deleteTask(id, req.user!);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
