import React from 'react';
import heroImage from '../assets/images/interview-hero.png';
import sparklesIcon from '../assets/icons/sparkles.svg';
import micIcon from '../assets/icons/mic.svg';
import chartIcon from '../assets/icons/chart.svg';

export default function CreateInterviewSidePanel() {
  return (
    <aside className="create-interview-right-panel" aria-label="Feature Highlights">
      {/* Top Annotation Quote */}
      <div className="side-quote-top">
        <p>
          Great interviews<br />
          build great teams
        </p>
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden="true">
          <path d="M4 4C16 8 22 18 19 25" stroke="#2F6BFF" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14 21L19 26L23 20" stroke="#2F6BFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Hero Candidate Illustration */}
      <img
        src={heroImage}
        alt="Candidate practicing interview"
        className="side-hero-img"
      />

      {/* "What you'll get" Translucent Feature Box */}
      <div className="what-you-get-box">
        <div className="wyg-header">
          <span className="wyg-star-icon">✩</span>
          <h4>What you'll get</h4>
        </div>

        <div className="wyg-item">
          <div className="wyg-icon-badge">
            <img src={sparklesIcon} alt="" />
          </div>
          <div className="wyg-info">
            <strong>AI Generated Questions</strong>
            <p>Role-specific and skill-focused questions using Gemini.</p>
          </div>
        </div>

        <div className="wyg-item">
          <div className="wyg-icon-badge">
            <img src={micIcon} alt="" />
          </div>
          <div className="wyg-info">
            <strong>Voice-Based Interviews</strong>
            <p>Real-world experience with voice responses.</p>
          </div>
        </div>

        <div className="wyg-item">
          <div className="wyg-icon-badge">
            <img src={chartIcon} alt="" />
          </div>
          <div className="wyg-info">
            <strong>Detailed Evaluation</strong>
            <p>Skill-wise and overall performance reports.</p>
          </div>
        </div>
      </div>

      {/* Bottom Annotation Quote */}
      <div className="side-quote-bottom">
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden="true">
          <path d="M24 4C12 8 6 18 9 25" stroke="#2F6BFF" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M5 21L9 26L14 21" stroke="#2F6BFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p>
          Better practice<br />
          leads to bigger<br />
          opportunities
        </p>
      </div>
    </aside>
  );
}
