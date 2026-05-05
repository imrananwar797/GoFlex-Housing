import { api } from './api';

type BedsType = 'Single' | 'Double' | 'Triple';

export type PropertyRecord = {
  id: string;
  name: string;
  slug?: string;
  state_iso: string;
  city: string;
  address?: string | null;
  rent: number;
  beds: BedsType;
  occupancy: number;
  rating?: number | null;
  cover_image_url: string;
  description?: string;
};

export type PropertyFilter = {
  stateIso?: string;
  city?: string;
  minRent?: number;
  maxRent?: number;
  beds?: BedsType | 'All';
  search?: string;
};

export async function fetchProperties(filter: PropertyFilter = {}): Promise<PropertyRecord[]> {
  try {
    const response = await api.get('/api/properties', { params: filter });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch properties from API', error);
    return [];
  }
}

export async function fetchPropertyById(id: string): Promise<PropertyRecord | null> {
  try {
    const response = await api.get(`/api/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch property ${id}`, error);
    return null;
  }
}
