/**
 * api.js — Placeholder/pass-through for localStorage mode
 * The app now uses localStorage via services directly.
 * This file is kept for future API integration compatibility.
 */

// No-op for localStorage mode
const api = {
  get: () => Promise.resolve({ data: {} }),
  post: () => Promise.resolve({ data: {} }),
  put: () => Promise.resolve({ data: {} }),
  patch: () => Promise.resolve({ data: {} }),
  delete: () => Promise.resolve({ data: {} }),
};

export default api;
