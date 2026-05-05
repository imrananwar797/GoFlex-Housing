import { api } from './api';

export interface KYCStatus {
  user_id: number;
  status: 'pending' | 'verified' | 'rejected' | 'none';
  document_type?: string;
  document_number?: string;
}

export const kycService = {
  async getKYCStatus(): Promise<KYCStatus> {
    const response = await api.get('/api/kyc/status');
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
  }
};
