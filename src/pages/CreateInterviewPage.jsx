import React, { useState } from 'react';
import CreateInterviewForm from '../components/CreateInterviewForm';
import GenerateQuestionsPanel from '../components/GenerateQuestionsPanel';
import Stepper from '../components/Stepper';
import { createInterview } from '../services';
import { useToast } from '../context/ToastContext';

export default function CreateInterviewPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'generate'
  const [createdInterview, setCreatedInterview] = useState(null);
  const { showToast } = useToast();

  const handleInterviewSubmit = async (interviewData) => {
    setLoading(true);
    try {
      const response = await createInterview(interviewData);
      const successMessage = response?.message || 'Interview created successfully';
      showToast(successMessage, 'success');

      const interviewObj = response?.interview || response?.data || response;
      const interviewId =
        interviewObj?._id ||
        interviewObj?.id ||
        response?._id ||
        response?.id;

      const mergedInterview = {
        ...interviewData,
        ...(typeof interviewObj === 'object' ? interviewObj : {}),
        _id: interviewId,
      };

      setCreatedInterview(mergedInterview);
      // Seamlessly advance to Step 2: Generate Questions tab
      setActiveTab('generate');
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
    <div className="create-interview-layout ci-shell">
      <Stepper
        steps={[
          { key: 'create', title: 'Create Interview', description: 'Role, skills & settings' },
          {
            key: 'generate',
            title: 'Generate Questions',
            description: createdInterview ? 'AI question generation' : 'Locked until created',
          },
        ]}
        activeKey={activeTab}
        isComplete={(key) => key === 'create' && !!createdInterview}
        isLocked={(key) => key === 'generate' && !createdInterview}
        onStepClick={setActiveTab}
      />

      <div className="create-interview-page-wrapper">
        <div className="create-interview-main-column">
          {activeTab === 'create' ? (
            <CreateInterviewForm
              onSubmit={handleInterviewSubmit}
              loading={loading}
              initialData={createdInterview}
            />
          ) : (
            <GenerateQuestionsPanel
              interview={createdInterview}
            />
          )}
        </div>
      </div>
    </div>
  );
}
