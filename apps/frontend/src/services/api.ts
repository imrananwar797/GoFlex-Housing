import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('goflex_auth_v1');
  if (raw) {
    try {
      const user = JSON.parse(raw);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {}
  }
  return config;
});

api.interceptors.response.use(
  (res: any) => res,
  (error: any) => {
    return Promise.reject(error);
  }
);