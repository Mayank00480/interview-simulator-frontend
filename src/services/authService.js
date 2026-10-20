import api from './api';

/**
 * Register a new user
 * @param {Object} credentials - { username, email, password }
 * @returns {Promise<Object>} Response data
 */
export async function signupUser({ username, email, password }) {
  const response = await api.post('/users/signup', {
    username,
    email,
    password,
  });
  return response.data;
}

/**
 * Authenticate existing user
 * @param {Object} credentials - { username, email, password }
 * @returns {Promise<Object>} Response data
 */
export async function loginUser({ username, email, password }) {
  const response = await api.post('/users/login', {
    username,
    email,
    password,
  });
  return response.data;
}

/**
 * Log out user and clear session cookies
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  try {
    await api.post('/users/logout');
  } catch (error) {
    // If logout endpoint is not implemented on backend, proceed with client cleanup
    console.warn('Backend logout warning:', error.message);
  } finally {
    localStorage.removeItem('simulator_user');
  }
}
