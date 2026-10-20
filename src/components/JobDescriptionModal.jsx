import React, { useState, useEffect } from 'react';

/**
 * JobDescriptionModal Component
 * Renders the Job Description popup in a structured format.
 * 
 * @param {Object} props
 * @param {Object|null} props.interview - The selected interview object
 * @param {Function} props.onClose - Function to close the modal
 */
export default function JobDescriptionModal({ interview, onClose }) {
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    if (!interview) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [interview, onClose]);

  if (!interview) return null;

  const role = interview.jobRole || interview.title || interview.role || 'Job Role';
  const rawJD = interview.jobDescription || interview.description || '';

  // Copy JD text to clipboard
  const handleCopy = () => {
    if (rawJD) {
      navigator.clipboard.writeText(rawJD);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Structured rendering of the Job Description
  const renderStructuredContent = () => {
    if (!rawJD || !rawJD.trim()) {
      return (
        <div className="jd-empty-box">
          <p>No job description details provided for this setup.</p>
        </div>
      );
    }

    const lines = rawJD
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    return (
      <div className="jd-structured-content">
        <div className="jd-block-card">
          <div className="jd-block-header">
            <span className="jd-badge-icon">📋</span>
            <span className="jd-block-label">Role Overview & Responsibilities</span>
          </div>
          <div className="jd-text-container">
            {lines.map((line, idx) => {
              const isBullet =
                line.startsWith('-') ||
                line.startsWith('•') ||
                line.startsWith('*') ||
                /^\d+[\.\)]/.test(line);

              if (isBullet) {
                const clean = line.replace(/^[-•*]\s*|^\d+[\.\)]\s*/, '');
                return (
                  <div key={idx} className="jd-bullet-item">
                    <span className="jd-bullet-symbol">▸</span>
                    <span className="jd-bullet-text">{clean}</span>
                  </div>
                );
              }

              return (
                <p key={idx} className="jd-paragraph-line">
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="jd-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="jd-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="jd-modal-title"
      >
        {/* Modal Header */}
        <div className="jd-modal-header">
          <div className="jd-header-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>

          <div className="jd-header-title-wrap">
            <span className="jd-predefined-tag">Job Description</span>
            <h2 id="jd-modal-title" className="jd-modal-title">
              {role}
            </h2>
          </div>

          <div className="jd-header-actions">
            {copied ? (
              <span className="jd-copied-indicator">✓ Copied</span>
            ) : (
              <button
                type="button"
                className="jd-copy-btn"
                onClick={handleCopy}
                title="Copy Job Description"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy</span>
              </button>
            )}

            <button
              type="button"
              className="jd-modal-close-btn"
              onClick={onClose}
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body: Structured Job Description */}
        <div className="jd-modal-body">
          {renderStructuredContent()}
        </div>

        {/* Modal Footer */}
        <div className="jd-modal-footer">
          <button
            type="button"
            className="jd-modal-close-action"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
