import { api } from './api';

export interface KYCStatus {
  user_id: number;
  status: 'pending' | 'verified' | 'rejected' | 'none';
  document_type?: string;
  document_number?: string;
  level?: 'basic' | 'verified' | 'premium' | string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  documentsApproved?: any[];
}

export interface KYCDocument {
  id: string | number;
  documentType: string;
  documentNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  rejectionReason?: string;
}

export const kycService = {
  async getKYCStatus(): Promise<any> {
    const response = await api.get('/api/kyc/status');
    return response.data;
  },

  async getDocuments(): Promise<any> {
    const response = await api.get('/api/kyc/documents');
    return response.data;
  },

  async uploadKYC(data: {
    document_type: string;
    document_number: string;
    document_url: string;
  }) {
    const response = await api.post('/api/kyc/upload', data);
    return response.data;
  },

  async uploadFile(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/kyc/upload-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async sendEmailVerificationCode(): Promise<any> {
    const response = await api.post('/api/kyc/send-email-code');
    return response.data;
  },

  async sendPhoneOTP(): Promise<any> {
    const response = await api.post('/api/kyc/send-phone-otp');
    return response.data;
  },

  async verifyEmail(code: string): Promise<any> {
    const response = await api.post('/api/kyc/verify-email', { code });
    return response.data;
  },

  async verifyPhone(code: string): Promise<any> {
    const response = await api.post('/api/kyc/verify-phone', { code });
    return response.data;
  }
};
