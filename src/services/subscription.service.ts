const API_BASE = 'http://localhost:5000/api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  monthlyPrice: number;
  status: 'active' | 'paused' | 'cancelled';
  startDate: string;
  nextBillingDate: string;
  cancelledAt?: string;
  stripeSubscriptionId: string;
}

export interface SubscriptionHistory {
  id: string;
  planName: string;
  status: string;
  startDate: string;
  endDate?: string;
  totalAmount: number;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  status: string;
  billingDate: string;
  dueDate: string;
  pdfUrl: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const subscriptionService = {
  // Plans
  async getPlans(): Promise<{ data: SubscriptionPlan[] }> {
    const response = await fetch(`${API_BASE}/subscriptions/plans`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch subscription plans');
    return response.json();
  },

  // Current Subscription
  async getCurrentSubscription(): Promise<{ data: Subscription | null }> {
    const response = await fetch(`${API_BASE}/subscriptions/current`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch current subscription');
    return response.json();
  },

  // Create Subscription
  async createSubscription(
    planId: string,
    paymentMethodId: string
  ): Promise<{ data: Subscription; clientSecret?: string }> {
    const response = await fetch(`${API_BASE}/subscriptions/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        planId,
        paymentMethodId,
      }),
    });
    if (!response.ok) throw new Error('Failed to create subscription');
    return response.json();
  },

  // Pause Subscription
  async pauseSubscription(subscriptionId: string): Promise<{ data: Subscription }> {
    const response = await fetch(`${API_BASE}/subscriptions/${subscriptionId}/pause`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to pause subscription');
    return response.json();
  },

  // Resume Subscription
  async resumeSubscription(subscriptionId: string): Promise<{ data: Subscription }> {
    const response = await fetch(`${API_BASE}/subscriptions/${subscriptionId}/resume`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to resume subscription');
    return response.json();
  },

  // Cancel Subscription
  async cancelSubscription(subscriptionId: string): Promise<{ data: Subscription }> {
    const response = await fetch(`${API_BASE}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to cancel subscription');
    return response.json();
  },

  // History
  async getSubscriptionHistory(): Promise<{ data: SubscriptionHistory[] }> {
    const response = await fetch(`${API_BASE}/subscriptions/history`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch subscription history');
    return response.json();
  },

  // Invoices
  async getInvoices(): Promise<{ data: Invoice[] }> {
    const response = await fetch(`${API_BASE}/billing/invoices`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return response.json();
  },

  async downloadInvoice(invoiceId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE}/billing/invoices/${invoiceId}/pdf`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to download invoice');
    return response.blob();
  },
};
