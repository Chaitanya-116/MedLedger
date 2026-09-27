export const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  APP_NAME: 'MedLedger',
  APP_VERSION: '1.0.0',
  ENV: import.meta.env.MODE || 'development',
} as const;
