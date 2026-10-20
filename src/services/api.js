import axios from 'axios';

// Base API URL pointing to the backend server
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Axios instance configured with credentials to send and accept HTTP-only cookies
 */
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send and accept cookies across origins
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle global errors and redirect on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const responseMessage = error.response?.data?.message;

    // If API returns 401 or "Authentication required", clear session and redirect to login
    if (status === 401 || responseMessage === 'Authentication required') {
      localStorage.removeItem('simulator_user');

      // Redirect if not already on the login page
      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = '/';
      }
    }

    const customError = {
      status,
      message:
        responseMessage ||
        error.response?.data?.error ||
        error.message ||
        'An unexpected error occurred. Please try again.',
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export default api;
