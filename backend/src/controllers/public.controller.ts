import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { ContentRepository } from '../repositories/content.repository.js';
import { createEnquirySchema } from '../validators/enquiry.validator.js';

export const PublicController = {
  async getProfile(_req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await ContentRepository.getProfile();
      return res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: profile,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getServices(_req: Request, res: Response, next: NextFunction) {
    try {
      const services = await ContentRepository.getPublishedServices();
      return res.json({
        success: true,
        message: 'Services retrieved successfully',
        data: services,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getProgrammes(_req: Request, res: Response, next: NextFunction) {
    try {
      const programmes = await ContentRepository.getPublishedProgrammes();
      return res.json({
        success: true,
        message: 'Programmes retrieved successfully',
        data: programmes,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getCredentials(_req: Request, res: Response, next: NextFunction) {
    try {
      const credentials = await ContentRepository.getPublishedCredentials();
      return res.json({
        success: true,
        message: 'Credentials retrieved successfully',
        data: credentials,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getAudiences(_req: Request, res: Response, next: NextFunction) {
    try {
      const audiences = await ContentRepository.getPublishedAudiences();
      return res.json({
        success: true,
        message: 'Audience groups retrieved successfully',
        data: audiences,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getSiteSettings(_req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await ContentRepository.getAllSettings();
      const settingsMap = settings.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      return res.json({
        success: true,
        message: 'Settings retrieved successfully',
        data: settingsMap,
      });
    } catch (err) {
      return next(err);
    }
  },

  async createEnquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createEnquirySchema.parse(req.body);

      // Privacy-conscious IP hashing
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
      const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);

      const enquiry = await ContentRepository.createEnquiry({
        fullName: validatedData.fullName,
        organisation: validatedData.organisation,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        category: validatedData.category,
        areaOfInterest: validatedData.areaOfInterest,
        requirements: validatedData.requirements,
        ipHash,
        status: 'NEW',
      });

      return res.status(201).json({
        success: true,
        message: 'Your training enquiry has been submitted successfully. Subakeerthii MP will review and respond shortly.',
        data: {
          id: enquiry.id,
          createdAt: enquiry.createdAt,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
};
