import { api } from './api';

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface PaymentRequest {
  booking_id: number;
  amount: number;
  method: string;
}

export const paymentService = {
  getMethods: async () => {
    const response = await api.get('/api/payments/methods');
    return response.data;
  },

  initiatePayment: async (data: PaymentRequest) => {
    const response = await api.post('/api/payments/initiate', data);
    return response.data;
  },

  getEscrowStatus: async () => {
    const response = await api.get('/api/escrow/status');
    return response.data;
  },

  disputeEscrow: async (reason: string) => {
    const response = await api.post('/api/escrow/dispute', { reason });
    return response.data;
  },

  releaseEscrow: async (resident_user_id: number) => {
    const response = await api.post('/api/escrow/release', { resident_user_id });
    return response.data;
  }
};
