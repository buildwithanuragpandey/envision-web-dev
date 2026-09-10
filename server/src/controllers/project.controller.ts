import { Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service.js';
import { AuthRequest } from '../types/index.js';

export class ProjectController {
  static async listProjects(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search, status, projectLeadId, myProjectsOnly } = req.query;

      const filters: any = {};
      if (search) filters.search = String(search);
      if (status) filters.status = String(status);
      if (projectLeadId) filters.projectLeadId = String(projectLeadId);
      if (myProjectsOnly !== undefined) filters.myProjectsOnly = myProjectsOnly === 'true';

      const projects = await ProjectService.listProjects(req.user!, filters);

      res.status(200).json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProjectById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const project = await ProjectService.getProjectById(id, req.user!);

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.createProject(req.body, req.user!);

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const updated = await ProjectService.updateProject(id, req.body, req.user!);

      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const result = await ProjectService.deleteProject(id, req.user!);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMembers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const members = await ProjectService.getMembers(id);

      res.status(200).json({
        success: true,
        data: members,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const { userId } = req.body;
      const result = await ProjectService.addMember(id, userId, req.user!);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const userId = String(req.params.userId);
      const result = await ProjectService.removeMember(id, userId, req.user!);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async setProjectLead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const { projectLeadId } = req.body;
      const updated = await ProjectService.setProjectLead(id, projectLeadId, req.user!);

      res.status(200).json({
        success: true,
        message: 'Project Lead updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
