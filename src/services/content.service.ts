import { supabase, isSupabaseConfigured } from './supabaseClient';
import { fallbackPhotos, fallbackTestimonials, fallbackFaqs } from './sampleData';

export type GalleryPhoto = {
  id: number | string;
  property_id: string;
  image_url: string;
  alt: string | null;
};

export type TestimonialRecord = {
  id: number | string;
  resident_name: string;
  quote: string;
  avatar_url: string | null;
  city: string | null;
};

export type FaqRecord = {
  id: number | string;
  question: string;
  answer: string;
  category: string | null;
};

export async function fetchGalleryPhotos(limit = 10): Promise<GalleryPhoto[]> {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackPhotos.slice(0, limit);
  }

  const { data, error } = await supabase
    .from('property_photos')
    .select('*')
    .order('id', { ascending: true })
    .limit(limit);

  if (error || !data) {
    console.warn('Supabase photos fetch failed, using fallback data.', error);
    return fallbackPhotos.slice(0, limit);
  }

  return data;
}

export async function fetchTestimonials(limit = 6): Promise<TestimonialRecord[]> {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackTestimonials.slice(0, limit);
  }

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('id', { ascending: true })
    .limit(limit);

  if (error || !data) {
    console.warn('Supabase testimonials fetch failed, using fallback data.', error);
    return fallbackTestimonials.slice(0, limit);
  }

  return data;
}

export async function fetchFaqs(): Promise<FaqRecord[]> {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackFaqs;
  }

  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('id', { ascending: true });

  if (error || !data) {
    console.warn('Supabase FAQ fetch failed, using fallback data.', error);
    return fallbackFaqs;
  }

  return data;
}
