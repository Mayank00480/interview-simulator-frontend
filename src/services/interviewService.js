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

/**
 * Create a new interview
 * Endpoint: POST http://localhost:3000/api/interviews
 */
export async function createInterview(interviewData) {
  try {
    const response = await api.post('/interviews', interviewData);
    return response.data;
  } catch (error) {
    console.error('Create interview API error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to create interview.';
    throw new Error(message);
  }
}

export async function getInterviewSessions(interviewId) {
  try {
    const response = await api.get(`/interviews/${interviewId}/sessions`);
    return response.data?.sessions || [];
  } catch (error) {
    console.error('Get interview sessions error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to fetch candidates for this interview.';
    throw new Error(message);
  }
}

/**
 * Generate questions for an interview
 * Endpoint: POST http://localhost:3000/api/interviews/:id/generate-questions
 */
export async function generateQuestions(interviewId) {
  try {
    const response = await api.post(`/interviews/${interviewId}/generate-questions`);
    return response.data;
  } catch (error) {
    console.error('Generate questions API error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to generate questions.';
    throw new Error(message);
  }
}

/**
 * Publish an interview
 * Endpoint: PATCH/PUT/POST http://localhost:3000/api/interviews/:id/publish
 */
export async function publishInterview(interviewId) {
  try {
    const response = await api.patch(`/interviews/${interviewId}/publish`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 405) {
      try {
        const responsePut = await api.put(`/interviews/${interviewId}/publish`);
        return responsePut.data;
      } catch (putErr) {
        if (putErr.response?.status === 404 || putErr.response?.status === 405) {
          const responsePost = await api.post(`/interviews/${interviewId}/publish`);
          return responsePost.data;
        }
        throw putErr;
      }
    }
    console.error('Publish interview API error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to publish interview.';
    throw new Error(message);
  }
}

export async function getSessionQuestions(sessionId) {
  try {
    const response = await api.get(`/sessions/${sessionId}/questions`);
    return response.data?.questions || [];
  } catch (error) {
    console.error('Get session questions error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to fetch questions for this session.';
    throw new Error(message);
  }
}

