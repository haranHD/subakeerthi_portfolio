import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { ContentRepository } from '../repositories/content.repository.js';
import { createEnquirySchema } from '../validators/enquiry.validator.js';
import { UPLOADS_DIR } from '../config/paths.js';

const NO_CACHE_HEADERS = 'no-store, no-cache, must-revalidate, private';

export const PublicController = {
  async getProfile(_req: Request, res: Response, next: NextFunction) {
    try {
      res.setHeader('Cache-Control', NO_CACHE_HEADERS);
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
      res.setHeader('Cache-Control', NO_CACHE_HEADERS);
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
      res.setHeader('Cache-Control', NO_CACHE_HEADERS);
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
      res.setHeader('Cache-Control', NO_CACHE_HEADERS);
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
      res.setHeader('Cache-Control', NO_CACHE_HEADERS);
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
      res.setHeader('Cache-Control', NO_CACHE_HEADERS);
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

  async getMediaList(_req: Request, res: Response, next: NextFunction) {
    try {
      res.setHeader('Cache-Control', NO_CACHE_HEADERS);
      const media = await ContentRepository.getAllMediaAssets();
      return res.json({
        success: true,
        message: 'Media assets retrieved successfully',
        data: media,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getMediaFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const asset = await ContentRepository.getMediaAssetById(id);

      if (!asset || !asset.storageUrl) {
        return res.status(404).json({ success: false, message: 'Media asset not found' });
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

      if (asset.storageUrl.startsWith('data:')) {
        const marker = ';base64,';
        const markerIdx = asset.storageUrl.indexOf(marker);
        if (markerIdx === -1) {
          return res.status(400).json({ success: false, message: 'Invalid embedded media encoding' });
        }
        const mimeType = asset.storageUrl.slice(5, markerIdx) || asset.mimeType || 'application/octet-stream';
        const base64Payload = asset.storageUrl.slice(markerIdx + marker.length);
        const buffer = Buffer.from(base64Payload, 'base64');

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', buffer.length.toString());
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.send(buffer);
      }

      if (asset.storageUrl.startsWith('http://') || asset.storageUrl.startsWith('https://')) {
        return res.redirect(asset.storageUrl);
      }

      // Legacy local upload path fallback
      const safeFileName = path.basename(asset.storageUrl);
      const candidatePath = path.join(UPLOADS_DIR, safeFileName);
      if (fs.existsSync(candidatePath)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.sendFile(candidatePath);
      }

      const publicPath = path.join(process.cwd(), 'public', safeFileName);
      if (fs.existsSync(publicPath)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.sendFile(publicPath);
      }

      return res.status(404).json({ success: false, message: 'Media binary file not found' });
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

      const formattedRequirements = validatedData.preferredLanguage
        ? `${validatedData.requirements}\n\n[Delivery Language: ${validatedData.preferredLanguage}]`
        : validatedData.requirements;

      const enquiry = await ContentRepository.createEnquiry({
        fullName: validatedData.fullName,
        organisation: validatedData.organisation,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        category: validatedData.category,
        areaOfInterest: validatedData.areaOfInterest,
        requirements: formattedRequirements,
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
