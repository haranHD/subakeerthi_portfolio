import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { loginSchema } from '../validators/auth.validator.js';
import { ContentRepository } from '../repositories/content.repository.js';
import { generateToken } from '../utils/token.js';
import { resolveAuthUser } from '../middlewares/auth.middleware.js';

export const AuthController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await prisma.adminUser.findUnique({
        where: { email },
      });

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      if (!req.session) {
        (req as any).session = {};
      }
      req.session.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      await ContentRepository.logAction({
        adminUserId: user.id,
        action: 'LOGIN',
        entityType: 'AUTH',
        ipAddress: req.ip,
      });

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (err) {
      return next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = resolveAuthUser(req);
      if (user?.id) {
        await ContentRepository.logAction({
          adminUserId: user.id,
          action: 'LOGOUT',
          entityType: 'AUTH',
          ipAddress: req.ip,
        });
      }

      if (req.session && typeof req.session.destroy === 'function') {
        req.session.destroy((_err) => {});
      }
      res.clearCookie('subakeerthii.sid');
      res.clearCookie('connect.sid');

      return res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (err) {
      return next(err);
    }
  },

  async me(req: Request, res: Response) {
    const user = resolveAuthUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    return res.json({
      success: true,
      message: 'Current authenticated session',
      data: {
        user,
      },
    });
  },
};
