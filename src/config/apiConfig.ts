// src/config/apiConfig.ts

export const getApiUrl = (): string => {
  if (process.env.VUE_APP_API_URL) {
    return process.env.VUE_APP_API_URL;
  }
  console.warn('VUE_APP_API_URL not set, using default');
  return 'http://localhost:8989/api';
};
