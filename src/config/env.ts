// Environment configuration
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://postman-echo.com',
  isDev: import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
