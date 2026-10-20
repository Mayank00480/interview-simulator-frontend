import api from './api';

/**
 * Fetch all interviews
 * Endpoint: GET http://localhost:3000/api/interviews
 * 
 * @param {Object} [params] - Optional query parameters (e.g. { page, limit, status, search })
 * @returns {Promise<any>} Response data containing the interviews list
 */
export async function getInterviews(params = {}) {
  try {
    const response = await api.get('/interviews', { params });
    return response.data;
  } catch (error) {
    console.error('Get interviews API error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to fetch interviews.';
    throw new Error(message);
  }
}
