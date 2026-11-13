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

const TOKEN_STORAGE_KEY = 'subakeerthii_admin_token';
const USER_STORAGE_KEY = 'subakeerthii_admin_user';

export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredAuth = (token: string, user: User): void => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
};

export const clearStoredAuth = (): void => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    // ignore
  }
};

export const adminClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 95000,
});

export const wakeBackend = async (): Promise<void> => {
  try {
    const backendBase = API_BASE.replace(/\/api\/v1\/?$/, '');
    await axios.get(`${backendBase}/health`, { timeout: 65000 });
  } catch {
    // Silent warm-up ping; ignore errors
  }
};

// Request Interceptor: Attach Authorization Bearer header
adminClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401 redirect and retry GET requests on Render cold-start timeouts
adminClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as any;
    const isTransient =
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_NETWORK' ||
      !error.response ||
      [502, 503, 504].includes(error.response?.status);

    if (
      config &&
      config.method?.toLowerCase() === 'get' &&
      isTransient &&
      (config._retryCount || 0) < 2
    ) {
      config._retryCount = (config._retryCount || 0) + 1;
      await new Promise((r) => setTimeout(r, 2000));
      return adminClient.request(config);
    }

    if (error.response?.status === 401) {
      clearStoredAuth();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?session_expired=1';
      }
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  // Auth
  async login(email: string, password: string): Promise<User> {
    const res = await adminClient.post('/auth/login', { email, password });
    const { user, token } = res.data.data;
    if (token && user) {
      setStoredAuth(token, user);
    }
    return user;
  },

  async logout(): Promise<void> {
    try {
      await adminClient.post('/auth/logout');
    } finally {
      clearStoredAuth();
    }
  },

  async getMe(): Promise<User | null> {
    try {
      const res = await adminClient.get('/auth/me');
      const user = res.data.data.user;
      if (user) {
        const token = getStoredToken();
        if (token) setStoredAuth(token, user);
      }
      return user;
    } catch {
      clearStoredAuth();
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
    const res = await adminClient.put('/admin/profile', data, { timeout: 120000 });
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

  async uploadMedia(
    file: File,
    metaOrType: string | { assetType?: string; title?: string; description?: string; location?: string; eventDate?: string },
    onProgress?: (percent: number) => void
  ): Promise<MediaAsset> {
    const formData = new FormData();
    formData.append('file', file);
    if (typeof metaOrType === 'string') {
      formData.append('assetType', metaOrType);
    } else {
      if (metaOrType.assetType) formData.append('assetType', metaOrType.assetType);
      if (metaOrType.title) formData.append('title', metaOrType.title);
      if (metaOrType.description) formData.append('description', metaOrType.description);
      if (metaOrType.location) formData.append('location', metaOrType.location);
      if (metaOrType.eventDate) formData.append('eventDate', metaOrType.eventDate);
    }
    const res = await adminClient.post('/admin/media', formData, {
      timeout: 180000, // 3 minutes timeout for large file uploads
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return res.data.data;
  },

  async updateMedia(
    id: string,
    data: {
      title?: string | null;
      description?: string | null;
      location?: string | null;
      eventDate?: string | null;
      assetType?: string;
    }
  ): Promise<MediaAsset> {
    const res = await adminClient.put(`/admin/media/${id}`, data);
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
