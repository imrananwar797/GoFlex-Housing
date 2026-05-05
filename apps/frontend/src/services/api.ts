import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL || '').trim() || '/';

export const api = axios.create({
  baseURL,
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