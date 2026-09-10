import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { AuthRequest } from '../types/index.js';

export class DashboardController {
  static async getAdminDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getAdminDashboard();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProjectLeadDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getProjectLeadDashboard(req.user!.id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMemberDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getMemberDashboard(req.user!.id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
