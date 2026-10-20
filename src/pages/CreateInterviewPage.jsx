import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateInterviewForm from '../components/CreateInterviewForm';
import { createInterview } from '../services';
import { useToast } from '../context/ToastContext';

export default function CreateInterviewPage() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleInterviewSubmit = async (interviewData) => {
    setLoading(true);
    try {
      const response = await createInterview(interviewData);
      const successMessage = response?.message || 'Interview created successfully';
      showToast(successMessage, 'success');

      // Navigate to interviews directory after short delay
      setTimeout(() => {
        navigate('/interviews');
      }, 1200);
    } catch (err) {
      console.error('Create interview error:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create interview. Please check your credentials and server.';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-interview-page-wrapper">
      <CreateInterviewForm onSubmit={handleInterviewSubmit} loading={loading} />
    </div>
  );
}
