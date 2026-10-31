import React, { useState } from 'react';
import { generateQuestions, publishInterview } from '../services';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';

export default function GenerateQuestionsPanel({ interview }) {
  const [questions, setQuestions] = useState(interview?.questions || []);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(interview?.status === 'PUBLISHED');
  const [copiedLink, setCopiedLink] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const interviewId = interview?._id || interview?.id;
  const sessionUrl = interviewId ? `${window.location.origin}/candidate-session/${interviewId}` : '';

  const handleCopyLink = () => {
    if (!sessionUrl) return;
    navigator.clipboard?.writeText(sessionUrl);
    setCopiedLink(true);
    showToast('Candidate session URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleGenerate = async () => {
    if (!interviewId) {
      showToast('Interview ID not found. Please create the interview again.', 'error');
      return;
    }

    setGenerating(true);
    try {
      const response = await generateQuestions(interviewId);
      const items = Array.isArray(response?.questions) ? response.questions : [];
      setQuestions(items);
      showToast(response?.message || 'Questions generated successfully!', 'success');
    } catch (err) {
      console.error('Generate questions error:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to generate questions. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!interviewId) {
      showToast('Interview ID not found.', 'error');
      return;
    }

    setPublishing(true);
    try {
      const response = await publishInterview(interviewId);
      setIsPublished(true);
      showToast(response?.message || 'Interview published successfully! Session URL is now available to share.', 'success');
    } catch (err) {
      console.error('Publish interview error:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to publish interview.';
      showToast(errorMessage, 'error');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <section className="create-interview-card generate-questions-card" aria-label="Generate Questions">
      <div className="gqp-top-nav">
        <Link to="/interviews" className="back-link">
          ← Back to Interviews
        </Link>
      </div>

      {/* Header */}
      <div className="create-header">
        <div className="gqp-header-title-row">
          <h2>Generate Questions</h2>
          {isPublished && (
            <span className="gqp-status-badge published">✓ Published</span>
          )}
        </div>
        <p>AI will generate tailored technical interview questions based on your role and skills.</p>
      </div>

      {/* Interview Summary Card */}
      <div className="gqp-summary-banner">
        <div className="gqp-summary-info">
          <div className="gqp-summary-role">
            <span className="gqp-label">Job Role:</span>
            <strong>{interview?.jobRole || 'Not specified'}</strong>
            <span className="gqp-level-pill">{interview?.experienceLevel || 'Fresher'}</span>
          </div>
          <div className="gqp-summary-meta">
            {interview?.duration && <span>⏱ {interview.duration} mins</span>}
            {interview?.questionCount && <span>❓ {interview.questionCount} Questions</span>}
          </div>
        </div>

        {interview?.skills && interview.skills.length > 0 && (
          <div className="gqp-summary-skills">
            <span className="gqp-label">Target Skills:</span>
            <div className="skills-tags-wrap">
              {interview.skills.map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Candidate Session URL Box (Visible ONLY after interview is published) */}
      {interviewId && isPublished && (
        <div className="gqp-share-session-card">
          <div className="gqp-share-header">
            <span className="gqp-share-icon">🔗</span>
            <div className="gqp-share-text">
              <strong>Candidate Session URL</strong>
              <p>Direct link for candidates to register and take this technical interview.</p>
            </div>
          </div>
          <div className="gqp-share-input-row">
            <input
              type="text"
              readOnly
              value={sessionUrl}
              className="gqp-share-input"
              onClick={(e) => e.target.select()}
            />
            <button
              type="button"
              className="gqp-share-copy-btn"
              onClick={handleCopyLink}
            >
              {copiedLink ? '✓ Copied' : 'Copy Session URL'}
            </button>
            <a
              href={sessionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gqp-share-open-btn"
              title="Open session portal in new tab"
            >
              Open ↗
            </a>
          </div>
        </div>
      )}

      {/* When no questions yet */}
      {questions.length === 0 && (
        <div className="gqp-empty-state">
          <div className="gqp-empty-icon-wrap">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2f6bff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <h3>Ready to Generate Questions</h3>
          <p>
            Generate smart, role-aligned technical questions for this interview using our AI engine.
          </p>
          <button
            type="button"
            className="submit-button gqp-main-generate-btn"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <>
                <span className="btn-spinner" />
                <span>Generating Questions...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span>Generate Questions with AI</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Questions list display */}
      {questions.length > 0 && (
        <div className="gqp-questions-section">
          <div className="gqp-questions-header-bar">
            <div className="gqp-qh-left">
              <span className="gqp-count-pill">{questions.length} Questions</span>
              <span className="gqp-qh-subtitle">Generated technical questions</span>
            </div>
          </div>

          <div className="gqp-questions-container">
                    {questions.map((q, idx) => (
                      <div key={q._id || idx} className="gqp-question-card">
                        <div className="gqp-qc-header">
                          <div className="gqp-qc-number">
                            <span>Q{q.order || idx + 1}</span>
                          </div>
                          {q.skill && (
                            <span className="gqp-qc-skill-tag">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="2" />
                              </svg>
                              {q.skill}
                            </span>
                          )}
                        </div>
                        <div className="gqp-qc-body">
                          <p className="gqp-qc-text">{q.questionText}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Publish Interview Banner */}
                  <div className={`gqp-publish-box ${isPublished ? 'published-box' : ''}`}>
                    <div className="gqp-pb-content">
                      <div className="gqp-pb-icon">
                        {isPublished ? '✓' : '🚀'}
                      </div>
                      <div className="gqp-pb-text">
                        <strong>{isPublished ? 'Interview Published!' : 'Ready to Publish'}</strong>
                        <p>
                          {isPublished
                            ? 'This interview is published and ready for candidate invitations.'
                            : 'Publish this interview to activate it and allow candidates to participate.'}
                        </p>
                      </div>
                    </div>

                    <div className="gqp-pb-actions">
                      {!isPublished ? (
                        <button
                          type="button"
                          className="submit-button gqp-publish-action-btn"
                          onClick={handlePublish}
                          disabled={publishing || generating}
                        >
                          {publishing ? (
                            <>
                              <span className="btn-spinner" />
                              <span>Publishing...</span>
                            </>
                          ) : (
                            <>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>Publish Interview</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="submit-button gqp-publish-action-btn"
                          onClick={() => navigate('/interviews')}
                        >
                          <span>Go to Interviews →</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            }
    </section>
          );
}
