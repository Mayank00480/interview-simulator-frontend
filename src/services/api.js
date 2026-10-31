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

// Response interceptor to handle global errors and redirect on 401, 403, or access denied
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const responseMessage = error.response?.data?.message || error.response?.data?.error;

      // Check if error is 401, 403, or contains access denied
      const isAccessDenied =
        status === 401 ||
        status === 403 ||
        responseMessage === 'Authentication required' ||
        responseMessage === 'Access denied' ||
        (typeof responseMessage === 'string' &&
          /access\s*denied|forbidden|unauthorized/i.test(responseMessage));

      // Clear session and redirect to login page (skip redirect if on public candidate session page)
      if (isAccessDenied) {
        localStorage.removeItem('simulator_user');

        const isCandidatePath =
          window.location.pathname.includes('/candidate-session') ||
          window.location.pathname.includes('/interview-session');

        // Redirect if not already on the login page and not on candidate session page
        if (
          window.location.pathname !== '/' &&
          window.location.pathname !== '/login' &&
          !isCandidatePath
        ) {
          window.location.href = '/';
        }
      }

      const customError = {
        status,
        message:
          responseMessage ||
          error.message ||
          'An unexpected error occurred. Please try again.',
        data: error.response?.data,
      };
      return Promise.reject(customError);
    }
);

export default api;
