import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createProjectSchema,
  updateProjectSchema,
  addProjectMemberSchema,
  setProjectLeadSchema,
} from '../validators/project.validator.js';

const router = Router();

// All project routes require authentication
router.use(authenticate);

// Projects listing and retrieval
router.get('/', ProjectController.listProjects);
router.get('/:id', ProjectController.getProjectById);

// Create Project (Admin only)
router.post('/', requireAdmin, validate(createProjectSchema), ProjectController.createProject);

// Update Project (Admin or assigned Project Lead)
router.patch('/:id', validate(updateProjectSchema), ProjectController.updateProject);

// Delete Project (Admin only)
router.delete('/:id', requireAdmin, ProjectController.deleteProject);

// Members of a project
router.get('/:id/members', ProjectController.getMembers);
router.post('/:id/members', validate(addProjectMemberSchema), ProjectController.addMember);
router.delete('/:id/members/:userId', ProjectController.removeMember);

// Assign Project Lead (Admin only)
router.patch('/:id/lead', requireAdmin, validate(setProjectLeadSchema), ProjectController.setProjectLead);

export default router;
