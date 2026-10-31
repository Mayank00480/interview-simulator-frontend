import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const POPULAR_SKILLS = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
  'Java', 'MongoDB', 'SQL', 'Docker', 'AWS', 'Next.js', 'Express'
];

export default function CreateInterviewForm({ onSubmit, loading = false, initialData = null }) {
  // Static skills removed: initialized to empty array or initialData
  const [skills, setSkills] = useState(initialData?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [skillError, setSkillError] = useState('');
  const [formData, setFormData] = useState({
    jobRole: initialData?.jobRole || '',
    experienceLevel: initialData?.experienceLevel || '',
    jobDescription: initialData?.jobDescription || '',
    duration: initialData?.duration || 30,
    questionCount: initialData?.questionCount || 4,
    questionsCount: initialData?.questionCount || initialData?.questionsCount || 4,
    expiresAt: initialData?.expiresAt ? initialData.expiresAt.slice(0, 10) : '',
  });

  const handleSkillInputChange = (e) => {
    const val = e.target.value;
    if (val.includes(',')) {
      const parts = val.split(',').map((s) => s.trim()).filter(Boolean);
      const toAdd = parts.filter((s) => !skills.includes(s));
      if (toAdd.length > 0) {
        setSkills((prev) => [...prev, ...toAdd]);
        setSkillError('');
      }
      setNewSkill('');
    } else {
      setNewSkill(val);
      if (skillError) setSkillError('');
    }
  };

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;

    if (trimmed.includes(',')) {
      const parts = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      const toAdd = parts.filter((s) => !skills.includes(s));
      if (toAdd.length > 0) {
        setSkills((prev) => [...prev, ...toAdd]);
        setSkillError('');
      }
    } else if (!skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillError('');
    }
    setNewSkill('');
  };

  const handleAddSuggestedSkill = (suggested) => {
    if (!skills.includes(suggested)) {
      setSkills((prev) => [...prev, suggested]);
      setSkillError('');
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
    setSkills([]);
    setNewSkill('');
    setSkillError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (skills.length === 0) {
      setSkillError('Please add at least one technical skill to generate relevant questions.');
      return;
    }

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
        <p>Set up a technical interview with the right questions, skills, and configuration.</p>
      </div>

      <form onSubmit={handleSubmit} className="interview-form">
        {/* Section 1: Role Overview */}
        <div className="cif-section-block">
          <div className="cif-section-header">
            <span className="cif-section-icon">💼</span>
            <div className="cif-section-title-wrap">
              <h4 className="cif-section-title">Role Information</h4>
              <p className="cif-section-subtitle">Specify the position title and expected seniority level</p>
            </div>
          </div>

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
                  <option value="Fresher">Fresher (0 - 1 years)</option>
                  <option value="Junior">Junior (1 - 3 years)</option>
                  <option value="Mid-Level">Mid-Level (3 - 5 years)</option>
                  <option value="Senior">Senior (5+ years)</option>
                </select>
                <span className="select-chevron">▾</span>
              </div>
            </div>
          </div>

          <div className="form-group cif-full-width">
            <div className="cif-label-row">
              <label className="form-label">Job Description *</label>
              <span className="char-count">{formData.jobDescription.length}/2000</span>
            </div>
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
                className="form-textarea cif-textarea-enhanced"
                rows="3"
                maxLength="2000"
                placeholder="Enter job requirements, core responsibilities, or technical expectations..."
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Technical Skills */}
        <div className="cif-section-block">
          <div className="cif-section-header">
            <span className="cif-section-icon">🎯</span>
            <div className="cif-section-title-wrap">
              <h4 className="cif-section-title">Technical Skills *</h4>
              <p className="cif-section-subtitle">
                Add target technologies that AI will generate questions for
              </p>
            </div>
            {skills.length > 0 && (
              <span className="cif-skills-count-badge">
                {skills.length} {skills.length === 1 ? 'skill' : 'skills'} added
              </span>
            )}
          </div>

          <div className="form-group">
            <div className="cif-skills-input-row">
              <div className="input-wrapper cif-skills-input-wrap">
                <span className="input-icon-left">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type a skill and press Enter or comma (e.g. React, TypeScript)..."
                  value={newSkill}
                  onChange={handleSkillInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                />
              </div>
              <button
                type="button"
                className="cif-add-skill-btn"
                onClick={handleAddSkill}
                disabled={!newSkill.trim()}
              >
                + Add Skill
              </button>
            </div>

            {skillError && (
              <p className="cif-skill-error">⚠️ {skillError}</p>
            )}

            {/* Selected Skills Tags */}
            {skills.length > 0 ? (
              <div className="skills-tags-wrap cif-skills-tags-container">
                {skills.map((skill) => (
                  <span key={skill} className="skill-pill cif-skill-pill-active">
                    <span className="skill-pill-text">{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      title={`Remove ${skill}`}
                      className="cif-remove-pill-btn"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="cif-no-skills-box">
                <span>No skills added yet. Type a skill above or click quick suggestions below.</span>
              </div>
            )}

            {/* Quick Suggestions Bar */}
            <div className="cif-suggestions-row">
              <span className="cif-suggestions-label">Quick Suggestions:</span>
              <div className="cif-suggestions-chips">
                {POPULAR_SKILLS.filter((s) => !skills.includes(s)).slice(0, 8).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="cif-suggestion-chip"
                    onClick={() => handleAddSuggestedSkill(s)}
                    title={`Click to add ${s}`}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Assessment Parameters */}
        <div className="cif-section-block">
          <div className="cif-section-header">
            <span className="cif-section-icon">⚙️</span>
            <div className="cif-section-title-wrap">
              <h4 className="cif-section-title">Assessment Settings</h4>
              <p className="cif-section-subtitle">Configure test duration, question volume, and expiration date</p>
            </div>
          </div>

          <div className="form-row-3 cif-row-3">
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
                  max="180"
                  className="form-input"
                  placeholder="30"
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
                  placeholder="4"
                  value={formData.questionsCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      questionsCount: e.target.value,
                      questionCount: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Expires At</label>
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
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions Buttons */}
        <div className="form-actions-row cif-actions-row">
          <button
            type="button"
            className="cancel-btn cif-reset-btn"
            onClick={handleReset}
            disabled={loading}
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="submit-button create-submit-btn cif-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                <span>Creating Interview...</span>
              </>
            ) : (
              <>
                <span>Create Interview & Continue</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
