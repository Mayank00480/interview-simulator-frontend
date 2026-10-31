import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createCandidateSession, getInterviewById } from '../services';
import { useToast } from '../context/ToastContext';
import InterviewEnvironment from '../components/InterviewEnvironment';

export default function CandidateSessionPage() {
  const { interviewId } = useParams();
  const { showToast } = useToast();

  const [interview, setInterview] = useState(null);
  const [loadingInterview, setLoadingInterview] = useState(true);

  // Form fields
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');

  const [submitting, setSubmitting] = useState(false);

  // Active Session & Questions State
  const [activeSession, setActiveSession] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);

  // Fetch interview details on load
  useEffect(() => {
    let isMounted = true;
    async function fetchInterview() {
      if (!interviewId) return;
      try {
        const data = await getInterviewById(interviewId);
        if (isMounted && data) {
          setInterview(data);
        }
      } catch (err) {
        console.warn('Could not load interview details:', err);
      } finally {
        if (isMounted) setLoadingInterview(false);
      }
    }

    fetchInterview();
    return () => {
      isMounted = false;
    };
  }, [interviewId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!candidateName.trim() || !candidateEmail.trim()) {
      showToast('Please enter both your name and email address.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.trim(),
        candidatePhone: candidatePhone.trim(),
      };

      const result = await createCandidateSession(interviewId, payload);
      const sessionData = result?.session || result?.data || result;
      const questionsList = Array.isArray(result?.questions) ? result.questions : [];

      setActiveSession(sessionData);
      setSessionQuestions(questionsList);

      showToast(result?.message || 'Session started successfully!', 'success');
    } catch (err) {
      console.error('Session creation failed:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to start candidate session. Please check your information and try again.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // If session is active and has questions, transition into Interview Environment
  if (activeSession && sessionQuestions.length > 0) {
    return (
      <InterviewEnvironment
        session={activeSession}
        questions={sessionQuestions}
        interview={interview}
        onExit={() => {
          setActiveSession(null);
          setSessionQuestions([]);
        }}
      />
    );
  }

  return (
    <div className="candidate-session-page-wrapper">
      <div className="candidate-session-card">
        {/* Top Header */}
        <div className="candidate-session-header">
          <div className="cs-brand-badge">
            <span className="cs-brand-icon">🎙</span>
            <span>AI Interview Simulator</span>
          </div>
          <h1 className="cs-page-title">Candidate Interview Portal</h1>
          <p className="cs-page-subtitle">
            {interview?.jobRole
              ? `You have been invited to interview for ${interview.jobRole}`
              : 'Register your details to start your AI technical interview session'}
          </p>
        </div>

        {/* Interview summary preview */}
        {interview && (
          <div className="cs-interview-summary">
            <div className="cs-summary-main">
              <span className="cs-role-name">{interview.jobRole}</span>
              {interview.experienceLevel && (
                <span className="cs-level-pill">{interview.experienceLevel}</span>
              )}
            </div>
            <div className="cs-summary-meta">
              {interview.duration && <span>⏱ Duration: {interview.duration} mins</span>}
              {interview.questionCount && (
                <span>❓ {interview.questionCount} Questions</span>
              )}
            </div>
            {interview.skills && interview.skills.length > 0 && (
              <div className="cs-skills-row">
                <span className="cs-skills-label">Assessed Skills:</span>
                <div className="cs-skills-tags">
                  {interview.skills.map((skill) => (
                    <span key={skill} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="candidate-session-form">
          <div className="cs-form-intro">
            <h3>Enter Your Details to Begin</h3>
            <p>Please enter your information to start your AI interview assessment.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Mayank"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. mayanksharma1937@gmail.com"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g. 9191919191"
                value={candidatePhone}
                onChange={(e) => setCandidatePhone(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="submit-button cs-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="btn-spinner" />
                <span>Entering Interview Room...</span>
              </>
            ) : (
              <>
                <span>Start Interview Session</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="cs-footer">
          <span>Powered by AI Interview Simulator</span>
        </div>
      </div>
    </div>
  );
}
