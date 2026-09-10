import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createUserSchema, updateUserSchema } from '../validators/user.validator.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Listing users is allowed for all authenticated users (to view teammates and assignees)
router.get('/', UserController.listUsers);
router.get('/:id', UserController.getUserById);

// Admin-only operations for creating, updating, and deleting members
router.post('/', requireAdmin, validate(createUserSchema), UserController.createUser);
router.patch('/:id', requireAdmin, validate(updateUserSchema), UserController.updateUser);
router.delete('/:id', requireAdmin, UserController.deleteUser);

export default router;
