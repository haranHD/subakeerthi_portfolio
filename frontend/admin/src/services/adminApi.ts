import axios from 'axios';
import {
  User,
  DashboardData,
  Profile,
  Service,
  Programme,
  Credential,
  AudienceGroup,
  Enquiry,
  MediaAsset,
  SiteSetting,
  AuditLog,
} from '../types/admin';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const adminClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 10000,
});

export const adminApi = {
  // Auth
  async login(email: string, password: string): Promise<User> {
    const res = await adminClient.post('/auth/login', { email, password });
    return res.data.data.user;
  },

  async logout(): Promise<void> {
    await adminClient.post('/auth/logout');
  },

  async getMe(): Promise<User | null> {
    try {
      const res = await adminClient.get('/auth/me');
      return res.data.data.user;
    } catch {
      return null;
    }
  },

  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    const res = await adminClient.get('/admin/dashboard');
    return res.data.data;
  },

  // Profile
  async getProfile(): Promise<Profile> {
    const res = await adminClient.get('/admin/profile');
    return res.data.data;
  },

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    const res = await adminClient.put('/admin/profile', data);
    return res.data.data;
  },

  // Services
  async getServices(): Promise<Service[]> {
    const res = await adminClient.get('/admin/services');
    return res.data.data;
  },

  async createService(data: Partial<Service>): Promise<Service> {
    const res = await adminClient.post('/admin/services', data);
    return res.data.data;
  },

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    const res = await adminClient.put(`/admin/services/${id}`, data);
    return res.data.data;
  },

  async deleteService(id: string): Promise<void> {
    await adminClient.delete(`/admin/services/${id}`);
  },

  // Programmes
  async getProgrammes(): Promise<Programme[]> {
    const res = await adminClient.get('/admin/programmes');
    return res.data.data;
  },

  async createProgramme(data: Partial<Programme>): Promise<Programme> {
    const res = await adminClient.post('/admin/programmes', data);
    return res.data.data;
  },

  async updateProgramme(id: string, data: Partial<Programme>): Promise<Programme> {
    const res = await adminClient.put(`/admin/programmes/${id}`, data);
    return res.data.data;
  },

  async deleteProgramme(id: string): Promise<void> {
    await adminClient.delete(`/admin/programmes/${id}`);
  },

  // Credentials
  async getCredentials(): Promise<Credential[]> {
    const res = await adminClient.get('/admin/credentials');
    return res.data.data;
  },

  async createCredential(data: Partial<Credential>): Promise<Credential> {
    const res = await adminClient.post('/admin/credentials', data);
    return res.data.data;
  },

  async updateCredential(id: string, data: Partial<Credential>): Promise<Credential> {
    const res = await adminClient.put(`/admin/credentials/${id}`, data);
    return res.data.data;
  },

  async deleteCredential(id: string): Promise<void> {
    await adminClient.delete(`/admin/credentials/${id}`);
  },

  // Audiences
  async getAudiences(): Promise<AudienceGroup[]> {
    const res = await adminClient.get('/admin/audiences');
    return res.data.data;
  },

  async createAudience(data: Partial<AudienceGroup>): Promise<AudienceGroup> {
    const res = await adminClient.post('/admin/audiences', data);
    return res.data.data;
  },

  async updateAudience(id: string, data: Partial<AudienceGroup>): Promise<AudienceGroup> {
    const res = await adminClient.put(`/admin/audiences/${id}`, data);
    return res.data.data;
  },

  async deleteAudience(id: string): Promise<void> {
    await adminClient.delete(`/admin/audiences/${id}`);
  },

  // Enquiries
  async getEnquiries(status?: string): Promise<Enquiry[]> {
    const res = await adminClient.get('/admin/enquiries', {
      params: status ? { status } : undefined,
    });
    return res.data.data;
  },

  async updateEnquiryStatus(id: string, status: string, notes?: string): Promise<Enquiry> {
    const res = await adminClient.put(`/admin/enquiries/${id}/status`, { status, notes });
    return res.data.data;
  },

  // Media
  async getMedia(): Promise<MediaAsset[]> {
    const res = await adminClient.get('/admin/media');
    return res.data.data;
  },

  async uploadMedia(file: File, assetType: string): Promise<MediaAsset> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assetType', assetType);
    const res = await adminClient.post('/admin/media', formData);
    return res.data.data;
  },

  async deleteMedia(id: string): Promise<void> {
    await adminClient.delete(`/admin/media/${id}`);
  },

  // Settings
  async getSettings(): Promise<SiteSetting[]> {
    const res = await adminClient.get('/admin/settings');
    return res.data.data;
  },

  async updateSetting(key: string, value: string, description?: string): Promise<SiteSetting> {
    const res = await adminClient.put('/admin/settings', { key, value, description });
    return res.data.data;
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await adminClient.get('/admin/audit-logs');
    return res.data.data;
  },
};
