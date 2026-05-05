import { api } from './api';
import axios from 'axios';

export const integrationService = {
  // AI Recommendations
  getRecommendations: async () => {
    const response = await api.get('/api/recommendations');
    return response.data;
  },

  trainModel: async () => {
    const response = await api.post('/api/recommendations/train');
    return response.data;
  },

  // Video & Tours
  getMatterportTour: async (propertyId: number) => {
    const response = await api.get(`/api/video/matterport/${propertyId}`);
    return response.data;
  },

  processVideo: async (videoId: string) => {
    const response = await api.post(`/api/video/process/${videoId}`);
    return response.data;
  },

  // Cloud Storage (S3)
  getSignedUrl: async (filename: string) => {
    const response = await api.get('/api/storage/signed-url', {
      params: { filename }
    });
    return response.data;
  },

  uploadToS3: async (file: File) => {
    // 1. Get pre-signed URL
    const { url, method } = await integrationService.getSignedUrl(file.name);
    
    // 2. Upload directly to S3
    await axios({
      method,
      url,
      data: file,
      headers: {
        'Content-Type': file.type
      }
    });
    
    return url.split('?')[0]; // Return the clean URL
  }
};
