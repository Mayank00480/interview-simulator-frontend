import React from 'react';
import logo from '../assets/logo.svg';
import heroImage from '../assets/images/interview-hero.png';
import sparklesIcon from '../assets/icons/sparkles.svg';
import micIcon from '../assets/icons/mic.svg';
import chartIcon from '../assets/icons/chart.svg';

const FEATURES = [
  { icon: sparklesIcon, title: 'AI Generated Questions', desc: 'Based on real job requirements' },
  { icon: micIcon, title: 'Voice-Based Interviews', desc: "Practice like it's the real thing" },
  { icon: chartIcon, title: 'Detailed Feedback', desc: 'Know your strengths & areas to improve' },
];

export default function AuthIllustration() {
  return (
    <div className="auth-illustration">
      <div className="illustration-ambient-wave illustration-ambient-wave--top" />
      <div className="illustration-ambient-wave illustration-ambient-wave--bottom" />

      {/* Brand Header */}
      <div className="brand-header">
        <div className="brand-logo-wrap">
          <img src={logo} alt="AI Interview Simulator" className="brand-logo-img" />
        </div>
        <div className="brand-text">
          <h1 className="brand-title">AI Interview Simulator</h1>
          <p className="brand-subtitle">Smarter Practice. Better Opportunities.</p>
        </div>
      </div>

      {/* Hero Headline */}
      <div className="hero-content">
        <h2 className="hero-title">
          Turn Your Skills<br />Into Opportunities
        </h2>
        <p className="hero-description">
          Get AI-powered technical interviews, real-time feedback, and detailed performance reports — all in one place.
        </p>

        {/* Scalable Features List */}
        <div className="features-list">
          {FEATURES.map((feat) => (
            <div key={feat.title} className="feature-item">
              <div className="feature-icon-badge">
                <img src={feat.icon} alt="" className="feature-icon" />
              </div>
              <div className="feature-info">
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Visual Area with Callout Annotation */}
      <div className="hero-visual-container">
        <div className="practice-callout">
          <div className="callout-bubble">
            Practice today,<br />
            <span>get hired tomorrow.</span>
          </div>
          <svg className="callout-arrow" width="22" height="25" viewBox="0 0 28 32" fill="none" aria-hidden="true">
            <path d="M6 3C15 6 22 14 17 26" stroke="#2F6BFF" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 23L17 27L22 21" stroke="#2F6BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <img
          src={heroImage}
          alt="Candidate practicing AI interview"
          className="hero-person-img"
        />
      </div>
    </div>
  );
}
