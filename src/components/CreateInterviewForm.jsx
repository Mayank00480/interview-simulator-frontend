import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CreateInterviewForm({ onSubmit, loading = false }) {
  const [skills, setSkills] = useState(['React', 'Node.js', 'MongoDB']);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    jobRole: '',
    experienceLevel: '',
    jobDescription: '',
    duration: 30,
    questionCount: 4,
    questionsCount: 4,
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

  const handleReset = () => {
    setFormData({
      jobRole: '',
      experienceLevel: '',
      jobDescription: '',
      duration: 30,
      questionCount: 4,
      questionsCount: 4,
      expiresAt: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      let formattedExpiresAt = formData.expiresAt;
      if (formData.expiresAt) {
        try {
          formattedExpiresAt = new Date(formData.expiresAt).toISOString();
        } catch {
          formattedExpiresAt = formData.expiresAt;
        }
      }

      onSubmit({
        jobRole: formData.jobRole.trim(),
        jobDescription: formData.jobDescription.trim(),
        skills,
        experienceLevel: formData.experienceLevel,
        duration: Number(formData.duration) || 30,
        questionCount: Number(formData.questionCount || formData.questionsCount) || 4,
        expiresAt: formattedExpiresAt,
      });
    }
  };

  return (
    <section className="create-interview-card" aria-label="Create Interview Form">
      <Link to="/interviews" className="back-link">
        ← Back to Interviews
      </Link>

      <div className="create-header">
        <h2>Create New Interview</h2>
        <p>Set up a technical interview with the right questions, skills and configuration.</p>
      </div>

      <form onSubmit={handleSubmit} className="interview-form">
        {/* Row 1: Job Role & Experience Level */}
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Job Role *</label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
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
            <div className="input-wrapper select-wrapper">
              <span className="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <select
                className="form-input form-select"
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                required
              >
                <option value="">Select experience level</option>
                <option value="Fresher">Fresher</option>
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
              </select>
              <span className="select-chevron">▾</span>
            </div>
          </div>
        </div>

        {/* Row 2: Job Description & Skills */}
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <div className="textarea-wrapper">
              <span className="textarea-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </span>
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

          <div className="form-group">
            <label className="form-label">Skills *</label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </span>
              <input
                type="text"
                className="form-input"
                placeholder="Add skills (e.g. React, Node.js, MongoDB)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
              />
            </div>

            {/* Skills Tag Pills */}
            <div className="skills-tags-wrap">
              {skills.map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              {newSkill.trim() && (
                <button type="button" className="add-skill-btn" onClick={handleAddSkill}>
                  + Add
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Duration & Questions count */}
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Duration (minutes) *</label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <input
                type="number"
                min="5"
                max="120"
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
              <span className="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </span>
              <input
                type="number"
                min="1"
                max="30"
                className="form-input"
                placeholder="e.g. 5"
                value={formData.questionsCount}
                onChange={(e) => setFormData({ ...formData, questionsCount: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Row 4: Expires At */}
        <div className="form-group">
          <label className="form-label">Expires At *</label>
          <div className="input-wrapper">
            <span className="input-icon-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <input
              type="date"
              className="form-input"
              placeholder="Select date and time"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
            />
            <span className="input-icon-right">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
          </div>
        </div>

        {/* Form Actions Buttons */}
        <div className="form-actions-row">
          <button
            type="button"
            className="cancel-btn"
            onClick={handleReset}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button create-submit-btn"
            disabled={loading}
          >
            <span>{loading ? 'Creating...' : 'Create Interview'}</span>
            <span>{loading ? '⏳' : '→'}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
