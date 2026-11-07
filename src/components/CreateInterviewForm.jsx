import React, { useState } from 'react';

const POPULAR_SKILLS = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
  'Java', 'MongoDB', 'SQL', 'Docker', 'AWS', 'Next.js', 'Express',
];

const MAX_DESC = 2000;

const Icon = ({ children, size = 16, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const EMPTY_FORM = {
  jobRole: '',
  experienceLevel: '',
  jobDescription: '',
  duration: 30,
  questionCount: 4,
  expiresAt: '',
};

export default function CreateInterviewForm({ onSubmit, loading = false, initialData = null }) {
  const [skills, setSkills] = useState(initialData?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [skillError, setSkillError] = useState('');
  const [formData, setFormData] = useState({
    jobRole: initialData?.jobRole || '',
    experienceLevel: initialData?.experienceLevel || '',
    jobDescription: initialData?.jobDescription || '',
    duration: initialData?.duration || 30,
    questionCount: initialData?.questionCount || initialData?.questionsCount || 4,
    expiresAt: initialData?.expiresAt ? initialData.expiresAt.slice(0, 10) : '',
  });

  const set = (patch) => setFormData((prev) => ({ ...prev, ...patch }));

  const addSkills = (list) => {
    const clean = list.map((s) => s.trim()).filter(Boolean);
    if (!clean.length) return;
    setSkills((prev) => {
      const seen = new Set(prev.map((s) => s.toLowerCase()));
      const toAdd = clean.filter((s) => {
        const key = s.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return toAdd.length ? [...prev, ...toAdd] : prev;
    });
    setSkillError('');
  };

  const handleSkillInputChange = (e) => {
    const val = e.target.value;
    if (val.includes(',')) {
      addSkills(val.split(','));
      setNewSkill('');
    } else {
      setNewSkill(val);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    addSkills(newSkill.split(','));
    setNewSkill('');
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
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
    if (!onSubmit) return;

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
      questionCount: Number(formData.questionCount) || 4,
      expiresAt: formattedExpiresAt,
    });
  };

  const suggestions = POPULAR_SKILLS.filter(
    (s) => !skills.some((x) => x.toLowerCase() === s.toLowerCase())
  ).slice(0, 8);

  return (
    <section className="ci" aria-label="Create Interview Form">
      <div className="ci-top">
        <span className="ci-top-icon">
          <Icon size={22}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><path d="M2 13h20" /></Icon>
        </span>
        <div>
          <h2 className="ci-title">Create New Interview</h2>
          <p className="ci-sub">Set up a technical interview with the right questions, skills, and configuration.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="ci-form">
        <div className="ci-grid">
          {/* LEFT */}
          <div className="ci-card ci-card-fill">
            <header className="ci-card-head">
              <span className="ci-card-icon">
                <Icon size={18}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>
              </span>
              <div>
                <h3>Role Information</h3>
                <p>Position title, seniority level and requirements</p>
              </div>
            </header>

            <div className="ci-card-body">
              <div className="ci-row-2">
                <div className="ci-field">
                  <label className="ci-label" htmlFor="ci-role">Job Role <em>*</em></label>
                  <div className="ci-input">
                    <Icon className="ci-input-icon"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>
                    <input
                      id="ci-role"
                      className="ci-control"
                      type="text"
                      placeholder="e.g. Frontend Developer"
                      value={formData.jobRole}
                      onChange={(e) => set({ jobRole: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="ci-field">
                  <label className="ci-label" htmlFor="ci-level">Experience Level <em>*</em></label>
                  <div className="ci-input">
                    <Icon className="ci-input-icon"><line x1="6" y1="20" x2="6" y2="14" /><line x1="12" y1="20" x2="12" y2="9" /><line x1="18" y1="20" x2="18" y2="4" /></Icon>
                    <select
                      id="ci-level"
                      className="ci-control ci-select"
                      value={formData.experienceLevel}
                      onChange={(e) => set({ experienceLevel: e.target.value })}
                      required
                    >
                      <option value="">Select level</option>
                      <option value="Fresher">Fresher (0 - 1 yrs)</option>
                      <option value="Junior">Junior (1 - 3 yrs)</option>
                      <option value="Mid-Level">Mid-Level (3 - 5 yrs)</option>
                      <option value="Senior">Senior (5+ yrs)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="ci-field ci-field-grow">
                <div className="ci-label-row">
                  <label className="ci-label" htmlFor="ci-desc">Job Description <em>*</em></label>
                  <span className="ci-count">{formData.jobDescription.length}/{MAX_DESC}</span>
                </div>
                <div className="ci-input ci-input-area">
                  <Icon className="ci-input-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></Icon>
                  <textarea
                    id="ci-desc"
                    className="ci-control ci-textarea"
                    maxLength={MAX_DESC}
                    placeholder="Enter core responsibilities, key qualifications, or technical topics the AI should evaluate…"
                    value={formData.jobDescription}
                    onChange={(e) => set({ jobDescription: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="ci-col">
            <div className="ci-card">
              <header className="ci-card-head">
                <span className="ci-card-icon is-rose">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
                  </svg>
                </span>
                <div>
                  <h3>Technical Skills <em>*</em></h3>
                  <p>Technologies evaluated during the interview</p>
                </div>
                {skills.length > 0 && <span className="ci-badge">{skills.length}</span>}
              </header>

              <div className="ci-card-body">
                <div className="ci-skill-row">
                  <input
                    className="ci-control"
                    type="text"
                    placeholder="Type a skill and press Enter"
                    value={newSkill}
                    onChange={handleSkillInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button type="button" className="ci-btn-add" onClick={handleAddSkill} disabled={!newSkill.trim()}>
                    Add
                  </button>
                </div>

                {skillError && <p className="ci-error">{skillError}</p>}

                <div className={`ci-tags-box ${skills.length ? '' : 'is-empty'}`}>
                  {skills.length > 0 ? (
                    <div className="ci-tags">
                      {skills.map((s) => (
                        <span key={s} className="ci-tag">
                          {s}
                          <button type="button" onClick={() => setSkills((prev) => prev.filter((x) => x !== s))} aria-label={`Remove ${s}`}>
                            <Icon size={11}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="ci-tags-empty">Selected skills will appear here</span>
                  )}
                </div>

                {suggestions.length > 0 && (
                  <div className="ci-suggest">
                    <span className="ci-suggest-label">Suggested</span>
                    {suggestions.map((s) => (
                      <button key={s} type="button" className="ci-chip" onClick={() => addSkills([s])}>
                        <Icon size={11}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="ci-card">
              <header className="ci-card-head">
                <span className="ci-card-icon">
                  <Icon size={19}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></Icon>
                </span>
                <div>
                  <h3>Assessment Settings</h3>
                  <p>Duration, question volume and expiration date</p>
                </div>
              </header>

              <div className="ci-card-body">
                <div className="ci-row-3">
                  <div className="ci-field">
                    <label className="ci-label" htmlFor="ci-duration">Duration (mins) <em>*</em></label>
                    <div className="ci-input">
                      <Icon className="ci-input-icon"><circle cx="12" cy="13" r="8" /><polyline points="12 9 12 13 14 15" /><line x1="10" y1="2" x2="14" y2="2" /></Icon>
                      <input
                        id="ci-duration"
                        className="ci-control"
                        type="number"
                        min="5"
                        max="180"
                        value={formData.duration}
                        onChange={(e) => set({ duration: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="ci-field">
                    <label className="ci-label" htmlFor="ci-questions">Questions <em>*</em></label>
                    <div className="ci-input">
                      <Icon className="ci-input-icon"><circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon>
                      <input
                        id="ci-questions"
                        className="ci-control"
                        type="number"
                        min="1"
                        max="30"
                        value={formData.questionCount}
                        onChange={(e) => set({ questionCount: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="ci-field">
                    <label className="ci-label" htmlFor="ci-expires">Expires At</label>
                    <div className="ci-input">
                      <Icon className="ci-input-icon"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Icon>
                      <input
                        id="ci-expires"
                        className="ci-control"
                        type="date"
                        value={formData.expiresAt}
                        onChange={(e) => set({ expiresAt: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ci-actions">
          <button type="button" className="ci-btn-ghost" onClick={handleReset} disabled={loading}>
            <Icon size={15}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></Icon>
            Reset
          </button>
          <button type="submit" className="ci-btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="ci-spinner" />
                <span>Creating…</span>
              </>
            ) : (
              <>
                <span>Create Interview &amp; Continue</span>
                <Icon size={16}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
