import { api } from './api';

export type Role = 'admin' | 'resident' | 'owner';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: Role;
  token?: string;
  full_name?: string;
  phone?: string;
  referral_code?: string;
  referred_by?: string;
  created_at?: string;
  goflex_score?: {
    overall_score: number;
    payment_score: number;
    compliance_score: number;
    complaint_score: number;
    verification_score: number;
    verification_badge: string;
    is_verified: boolean;
    maintenance_score?: number;
    responsiveness_score?: number;
  } | null;
  kyc?: {
    status: string;
    document_type: string;
  } | null;
  _count?: {
    bookings: number;
    complaints: number;
    owned_properties: number;
  };
}

export interface LoginResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  user?: any;
  requires_2fa: boolean;
  temp_token?: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/api/auth/login', { username, password });
    return response.data;
  },

  register: async (payload: any): Promise<any> => {
    const response = await api.post('/api/auth/register', payload);
    return response.data;
  },

  me: async (): Promise<AuthUser> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  changePassword: async (payload: any) => {
    const response = await api.post('/api/auth/change-password', payload);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  }
};
