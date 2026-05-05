import axios from 'axios';
import { createCircuitBreaker } from '../utils/circuitBreaker';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || 'goflex-internal-m2m-secret';

// Configure Axios with Interceptors
const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 5000,
  headers: {
    'X-Internal-Secret': INTERNAL_SECRET,
    'Content-Type': 'application/json'
  }
});

// Original Actions
const getRecommendationsAction = async (userId: number) => {
  const response = await aiClient.get('/api/recommendations', {
    params: { user_id: userId }
  });
  return response.data;
};

const verifyLivenessAction = async (videoData: any) => {
  const response = await aiClient.post('/api/biometrics/liveness', videoData);
  return response.data;
};

// Fallbacks
const recommendationFallback = () => {
  console.log('Serving default recommendations (AI Offline)');
  return { recommendations: [], source: 'cache/fallback' };
};

const livenessFallback = () => {
  throw new Error('Biometric service currently unavailable. Please try again later.');
};

// Breakers
const recommendationsBreaker = createCircuitBreaker(getRecommendationsAction, recommendationFallback);
const livenessBreaker = createCircuitBreaker(verifyLivenessAction, livenessFallback);

export const aiService = {
  getRecommendations: (userId: number) => recommendationsBreaker.fire(userId),
  verifyLiveness: (videoData: any) => livenessBreaker.fire(videoData)
};
