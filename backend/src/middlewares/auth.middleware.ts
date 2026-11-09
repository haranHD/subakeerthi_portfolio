import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token.js';

/**
 * Resolves the authenticated user from either:
 * 1. Bearer Token in HTTP Authorization header (immune to cross-domain mobile cookie blocking)
 * 2. Express session cookie (subakeerthii.sid)
 */
export function resolveAuthUser(req: Request) {
  // 1. Prioritize Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        if (!req.session) {
          (req as any).session = {};
        }
        req.session.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        };
        return req.session.user;
      }
    }
  }

  // 2. Cookie session fallback
  if (req.session?.user) {
    return req.session.user;
  }

  return null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = resolveAuthUser(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Please log in to access this resource',
    });
  }
  return next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = resolveAuthUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required',
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient privileges',
      });
    }

    return next();
  };
}
