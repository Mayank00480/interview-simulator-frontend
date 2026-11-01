import React, { useState } from 'react';
import {
  generateQuestions,
  publishInterview,
  addInterviewQuestion,
  deleteInterviewQuestion,
  updateInterviewQuestion,
} from '../services';
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

  // Add Question State
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newSkill, setNewSkill] = useState(interview?.skills?.[0] || '');
  const [addingQuestion, setAddingQuestion] = useState(false);

  // Edit Question State
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editQuestionText, setEditQuestionText] = useState('');
  const [editSkill, setEditSkill] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Question State
  const [deletingQuestionId, setDeletingQuestionId] = useState(null);

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

  // Add Question Handler
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) {
      showToast('Please enter question text.', 'error');
      return;
    }
    if (!interviewId) {
      showToast('Interview ID not found.', 'error');
      return;
    }

    setAddingQuestion(true);
    try {
      const payload = {
        questionText: newQuestionText.trim(),
        skill: newSkill.trim() || interview?.skills?.[0] || 'Technical',
      };
      const response = await addInterviewQuestion(interviewId, payload);
      showToast(response?.message || 'Question added successfully!', 'success');

      if (Array.isArray(response?.questions) && response.questions.length > 0) {
        setQuestions(response.questions);
      } else {
        const addedQ = response?.question || response?.data || {
          _id: response?._id || `q_${Date.now()}`,
          ...payload,
          order: questions.length + 1,
        };
        setQuestions((prev) => [...prev, addedQ]);
      }

      setNewQuestionText('');
      setNewSkill(interview?.skills?.[0] || '');
      setIsAddingQuestion(false);
    } catch (err) {
      console.error('Add question error:', err);
      showToast(err.message || 'Failed to add question.', 'error');
    } finally {
      setAddingQuestion(false);
    }
  };

  // Start Editing Question
  const handleStartEdit = (q) => {
    const qid = q._id || q.id;
    setEditingQuestionId(qid);
    setEditQuestionText(q.questionText || '');
    setEditSkill(q.skill || '');
  };

  // Cancel Editing Question
  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditQuestionText('');
    setEditSkill('');
  };

  // Save Edited Question
  const handleSaveEdit = async (questionId) => {
    if (!editQuestionText.trim()) {
      showToast('Question text cannot be empty.', 'error');
      return;
    }

    setSavingEdit(true);
    try {
      const payload = {
        questionText: editQuestionText.trim(),
        skill: editSkill.trim() || 'Technical',
      };
      const response = await updateInterviewQuestion(interviewId, questionId, payload);
      showToast(response?.message || 'Question updated successfully!', 'success');

      if (Array.isArray(response?.questions) && response.questions.length > 0) {
        setQuestions(response.questions);
      } else {
        setQuestions((prev) =>
          prev.map((q) =>
            (q._id === questionId || q.id === questionId)
              ? { ...q, ...payload, ...(response?.question || {}) }
              : q
          )
        );
      }
      setEditingQuestionId(null);
    } catch (err) {
      console.error('Update question error:', err);
      showToast(err.message || 'Failed to update question.', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Question Handler
  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }
    setDeletingQuestionId(questionId);
    try {
      const response = await deleteInterviewQuestion(interviewId, questionId);
      showToast(response?.message || 'Question deleted successfully!', 'success');

      if (Array.isArray(response?.questions)) {
        setQuestions(response.questions);
      } else {
        setQuestions((prev) => prev.filter((q) => q._id !== questionId && q.id !== questionId));
      }
    } catch (err) {
      console.error('Delete question error:', err);
      showToast(err.message || 'Failed to delete question.', 'error');
    } finally {
      setDeletingQuestionId(null);
    }
  };

  // Render Add Question Form
  const renderAddQuestionForm = () => (
    <form onSubmit={handleAddQuestion} className="gqp-add-form-card">
      <div className="gqp-add-form-header">
        <div className="gqp-add-form-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2f6bff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <strong>Add New Question</strong>
        </div>
        <button
          type="button"
          className="gqp-close-btn"
          onClick={() => {
            setIsAddingQuestion(false);
            setNewQuestionText('');
          }}
          title="Close form"
        >
          ✕
        </button>
      </div>

      <textarea
        className="gqp-edit-textarea"
        rows="2"
        placeholder="Enter question text (e.g. Explain event loop in Node.js)..."
        value={newQuestionText}
        onChange={(e) => setNewQuestionText(e.target.value)}
        required
      />

      <div className="gqp-add-form-footer">
        <div className="gqp-edit-skill-wrap">
          <label className="gqp-mini-label">Skill:</label>
          <input
            type="text"
            list="interview-skills-list"
            className="gqp-edit-skill-input"
            placeholder="e.g. Node.js"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
        </div>

        <div className="gqp-edit-actions">
          <button
            type="button"
            className="gqp-btn-secondary mini"
            onClick={() => {
              setIsAddingQuestion(false);
              setNewQuestionText('');
            }}
            disabled={addingQuestion}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button mini"
            disabled={addingQuestion || !newQuestionText.trim()}
          >
            {addingQuestion ? 'Adding...' : 'Add Question'}
          </button>
        </div>
      </div>
    </form>
  );

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
        <p>AI can generate tailored technical questions, or you can add and customize your own.</p>
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
          <h3>Ready to Set Up Questions</h3>
          <p>
            Generate smart technical questions for this interview using our AI engine, or add questions manually.
          </p>
          <div className="gqp-empty-actions-row">
            <button
              type="button"
              className="submit-button gqp-main-generate-btn"
              onClick={handleGenerate}
              disabled={generating || isAddingQuestion}
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

            <button
              type="button"
              className="gqp-btn-secondary"
              onClick={() => setIsAddingQuestion((prev) => !prev)}
            >
              + Add Question Manually
            </button>
          </div>

          {isAddingQuestion && (
            <div className="gqp-add-form-wrapper">
              {renderAddQuestionForm()}
            </div>
          )}
        </div>
      )}

      {/* Questions list display */}
      {questions.length > 0 && (
        <div className="gqp-questions-section">
          <div className="gqp-questions-header-bar">
            <div className="gqp-qh-left">
              <span className="gqp-count-pill">{questions.length} Questions</span>
              <span className="gqp-qh-subtitle">Technical interview questions</span>
            </div>

            <div className="gqp-qh-right">
              <button
                type="button"
                className="gqp-add-btn"
                onClick={() => setIsAddingQuestion((prev) => !prev)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>{isAddingQuestion ? 'Close Form' : 'Add Question'}</span>
              </button>
            </div>
          </div>

          {/* Add Question Form at Top of List */}
          {isAddingQuestion && renderAddQuestionForm()}

          <div className="gqp-questions-container">
            {questions.map((q, idx) => {
              const qid = q._id || q.id || `q_${idx}`;
              const isEditing = editingQuestionId === qid;

              return (
                <div key={qid} className={`gqp-question-card ${isEditing ? 'is-editing' : ''}`}>
                  {isEditing ? (
                    <div className="gqp-edit-form">
                      <div className="gqp-edit-header">
                        <span className="gqp-qc-number">Editing Q{q.order || idx + 1}</span>
                      </div>
                      <textarea
                        className="gqp-edit-textarea"
                        rows="2"
                        value={editQuestionText}
                        onChange={(e) => setEditQuestionText(e.target.value)}
                        placeholder="Enter question text..."
                        required
                      />
                      <div className="gqp-edit-footer">
                        <div className="gqp-edit-skill-wrap">
                          <label className="gqp-mini-label">Skill:</label>
                          <input
                            type="text"
                            list="interview-skills-list"
                            className="gqp-edit-skill-input"
                            value={editSkill}
                            onChange={(e) => setEditSkill(e.target.value)}
                            placeholder="e.g. Node.js"
                          />
                        </div>
                        <div className="gqp-edit-actions">
                          <button
                            type="button"
                            className="gqp-btn-secondary mini"
                            onClick={handleCancelEdit}
                            disabled={savingEdit}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="submit-button mini"
                            onClick={() => handleSaveEdit(qid)}
                            disabled={savingEdit || !editQuestionText.trim()}
                          >
                            {savingEdit ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="gqp-qc-header">
                        <div className="gqp-qc-header-left">
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

                        <div className="gqp-qc-actions">
                          <button
                            type="button"
                            className="gqp-action-btn edit"
                            onClick={() => handleStartEdit(q)}
                            title="Edit question"
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            className="gqp-action-btn delete"
                            onClick={() => handleDeleteQuestion(qid)}
                            disabled={deletingQuestionId === qid}
                            title="Delete question"
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span>{deletingQuestionId === qid ? '...' : 'Delete'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="gqp-qc-body">
                        <p className="gqp-qc-text">{q.questionText}</p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
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
      )}

      {/* Datalist for Skills */}
      <datalist id="interview-skills-list">
        {(interview?.skills || []).map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </section>
  );
}
