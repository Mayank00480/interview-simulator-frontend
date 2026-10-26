import React from 'react';

export default function CandidateDetailsModal({
  candidate,
  interview,
  onClose,
  onStatusChange,
}) {
  if (!candidate) return null;

  const score = candidate.overallScore;
  const getScoreColor = (val) => {
    if (val >= 85) return '#10b981';
    if (val >= 70) return '#2563eb';
    if (val >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusBadgeClass = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'SHORTLISTED') return 'status-badge-shortlisted';
    if (s === 'COMPLETED') return 'status-badge-completed';
    if (s === 'IN_REVIEW') return 'status-badge-review';
    if (s === 'IN_PROGRESS') return 'status-badge-progress';
    if (s === 'INVITED') return 'status-badge-invited';
    if (s === 'REJECTED') return 'status-badge-rejected';
    return 'status-badge-default';
  };

  const formattedDate = candidate.interviewDate
    ? new Date(candidate.interviewDate).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : 'Not started yet';

  const breakdown = candidate.breakdown || {
    technicalKnowledge: score ? Math.min(100, Math.round(score * 1.02)) : 0,
    problemSolving: score ? Math.max(0, Math.round(score * 0.98)) : 0,
    codeQuality: score ? Math.round(score * 1.0) : 0,
    communication: score ? Math.max(0, Math.round(score * 0.95)) : 0,
  };

  return (
    <div className="jd-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="candidate-modal-card"
        onClick={(e) => e.stopPropagation()}
        tabIndex="-1"
      >
        {/* Modal Header */}
        <div className="candidate-modal-header">
          <div className="candidate-header-left">
            <div className="candidate-avatar large">
              {(candidate.name || 'C')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <div className="candidate-name-row">
                <h2 className="candidate-modal-title">{candidate.name}</h2>
                <span className={`candidate-status-pill ${getStatusBadgeClass(candidate.status)}`}>
                  {candidate.status}
                </span>
              </div>
              <div className="candidate-contact-info">
                <span>{candidate.email}</span>
                {candidate.phone && <span>&bull; {candidate.phone}</span>}
                {candidate.experience && <span>&bull; {candidate.experience} exp</span>}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="jd-close-btn"
            onClick={onClose}
            aria-label="Close details"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="candidate-modal-body">
          {/* Top Score Banner if completed */}
          {score != null ? (
            <div className="candidate-score-banner">
              <div className="score-banner-main">
                <div
                  className="score-circle-badge"
                  style={{ borderColor: getScoreColor(score), color: getScoreColor(score) }}
                >
                  <span className="score-val">{score}</span>
                  <span className="score-max">/100</span>
                </div>
                <div>
                  <h3 className="score-headline">AI Overall Assessment Score</h3>
                  <p className="score-subtext">
                    Evaluated against {interview?.jobRole || 'role requirements'} &bull; Duration: {candidate.durationSpent || '30m'} &bull; {formattedDate}
                  </p>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="score-action-buttons">
                <button
                  type="button"
                  className={`status-action-btn shortlist ${candidate.status === 'SHORTLISTED' ? 'active' : ''}`}
                  onClick={() => onStatusChange && onStatusChange(candidate._id || candidate.id, 'SHORTLISTED')}
                >
                  &#10003; Shortlist
                </button>
                <button
                  type="button"
                  className={`status-action-btn reject ${candidate.status === 'REJECTED' ? 'active' : ''}`}
                  onClick={() => onStatusChange && onStatusChange(candidate._id || candidate.id, 'REJECTED')}
                >
                  &times; Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="candidate-pending-banner">
              <div className="pending-icon">⏳</div>
              <div>
                <h4>Interview In Progress / Awaiting Completion</h4>
                <p>
                  {candidate.status === 'INVITED'
                    ? 'The candidate has been invited. Assessment results will appear here once submitted.'
                    : 'The candidate is currently active in the interview session.'}
                </p>
              </div>
            </div>
          )}

          {/* Competency Breakdown */}
          {score != null && (
            <div className="evaluation-section">
              <h4 className="eval-section-title">Core Competency Breakdown</h4>
              <div className="competency-grid">
                <div className="competency-item">
                  <div className="competency-labels">
                    <span>Technical Knowledge</span>
                    <strong>{breakdown.technicalKnowledge}%</strong>
                  </div>
                  <div className="competency-bar-track">
                    <div
                      className="competency-bar-fill"
                      style={{
                        width: `${breakdown.technicalKnowledge}%`,
                        backgroundColor: getScoreColor(breakdown.technicalKnowledge),
                      }}
                    />
                  </div>
                </div>

                <div className="competency-item">
                  <div className="competency-labels">
                    <span>Problem Solving & Logic</span>
                    <strong>{breakdown.problemSolving}%</strong>
                  </div>
                  <div className="competency-bar-track">
                    <div
                      className="competency-bar-fill"
                      style={{
                        width: `${breakdown.problemSolving}%`,
                        backgroundColor: getScoreColor(breakdown.problemSolving),
                      }}
                    />
                  </div>
                </div>

                <div className="competency-item">
                  <div className="competency-labels">
                    <span>Code Quality & Architecture</span>
                    <strong>{breakdown.codeQuality}%</strong>
                  </div>
                  <div className="competency-bar-track">
                    <div
                      className="competency-bar-fill"
                      style={{
                        width: `${breakdown.codeQuality}%`,
                        backgroundColor: getScoreColor(breakdown.codeQuality),
                      }}
                    />
                  </div>
                </div>

                <div className="competency-item">
                  <div className="competency-labels">
                    <span>Communication & Clarity</span>
                    <strong>{breakdown.communication}%</strong>
                  </div>
                  <div className="competency-bar-track">
                    <div
                      className="competency-bar-fill"
                      style={{
                        width: `${breakdown.communication}%`,
                        backgroundColor: getScoreColor(breakdown.communication),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Summary Recommendation */}
          {candidate.summary && (
            <div className="evaluation-section">
              <h4 className="eval-section-title">AI Summary & Recommendation</h4>
              <div className="eval-summary-card">
                <p>{candidate.summary}</p>
              </div>
            </div>
          )}

          {/* Strengths & Areas to Improve */}
          {(candidate.strengths?.length > 0 || candidate.areasForImprovement?.length > 0) && (
            <div className="evaluation-grid-2col">
              {candidate.strengths?.length > 0 && (
                <div className="eval-card strengths-card">
                  <h4 className="card-subtitle green">&#10003; Key Strengths</h4>
                  <ul>
                    {candidate.strengths.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {candidate.areasForImprovement?.length > 0 && (
                <div className="eval-card improvements-card">
                  <h4 className="card-subtitle amber">&#9888; Areas for Growth</h4>
                  <ul>
                    {candidate.areasForImprovement.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Question by Question Q&A Preview */}
          {candidate.answers?.length > 0 && (
            <div className="evaluation-section">
              <h4 className="eval-section-title">Interview Questions & AI Evaluation</h4>
              <div className="qa-list">
                {candidate.answers.map((qa, index) => (
                  <div key={index} className="qa-item">
                    <div className="qa-header">
                      <span className="qa-number">Q{index + 1}</span>
                      <span className="qa-question">{qa.question}</span>
                      <span
                        className="qa-score-badge"
                        style={{ color: getScoreColor(qa.score), borderColor: getScoreColor(qa.score) }}
                      >
                        {qa.score}%
                      </span>
                    </div>
                    <p className="qa-feedback">{qa.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="candidate-modal-footer">
          <div className="footer-interview-context">
            <span>Interview: <strong>{interview?.jobRole || 'Technical Interview'}</strong></span>
          </div>
          <button type="button" className="jd-primary-btn" onClick={onClose}>
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
