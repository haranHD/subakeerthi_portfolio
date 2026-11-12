import { prisma } from '../config/database.js';

export const ContentRepository = {
  // Profile
  async getProfile() {
    return prisma.profile.findFirst();
  },

  async updateProfile(id: string, data: any) {
    return prisma.profile.update({
      where: { id },
      data,
    });
  },

  // Services
  async getPublishedServices() {
    return prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  async getAllServices() {
    return prisma.service.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  async createService(data: any) {
    return prisma.service.create({ data });
  },

  async updateService(id: string, data: any) {
    return prisma.service.update({
      where: { id },
      data,
    });
  },

  async deleteService(id: string) {
    return prisma.service.delete({ where: { id } });
  },

  // Programmes
  async getPublishedProgrammes() {
    return prisma.programme.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  async getAllProgrammes() {
    return prisma.programme.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  async createProgramme(data: any) {
    return prisma.programme.create({ data });
  },

  async updateProgramme(id: string, data: any) {
    return prisma.programme.update({
      where: { id },
      data,
    });
  },

  async deleteProgramme(id: string) {
    return prisma.programme.delete({ where: { id } });
  },

  // Credentials
  async getPublishedCredentials() {
    return prisma.credential.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  async getAllCredentials() {
    return prisma.credential.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  async createCredential(data: any) {
    return prisma.credential.create({ data });
  },

  async updateCredential(id: string, data: any) {
    return prisma.credential.update({
      where: { id },
      data,
    });
  },

  async deleteCredential(id: string) {
    return prisma.credential.delete({ where: { id } });
  },

  // Audiences
  async getPublishedAudiences() {
    return prisma.audienceGroup.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  async getAllAudiences() {
    return prisma.audienceGroup.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  async createAudience(data: any) {
    return prisma.audienceGroup.create({ data });
  },

  async updateAudience(id: string, data: any) {
    return prisma.audienceGroup.update({
      where: { id },
      data,
    });
  },

  async deleteAudience(id: string) {
    return prisma.audienceGroup.delete({ where: { id } });
  },

  // Enquiries
  async createEnquiry(data: any) {
    return prisma.enquiry.create({ data });
  },

  async getEnquiries(filter?: { status?: string }) {
    return prisma.enquiry.findMany({
      where: filter?.status ? { status: filter.status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  },

  async getEnquiryById(id: string) {
    return prisma.enquiry.findUnique({ where: { id } });
  },

  async updateEnquiryStatus(id: string, status: string, notes?: string) {
    return prisma.enquiry.update({
      where: { id },
      data: {
        status,
        ...(notes !== undefined ? { notes } : {}),
      },
    });
  },

  // Site Settings
  async getAllSettings() {
    return prisma.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });
  },

  async updateSetting(key: string, value: string, description?: string) {
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  },

  // Media
  async createMediaAsset(data: any) {
    return prisma.mediaAsset.create({ data });
  },

  async getMediaAssetById(id: string) {
    return prisma.mediaAsset.findUnique({ where: { id } });
  },

  async getAllMediaAssets() {
    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        originalName: true,
        mimeType: true,
        size: true,
        assetType: true,
        createdAt: true,
      },
    });
    return assets.map((asset) => ({
      ...asset,
      storageUrl: `/api/v1/media/${asset.id}/file`,
    }));
  },

  async deleteMediaAsset(id: string) {
    return prisma.mediaAsset.delete({ where: { id } });
  },

  // Audit Logs
  async logAction(data: {
    adminUserId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    details?: any;
    ipAddress?: string;
  }) {
    return prisma.auditLog.create({ data });
  },

  async getAuditLogs(limit = 50) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        adminUser: {
          select: { email: true, role: true },
        },
      },
    });
  },

  // Dashboard Metrics
  async getDashboardMetrics() {
    const [
      totalEnquiries,
      newEnquiries,
      pendingEnquiries,
      respondedEnquiries,
      totalServices,
      totalProgrammes,
      recentEnquiries,
      recentLogs,
    ] = await Promise.all([
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: 'NEW' } }),
      prisma.enquiry.count({ where: { status: 'PENDING' } }),
      prisma.enquiry.count({ where: { status: 'RESPONDED' } }),
      prisma.service.count({ where: { isPublished: true } }),
      prisma.programme.count({ where: { isPublished: true } }),
      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { adminUser: { select: { email: true } } },
      }),
    ]);

    return {
      metrics: {
        totalEnquiries,
        newEnquiries,
        pendingEnquiries,
        respondedEnquiries,
        totalServices,
        totalProgrammes,
      },
      recentEnquiries,
      recentLogs,
    };
  },
};
