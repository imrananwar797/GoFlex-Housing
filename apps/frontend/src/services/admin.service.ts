import { api } from './api';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProperty {
  id: string;
  name: string;
  city: string;
  state: string;
  owner_id: string;
  owner_name: string;
  monthly_price: number;
  isVerified: boolean;
  createdAt: string;
  totalReviews: number;
  avgRating: number;
}

export interface AdminBooking {
  id: string;
  user_id: string;
  property_id: string;
  property_name: string;
  user_name: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  status: string;
  createdAt: string;
}

export interface FraudAlert {
  id: string;
  user_id: string;
  type: string;
  severity: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface DashboardMetrics {
  users: {
    total_users: number;
    new_users_month: number;
    active_users: number;
  };
  properties: {
    total_properties: number;
    verified_properties: number;
    new_properties_month: number;
  };
  bookings: {
    total_bookings: number;
    active_bookings: number;
    completed_bookings: number;
  };
  revenue: {
    total_revenue: number;
    revenue_month: number;
    revenue_week: number;
  };
}

export const adminService = {
  // Dashboard
  async getDashboard(): Promise<{ data: DashboardMetrics }> {
    const response = await api.get('/api/analytics/dashboard');
    return response.data;
  },

  // Users
  async getUsers(params?: any): Promise<{ data: AdminUser[]; total: number }> {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  },

  async getUserDetails(userId: string): Promise<{ data: AdminUser }> {
    const response = await api.get(`/api/admin/users/${userId}`);
    return response.data;
  },

  async updateUser(userId: string, updates: Partial<AdminUser>): Promise<{ data: AdminUser }> {
    const response = await api.patch(`/api/admin/users/${userId}`, updates);
    return response.data;
  },

  // Properties
  async getProperties(params?: any): Promise<{ data: AdminProperty[]; total: number }> {
    const response = await api.get('/api/admin/properties', { params });
    return response.data;
  },

  async verifyProperty(propertyId: string): Promise<{ data: AdminProperty }> {
    const response = await api.patch(`/api/admin/properties/${propertyId}/verify`, { isVerified: true });
    return response.data;
  },

  // Bookings
  async getBookings(params?: any): Promise<{ data: AdminBooking[]; total: number }> {
    const response = await api.get('/api/admin/bookings', { params });
    return response.data;
  },

  async refundBooking(bookingId: string, reason: string): Promise<void> {
    await api.post(`/api/admin/bookings/${bookingId}/refund`, { reason });
  },

  // Fraud Alerts
  async getFraudAlerts(params?: any): Promise<{ data: FraudAlert[]; total: number }> {
    const response = await api.get('/api/admin/fraud-alerts', { params });
    return response.data;
  },

  async updateFraudAlert(alertId: string, status: string): Promise<void> {
    await api.patch(`/api/admin/fraud-alerts/${alertId}`, { status });
  },

  // System Health
  async getSystemHealth(): Promise<any> {
    const response = await api.get('/api/admin/system/health');
    return response.data;
  },
};
