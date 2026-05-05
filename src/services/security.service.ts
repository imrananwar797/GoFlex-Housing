import { api } from './api';

export const securityService = {
  // 2FA Endpoints
  setup2FA: async () => {
    const response = await api.post('/api/auth/2fa/setup');
    return response.data;
  },

  verify2FA: async (code: string) => {
    const response = await api.post('/api/auth/2fa/verify', null, {
      params: { code }
    });
    return response.data;
  },

  validateLogin2FA: async (code: string, tempToken: string) => {
    const response = await api.post('/api/auth/2fa/validate-login', {
      code,
      temp_token: tempToken
    });
    return response.data;
  },

  disable2FA: async (otp: string) => {
    const response = await api.post('/api/auth/2fa/disable', { otp });
    return response.data;
  },

  get2FAStatus: async () => {
    const response = await api.get('/api/auth/2fa/status');
    return response.data;
  },

  // Fraud Alerts (Admin)
  getFraudAlerts: async (severity?: string, status: string = 'open') => {
    const response = await api.get('/api/fraud-alerts', {
      params: { severity, status }
    });
    return response.data;
  },

  investigateAlert: async (alertId: number) => {
    const response = await api.post(`/api/fraud-alerts/${alertId}/investigate`);
    return response.data;
  },

  resolveAlert: async (alertId: number, status: 'resolved' | 'false_positive') => {
    const response = await api.post(`/api/fraud-alerts/${alertId}/resolve`, { status });
    return response.data;
  }
};
