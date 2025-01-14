export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  isDevelopment: import.meta.env.MODE === 'development'
}; 