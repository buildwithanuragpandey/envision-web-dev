import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema, changePasswordSchema, updateProfileSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/login', validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.getCurrentUser);
router.post('/change-password', authenticate, validate(changePasswordSchema), AuthController.changePassword);
router.patch('/profile', authenticate, validate(updateProfileSchema), AuthController.updateProfile);

export default router;
