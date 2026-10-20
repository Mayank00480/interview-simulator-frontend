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

// Response interceptor to normalize error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An unexpected error occurred. Please try again.',
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export default api;
