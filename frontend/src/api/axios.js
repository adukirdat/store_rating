import axios from 'axios';
import { normalizeApiError } from './apiError.js';
import { clearStoredAuth, getStoredAuth } from '../utils/authStorage.js';

const isIncorrectCurrentPassword = (error, normalizedError) => (
  error.config?.method === 'patch'
  && error.config?.url === '/auth/update-password'
  && normalizedError.status === 401
  && normalizedError.message === 'Current password is incorrect.'
);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const auth = getStoredAuth();

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeApiError(error);

    if (normalizedError.status === 401 && !isIncorrectCurrentPassword(error, normalizedError)) {
      clearStoredAuth();
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject(normalizedError);
  },
);

export default api;
