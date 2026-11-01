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
 * Endpoint: POST http://localhost:3000/api/interviews/:id/publish
 */
export async function publishInterview(interviewId) {
  try {
    const response = await api.post(`/interviews/${interviewId}/publish`);
    return response.data;
  } catch (error) {
    console.error('Publish interview API error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to publish interview.';
    throw new Error(message);
  }
}

/**
 * Create a candidate session for an interview
 * Endpoint: POST http://localhost:3000/api/interviews/:interviewId/sessions
 * Body: { candidateName, candidateEmail, candidatePhone }
 */
export async function createCandidateSession(interviewId, candidateData) {
  try {
    const response = await api.post(`/interviews/${interviewId}/sessions`, candidateData);
    return response.data;
  } catch (error) {
    console.error('Create candidate session error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to create candidate session.';
    throw new Error(message);
  }
}

/**
 * Fetch a single interview by ID
 * Endpoint: GET http://localhost:3000/api/interviews/:interviewId
 */
export async function getInterviewById(interviewId) {
  try {
    const response = await api.get(`/interviews/${interviewId}`);
    return response.data?.interview || response.data;
  } catch (error) {
    console.error('Get interview by id error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to fetch interview details.';
    throw new Error(message);
  }
}

/**
 * Submit an answer for a session question
 * Endpoint: POST http://localhost:3000/api/sessions/:sessionId/answers
 * Body: { questionId, answer }
 */
export async function submitSessionAnswer(sessionId, { questionId, answer }) {
  try {
    const response = await api.post(`/sessions/${sessionId}/answers`, {
      questionId,
      answer,
    });
    return response.data;
  } catch (error) {
    console.error('Submit session answer error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to submit answer.';
    throw new Error(message);
  }
}

/**
 * Complete a candidate session
 * Endpoint: POST http://localhost:3000/api/sessions/:sessionId/complete
 */
export async function completeSession(sessionId) {
  try {
    const response = await api.post(`/sessions/${sessionId}/complete`);
    return response.data;
  } catch (error) {
    console.error('Complete session error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to complete interview session.';
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

/**
 * Add a question to an interview
 * Endpoint: POST http://localhost:3000/api/interviews/:id/questions
 * Body: { questionText, skill }
 */
export async function addInterviewQuestion(interviewId, questionData) {
  try {
    const response = await api.post(`/interviews/${interviewId}/questions`, questionData);
    return response.data;
  } catch (error) {
    console.error('Add interview question error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to add question.';
    throw new Error(message);
  }
}

/**
 * Delete a question from an interview
 * Endpoint: DELETE http://localhost:3000/api/interviews/:id/questions/:questionId
 */
export async function deleteInterviewQuestion(interviewId, questionId) {
  try {
    const response = await api.delete(`/interviews/${interviewId}/questions/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Delete interview question error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to delete question.';
    throw new Error(message);
  }
}

/**
 * Edit / Update an interview question
 * Endpoint: PUT or PATCH http://localhost:3000/api/interviews/:id/questions/:questionId
 * Body: { questionText, skill }
 */
export async function updateInterviewQuestion(interviewId, questionId, questionData) {
  try {
    // Try PUT first as specified
    const response = await api.put(`/interviews/${interviewId}/questions/${questionId}`, questionData);
    return response.data;
  } catch (error) {
    // Fallback to PATCH if PUT is not allowed or not found
    if (error.response?.status === 404 || error.response?.status === 405) {
      try {
        const patchResponse = await api.patch(`/interviews/${interviewId}/questions/${questionId}`, questionData);
        return patchResponse.data;
      } catch (patchErr) {
        throw patchErr;
      }
    }
    console.error('Update interview question error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to update question.';
    throw new Error(message);
  }
}

