import React, { useState } from 'react';
import CreateInterviewForm from '../components/CreateInterviewForm';
import GenerateQuestionsPanel from '../components/GenerateQuestionsPanel';
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
    <div className="create-interview-layout">
      {/* Stepper Tabs Bar */}
      <div className="interview-stepper-tabs" role="tablist" aria-label="Interview Creation Steps">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'create'}
          className={`stepper-tab-btn ${activeTab === 'create' ? 'active' : ''} ${createdInterview ? 'completed' : ''
            }`}
          onClick={() => setActiveTab('create')}
        >
          <span className="stepper-tab-num">
            {createdInterview ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              '1'
            )}
          </span>
          <div className="stepper-tab-text">
            <span className="stepper-tab-title">1. Create Interview</span>
            <span className="stepper-tab-desc">Job role, duration & skills</span>
          </div>
        </button>

        <div className="stepper-separator" />

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'generate'}
          className={`stepper-tab-btn ${activeTab === 'generate' ? 'active' : ''} ${!createdInterview ? 'disabled' : ''
            }`}
          onClick={() => createdInterview && setActiveTab('generate')}
          disabled={!createdInterview}
          title={
            !createdInterview
              ? 'Complete Step 1 (Create Interview) first'
              : 'Generate Questions'
          }
        >
          <span className="stepper-tab-num">2</span>
          <div className="stepper-tab-text">
            <span className="stepper-tab-title">2. Generate Questions</span>
            <span className="stepper-tab-desc">
              {!createdInterview ? 'Locked until created' : 'AI question generation'}
            </span>
          </div>
          {!createdInterview && (
            <span className="stepper-lock-icon" aria-hidden="true">
              🔒
            </span>
          )}
        </button>
      </div>

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
              onSwitchToCreate={() => setActiveTab('create')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
