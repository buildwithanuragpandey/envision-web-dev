import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types/index.js';
import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../utils/prisma.js';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. No token provided.',
      });
      return;
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        department: true,
        year: true,
        avatar: true,
        isActive: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found. Token is invalid.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        error: 'User account is deactivated. Please contact an administrator.',
      });
      return;
    }

    req.user = {
      ...user,
      role: user.role as UserRole,
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired authentication token.',
      });
      return;
    }
    next(error);
  }
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden: You do not have permission to perform this action. Required role: ${allowedRoles.join(' or ')}`,
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole('ADMIN');
export const requireLeadOrAdmin = requireRole('ADMIN', 'PROJECT_LEAD');
