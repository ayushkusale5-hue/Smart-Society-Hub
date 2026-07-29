import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    // Always prioritize the token from the Zustand store as it's the single source of truth
    const token = useAuthStore.getState().accessToken || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle global errors (like 401s)
api.interceptors.response.use(
  (response) => response.data, // Automatically unwrap response data!
  (error) => {
    // Handle global auth errors (e.g., token expired)
    if (error.response && error.response.status === 401) {
      // The token is invalid or expired (e.g. they have an old Phase 1 mock token)
      useAuthStore.getState().clearAuth();
      // Optionally reload or let the AuthGuard handle the redirect
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
