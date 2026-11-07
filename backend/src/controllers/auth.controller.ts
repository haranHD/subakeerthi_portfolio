import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { loginSchema } from '../validators/auth.validator.js';
import { ContentRepository } from '../repositories/content.repository.js';

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
      const userId = req.session?.user?.id;
      if (userId) {
        await ContentRepository.logAction({
          adminUserId: userId,
          action: 'LOGOUT',
          entityType: 'AUTH',
          ipAddress: req.ip,
        });
      }

      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Logout failed',
          });
        }
        res.clearCookie('connect.sid');
        return res.json({
          success: true,
          message: 'Logout successful',
        });
      });
    } catch (err) {
      return next(err);
    }
  },

  async me(req: Request, res: Response) {
    if (!req.session?.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    return res.json({
      success: true,
      message: 'Current authenticated session',
      data: {
        user: req.session.user,
      },
    });
  },
};
