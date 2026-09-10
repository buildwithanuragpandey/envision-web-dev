import { Response, NextFunction } from 'express';
import { ActivityService } from '../services/activity.service.js';
import { AuthRequest } from '../types/index.js';

export class ActivityController {
  static async listActivities(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 25;
      const logs = await ActivityService.getRecentLogs(limit);

      res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  }
}
