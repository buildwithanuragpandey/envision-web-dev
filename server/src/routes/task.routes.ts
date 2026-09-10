import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from '../validators/task.validator.js';

const router = Router();

// All task routes require authentication
router.use(authenticate);

router.get('/', TaskController.listTasks);
router.get('/:id', TaskController.getTaskById);

// Create task (Admin or Project Lead of that project handled in service)
router.post('/', validate(createTaskSchema), TaskController.createTask);

// Full update task (Admin or Project Lead of that project)
router.patch('/:id', validate(updateTaskSchema), TaskController.updateTask);

// Update status specifically (Admin, Project Lead, or Assigned Member)
router.patch('/:id/status', validate(updateTaskStatusSchema), TaskController.updateTaskStatus);

// Delete task (Admin or Project Lead of that project)
router.delete('/:id', TaskController.deleteTask);

export default router;
