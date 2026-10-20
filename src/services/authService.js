import api from './api';

/**
 * Register a new user
 * @param {Object} credentials - { username, email, password }
 * @returns {Promise<Object>} Response data
 */
export async function signupUser({ username, email, password }) {
  try {
    const response = await api.post('/users/signup', {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Signup API error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to create account. Please try again.';
    throw new Error(message);
  }
}

/**
 * Authenticate existing user
 * @param {Object} credentials - { username, email, password }
 * @returns {Promise<Object>} Response data
 */
export async function loginUser({ username, email, password }) {
  try {
    const response = await api.post('/users/login', {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to log in. Please check your credentials.';
    throw new Error(message);
  }
}

/**
 * Fetch authenticated user's profile
 * @returns {Promise<Object>} Response containing user object { user: { _id, username, email } }
 */
export async function getUserProfile() {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile API error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to fetch user profile.';
    throw new Error(message);
  }
}

/**
 * Log out user and clear session cookies
 * @returns {Promise<Object|void>}
 */
export async function logoutUser() {
  try {
    const response = await api.post('/users/logout');
    return response.data;
  } catch (error) {
    console.error('Logout API error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to log out.';
    console.warn('Backend logout warning:', message);
  } finally {
    // Ensure client cleanup happens regardless of API outcome
    localStorage.removeItem('simulator_user');
  }
}
