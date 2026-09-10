import { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { AuthRequest } from '../types/index.js';

export class UserController {
  static async listUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search, role, department, isActive } = req.query;

      const filters: any = {};
      if (search) filters.search = String(search);
      if (role) filters.role = String(role);
      if (department) filters.department = String(department);
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const users = await UserService.listUsers(filters);

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const user = await UserService.getUserById(id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body, req.user?.id);

      res.status(201).json({
        success: true,
        message: 'Member created successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const updated = await UserService.updateUser(id, req.body, req.user?.id);

      res.status(200).json({
        success: true,
        message: 'Member updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const result = await UserService.deleteUser(id, req.user?.id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
