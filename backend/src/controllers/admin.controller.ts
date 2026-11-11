import { Request, Response, NextFunction } from 'express';
import { ContentRepository } from '../repositories/content.repository.js';
import {
  serviceSchema,
  programmeSchema,
  credentialSchema,
  audienceSchema,
  siteSettingSchema,
} from '../validators/content.validator.js';
import { updateProfileSchema } from '../validators/auth.validator.js';
import { updateEnquiryStatusSchema } from '../validators/enquiry.validator.js';

export const AdminController = {
  // Dashboard Metrics
  async getDashboardMetrics(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ContentRepository.getDashboardMetrics();
      return res.json({
        success: true,
        message: 'Dashboard metrics retrieved',
        data,
      });
    } catch (err) {
      return next(err);
    }
  },

  // Profile
  async getProfile(_req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await ContentRepository.getProfile();
      return res.json({
        success: true,
        message: 'Profile retrieved',
        data: profile,
      });
    } catch (err) {
      return next(err);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const existing = await ContentRepository.getProfile();
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }
      const validated = updateProfileSchema.parse(req.body);
      const updated = await ContentRepository.updateProfile(existing.id, validated);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'UPDATE',
        entityType: 'PROFILE',
        entityId: existing.id,
      });

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  },

  // Services CRUD
  async getServices(_req: Request, res: Response, next: NextFunction) {
    try {
      const services = await ContentRepository.getAllServices();
      return res.json({
        success: true,
        message: 'All services retrieved',
        data: services,
      });
    } catch (err) {
      return next(err);
    }
  },

  async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = serviceSchema.parse(req.body);
      const slug = validated.slug || validated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const service = await ContentRepository.createService({ ...validated, slug });

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'CREATE',
        entityType: 'SERVICE',
        entityId: service.id,
      });

      return res.status(201).json({
        success: true,
        message: 'Service created successfully',
        data: service,
      });
    } catch (err) {
      return next(err);
    }
  },

  async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = serviceSchema.partial().parse(req.body);
      const updated = await ContentRepository.updateService(id, validated);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'UPDATE',
        entityType: 'SERVICE',
        entityId: id,
      });

      return res.json({
        success: true,
        message: 'Service updated successfully',
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  },

  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ContentRepository.deleteService(id);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'DELETE',
        entityType: 'SERVICE',
        entityId: id,
      });

      return res.json({
        success: true,
        message: 'Service deleted successfully',
      });
    } catch (err) {
      return next(err);
    }
  },

  // Programmes CRUD
  async getProgrammes(_req: Request, res: Response, next: NextFunction) {
    try {
      const programmes = await ContentRepository.getAllProgrammes();
      return res.json({
        success: true,
        message: 'All programmes retrieved',
        data: programmes,
      });
    } catch (err) {
      return next(err);
    }
  },

  async createProgramme(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = programmeSchema.parse(req.body);
      const slug = validated.slug || validated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const programme = await ContentRepository.createProgramme({ ...validated, slug });

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'CREATE',
        entityType: 'PROGRAMME',
        entityId: programme.id,
      });

      return res.status(201).json({
        success: true,
        message: 'Programme created successfully',
        data: programme,
      });
    } catch (err) {
      return next(err);
    }
  },

  async updateProgramme(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = programmeSchema.partial().parse(req.body);
      const updated = await ContentRepository.updateProgramme(id, validated);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'UPDATE',
        entityType: 'PROGRAMME',
        entityId: id,
      });

      return res.json({
        success: true,
        message: 'Programme updated successfully',
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  },

  async deleteProgramme(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ContentRepository.deleteProgramme(id);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'DELETE',
        entityType: 'PROGRAMME',
        entityId: id,
      });

      return res.json({
        success: true,
        message: 'Programme deleted successfully',
      });
    } catch (err) {
      return next(err);
    }
  },

  // Credentials CRUD
  async getCredentials(_req: Request, res: Response, next: NextFunction) {
    try {
      const credentials = await ContentRepository.getAllCredentials();
      return res.json({
        success: true,
        message: 'All credentials retrieved',
        data: credentials,
      });
    } catch (err) {
      return next(err);
    }
  },

  async createCredential(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = credentialSchema.parse(req.body);
      const cred = await ContentRepository.createCredential(validated);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'CREATE',
        entityType: 'CREDENTIAL',
        entityId: cred.id,
      });

      return res.status(201).json({
        success: true,
        message: 'Credential created successfully',
        data: cred,
      });
    } catch (err) {
      return next(err);
    }
  },

  async updateCredential(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = credentialSchema.partial().parse(req.body);
      const updated = await ContentRepository.updateCredential(id, validated);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'UPDATE',
        entityType: 'CREDENTIAL',
        entityId: id,
      });

      return res.json({
        success: true,
        message: 'Credential updated successfully',
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  },

  async deleteCredential(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ContentRepository.deleteCredential(id);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'DELETE',
        entityType: 'CREDENTIAL',
        entityId: id,
      });

      return res.json({
        success: true,
        message: 'Credential deleted successfully',
      });
    } catch (err) {
      return next(err);
    }
  },

  // Audiences CRUD
  async getAudiences(_req: Request, res: Response, next: NextFunction) {
    try {
      const audiences = await ContentRepository.getAllAudiences();
      return res.json({
        success: true,
        message: 'All audience groups retrieved',
        data: audiences,
      });
    } catch (err) {
      return next(err);
    }
  },

  async createAudience(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = audienceSchema.parse(req.body);
      const aud = await ContentRepository.createAudience(validated);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'CREATE',
        entityType: 'AUDIENCE',
        entityId: aud.id,
      });

      return res.status(201).json({
        success: true,
        message: 'Audience group created successfully',
        data: aud,
      });
    } catch (err) {
      return next(err);
    }
  },

  async updateAudience(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = audienceSchema.partial().parse(req.body);
      const updated = await ContentRepository.updateAudience(id, validated);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'UPDATE',
        entityType: 'AUDIENCE',
        entityId: id,
      });

      return res.json({
        success: true,
        message: 'Audience group updated successfully',
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  },

  async deleteAudience(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ContentRepository.deleteAudience(id);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'DELETE',
        entityType: 'AUDIENCE',
        entityId: id,
      });

      return res.json({
        success: true,
        message: 'Audience group deleted successfully',
      });
    } catch (err) {
      return next(err);
    }
  },

  // Enquiries
  async getEnquiries(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string | undefined;
      const enquiries = await ContentRepository.getEnquiries(status ? { status } : undefined);
      return res.json({
        success: true,
        message: 'Enquiries retrieved',
        data: enquiries,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getEnquiryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const enquiry = await ContentRepository.getEnquiryById(id);
      if (!enquiry) {
        return res.status(404).json({ success: false, message: 'Enquiry not found' });
      }
      return res.json({
        success: true,
        message: 'Enquiry retrieved',
        data: enquiry,
      });
    } catch (err) {
      return next(err);
    }
  },

  async updateEnquiryStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, notes } = updateEnquiryStatusSchema.parse(req.body);
      const updated = await ContentRepository.updateEnquiryStatus(id, status, notes);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'UPDATE_STATUS',
        entityType: 'ENQUIRY',
        entityId: id,
        details: { status, notes },
      });

      return res.json({
        success: true,
        message: 'Enquiry status updated successfully',
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  },

  // Media Management
  async uploadMedia(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      // Convert file buffer directly into persistent base64 Data URI
      // Stored inside the Supabase cloud database, immune to Render container wipe!
      const base64 = req.file.buffer.toString('base64');
      const storageUrl = `data:${req.file.mimetype};base64,${base64}`;
      const assetType = (req.body.assetType as string) || 'OTHER';

      const asset = await ContentRepository.createMediaAsset({
        fileName: req.file.originalname,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        storageUrl,
        assetType,
      });

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'UPLOAD',
        entityType: 'MEDIA',
        entityId: asset.id,
      });

      return res.status(201).json({
        success: true,
        message: 'File uploaded and permanently saved in database',
        data: asset,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getMediaList(_req: Request, res: Response, next: NextFunction) {
    try {
      const assets = await ContentRepository.getAllMediaAssets();
      return res.json({
        success: true,
        message: 'Media assets retrieved',
        data: assets,
      });
    } catch (err) {
      return next(err);
    }
  },

  async deleteMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ContentRepository.deleteMediaAsset(id);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'DELETE',
        entityType: 'MEDIA',
        entityId: id,
      });

      return res.json({
        success: true,
        message: 'Media asset deleted successfully',
      });
    } catch (err) {
      return next(err);
    }
  },

  // Settings
  async getSettings(_req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await ContentRepository.getAllSettings();
      return res.json({
        success: true,
        message: 'Settings retrieved',
        data: settings,
      });
    } catch (err) {
      return next(err);
    }
  },

  async updateSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value, description } = siteSettingSchema.parse(req.body);
      const updated = await ContentRepository.updateSetting(key, value, description);

      await ContentRepository.logAction({
        adminUserId: req.session.user?.id,
        action: 'UPDATE',
        entityType: 'SETTING',
        entityId: key,
      });

      return res.json({
        success: true,
        message: 'Setting updated successfully',
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  },

  // Audit Logs
  async getAuditLogs(_req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await ContentRepository.getAuditLogs(100);
      return res.json({
        success: true,
        message: 'Audit logs retrieved',
        data: logs,
      });
    } catch (err) {
      return next(err);
    }
  },
};
