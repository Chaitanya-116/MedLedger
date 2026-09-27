export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
} as const;

export const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
} as const;
