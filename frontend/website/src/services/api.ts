import axios from 'axios';
import {
  Profile,
  Service,
  Programme,
  Credential,
  AudienceGroup,
  EnquiryPayload,
  ApiResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 65000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry GET requests automatically if Render backend is waking up from cold sleep
apiClient.interceptors.response.use(
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
      return apiClient.request(config);
    }
    return Promise.reject(error);
  }
);

export const api = {
  async getProfile(): Promise<Profile | null> {
    try {
      const res = await apiClient.get<ApiResponse<Profile>>('/profile');
      return res.data.data;
    } catch {
      return null;
    }
  },

  async getServices(): Promise<Service[]> {
    try {
      const res = await apiClient.get<ApiResponse<Service[]>>('/services');
      return res.data.data;
    } catch {
      return [];
    }
  },

  async getProgrammes(): Promise<Programme[]> {
    try {
      const res = await apiClient.get<ApiResponse<Programme[]>>('/programmes');
      return res.data.data;
    } catch {
      return [];
    }
  },

  async getCredentials(): Promise<Credential[]> {
    try {
      const res = await apiClient.get<ApiResponse<Credential[]>>('/credentials');
      return res.data.data;
    } catch {
      return [];
    }
  },

  async getAudiences(): Promise<AudienceGroup[]> {
    try {
      const res = await apiClient.get<ApiResponse<AudienceGroup[]>>('/audiences');
      return res.data.data;
    } catch {
      return [];
    }
  },

  async getSiteSettings(): Promise<Record<string, string>> {
    try {
      const res = await apiClient.get<ApiResponse<Record<string, string>>>('/site-settings');
      return res.data.data;
    } catch {
      return {};
    }
  },

  async getMedia(): Promise<any[]> {
    try {
      const res = await apiClient.get<ApiResponse<any[]>>('/media');
      return res.data.data;
    } catch {
      return [];
    }
  },

  async submitEnquiry(payload: EnquiryPayload): Promise<ApiResponse<{ id: string }>> {
    const res = await apiClient.post<ApiResponse<{ id: string }>>('/enquiries', payload);
    return res.data;
  },
};
