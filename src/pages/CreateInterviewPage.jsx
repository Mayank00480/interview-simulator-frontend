import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import heroImage from '../assets/images/interview-hero.png';
import sparklesIcon from '../assets/icons/sparkles.svg';
import micIcon from '../assets/icons/mic.svg';
import chartIcon from '../assets/icons/chart.svg';

export default function CreateInterviewPage() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState(['React', 'Node.js', 'MongoDB']);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    jobRole: '',
    experienceLevel: '',
    jobDescription: '',
    duration: 30,
    questionsCount: 5,
    expiresAt: '',
  });

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Interview setup created successfully in draft mode!');
    navigate('/dashboard');
  };

  return (
    <div className="layout-content-card create-interview-layout">
      {/* Left: Form Area */}
      <div className="create-interview-form-col">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <div className="create-header">
          <h2>Create New Interview</h2>
          <p>Set up a technical interview with the right questions, skills and configuration.</p>
        </div>

        <form onSubmit={handleSubmit} className="interview-form">
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Job Role *</label>
              <div className="input-wrapper">
                <span className="input-icon-left">💼</span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Frontend Developer"
                  value={formData.jobRole}
                  onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Experience Level *</label>
              <div className="input-wrapper">
                <span className="input-icon-left">👤</span>
                <select
                  className="form-input form-select"
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  required
                >
                  <option value="">Select experience level</option>
                  <option value="Entry Level (0-2 yrs)">Entry Level (0-2 yrs)</option>
                  <option value="Mid Level (2-5 yrs)">Mid Level (2-5 yrs)</option>
                  <option value="Senior Level (5+ yrs)">Senior Level (5+ yrs)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <div className="textarea-wrapper">
              <textarea
                className="form-textarea"
                rows="4"
                maxLength="2000"
                placeholder="Enter job description..."
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                required
              />
              <span className="char-count">{formData.jobDescription.length}/2000</span>
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label className="form-label">Skills *</label>
            <div className="input-wrapper">
              <span className="input-icon-left">🏷️</span>
              <input
                type="text"
                className="form-input"
                placeholder="Add skills (e.g. React, Node.js, MongoDB)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
              />
            </div>
            <div className="skills-tags-wrap">
              {skills.map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)}>×</button>
                </span>
              ))}
              {newSkill.trim() && (
                <button type="button" className="add-skill-btn" onClick={handleAddSkill}>
                  + Add
                </button>
              )}
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Duration (minutes) *</label>
              <div className="input-wrapper">
                <span className="input-icon-left">⏱️</span>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 30"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Number of Questions *</label>
              <div className="input-wrapper">
                <span className="input-icon-left">📋</span>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 5"
                  value={formData.questionsCount}
                  onChange={(e) => setFormData({ ...formData, questionsCount: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Expires At */}
          <div className="form-group">
            <label className="form-label">Expires At *</label>
            <div className="input-wrapper">
              <span className="input-icon-left">📅</span>
              <input
                type="date"
                className="form-input"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>
          </div>

          {/* Informational Callout */}
          <div className="info-banner">
            <span className="info-icon">ℹ️</span>
            <span>The interview will be created in draft mode. You can generate questions, review them and then publish the interview when ready.</span>
          </div>

          {/* Footer Buttons */}
          <div className="form-actions-row">
            <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="submit-button create-submit-btn">
              Create Interview →
            </button>
          </div>
        </form>
      </div>

      {/* Right: Graphic & "What you'll get" */}
      <div className="create-interview-side-col">
        <div className="side-quote-top">
          <p>Great interviews<br />build great teams</p>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 4C14 6 18 16 16 20" stroke="#2F6BFF" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 18L16 21L19 16" stroke="#2F6BFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <img src={heroImage} alt="" className="side-hero-img" />

        <div className="what-you-get-box">
          <div className="wyg-header">
            <span>✨</span>
            <h4>What you'll get</h4>
          </div>

          <div className="wyg-item">
            <div className="wyg-icon-badge">
              <img src={sparklesIcon} alt="" />
            </div>
            <div>
              <strong>AI Generated Questions</strong>
              <p>Role-specific and skill-focused questions using Gemini.</p>
            </div>
          </div>

          <div className="wyg-item">
            <div className="wyg-icon-badge">
              <img src={micIcon} alt="" />
            </div>
            <div>
              <strong>Voice-Based Interviews</strong>
              <p>Real-world experience with voice responses.</p>
            </div>
          </div>

          <div className="wyg-item">
            <div className="wyg-icon-badge">
              <img src={chartIcon} alt="" />
            </div>
            <div>
              <strong>Detailed Evaluation</strong>
              <p>Skill-wise and overall performance reports.</p>
            </div>
          </div>
        </div>

        <div className="side-quote-bottom">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 4C10 6 6 16 8 20" stroke="#2F6BFF" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M5 16L8 21L12 18" stroke="#2F6BFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p>Better practice<br />leads to bigger<br />opportunities</p>
        </div>
      </div>
    </div>
  );
}
