const API_BASE = '/api';

export interface OwnerProperty {
  id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  monthly_price: number;
  beds: number;
  baths: number;
  amenities: string[];
  featured_image: string;
  totalViews: number;
  totalBookings: number;
  avgRating: number;
  totalReviews: number;
  occupancyRate: number;
  occupancy?: number;
  cover_image_url?: string;
  createdAt: string;
}

export interface OwnerBooking {
  id: string;
  property_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  status: string;
  createdAt: string;
}

export interface PropertyReview {
  id: string;
  property_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  response?: {
    id: string;
    responseText: string;
    createdAt: string;
  };
}

export interface PropertyRevenue {
  property_id: string;
  total_revenue: number;
  revenue_month: number;
  revenue_week: number;
  total_bookings: number;
  completed_bookings: number;
  avgBookingValue: number;
  occupancyRate: number;
}

const getAuthHeaders = () => {
  const raw = localStorage.getItem('goflex_auth_v1');
  let token = '';
  if (raw) {
    try {
      const user = JSON.parse(raw);
      token = user.token || '';
    } catch (e) {
      console.error('Failed to parse auth token');
    }
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const ownerService = {
  // Properties
  async getProperties(): Promise<{ data: OwnerProperty[] }> {
    const response = await fetch(`${API_BASE}/owner/properties`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch properties');
    return response.json();
  },

  async getPropertyDetails(propertyId: string): Promise<{ data: OwnerProperty & { analytics: any } }> {
    const response = await fetch(`${API_BASE}/owner/properties/${propertyId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch property details');
    return response.json();
  },

  async updateProperty(
    propertyId: string,
    updates: Partial<OwnerProperty>
  ): Promise<{ data: OwnerProperty }> {
    const response = await fetch(`${API_BASE}/owner/properties/${propertyId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update property');
    return response.json();
  },

  // Bookings
  async getPropertyBookings(
    propertyId: string,
    params?: { status?: string; page?: number; limit?: number }
  ): Promise<{ data: OwnerBooking[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(
      `${API_BASE}/owner/properties/${propertyId}/bookings?${queryParams.toString()}`,
      { headers: getAuthHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch property bookings');
    return response.json();
  },

  // Reviews
  async getPropertyReviews(propertyId: string): Promise<{ data: PropertyReview[] }> {
    const response = await fetch(`${API_BASE}/owner/properties/${propertyId}/reviews`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch property reviews');
    return response.json();
  },

  async replyToReview(
    reviewId: string,
    responseText: string
  ): Promise<{ data: PropertyReview }> {
    const response = await fetch(`${API_BASE}/owner/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ responseText }),
    });
    if (!response.ok) throw new Error('Failed to reply to review');
    return response.json();
  },

  // Revenue
  async getPropertyRevenue(propertyId: string): Promise<{ data: PropertyRevenue }> {
    const response = await fetch(`${API_BASE}/owner/properties/${propertyId}/revenue`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch property revenue');
    return response.json();
  },

  // Dashboard & Residents
  async getDashboardStats(): Promise<{ stats: any; recent_bookings: any[] }> {
    const response = await fetch(`${API_BASE}/owner/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  async getResidents(): Promise<{ data: any[] }> {
    const response = await fetch(`${API_BASE}/owner/residents`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch residents');
    return response.json();
  },

  async issueBill(bookingId: number, amount: number, description: string): Promise<any> {
    const response = await fetch(`${API_BASE}/owner/issue-bill`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ booking_id: bookingId, amount, description }),
    });
    if (!response.ok) throw new Error('Failed to issue bill');
    return response.json();
  },
};
