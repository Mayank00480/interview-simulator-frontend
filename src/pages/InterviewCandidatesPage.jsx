import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { getInterviewSessions, getSessionQuestions } from '../services';

export default function InterviewCandidatesPage() {
  const { interviewId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const interview = location.state?.interview || null;
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState(null);

  const handleSelectSession = async (session) => {
    setSelectedSession(session);
    setSessionQuestions([]);
    setQuestionsError(null);
    const sid = session._id || session.id;
    if (sid) {
      setLoadingQuestions(true);
      try {
        const questions = await getSessionQuestions(sid);
        setSessionQuestions(Array.isArray(questions) ? questions : []);
      } catch (err) {
        setQuestionsError(err?.message || 'Failed to load questions for this session.');
      } finally {
        setLoadingQuestions(false);
      }
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    if (!selectedSession) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedSession(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSession]);

  useEffect(() => {
    let isMounted = true;

    async function loadSessions() {
      setLoading(true);
      setError(null);
      try {
        const data = await getInterviewSessions(interviewId);
        if (isMounted) {
          setSessions(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to load candidates for this interview.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (interviewId) {
      loadSessions();
    }

    return () => {
      isMounted = false;
    };
  }, [interviewId]);

  const role = interview?.jobRole || interview?.title || 'Technical Interview';

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const total = sessions.length;
    const completed = sessions.filter((s) => (s.status || '').toUpperCase() === 'COMPLETED').length;
    const scoredList = sessions.filter((s) => typeof s.overallScore === 'number');
    const avgScore = scoredList.length > 0
      ? Math.round(scoredList.reduce((acc, s) => acc + s.overallScore, 0) / scoredList.length)
      : null;
    return { total, completed, avgScore };
  }, [sessions]);

  // Filtered sessions by search and status
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const name = (s.candidateName || '').toLowerCase();
      const email = (s.candidateEmail || '').toLowerCase();
      const phone = (s.candidatePhone || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || name.includes(q) || email.includes(q) || phone.includes(q);

      const status = (s.status || 'PENDING').toUpperCase();
      const matchesStatus = statusFilter === 'ALL' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = { ALL: sessions.length, COMPLETED: 0 };
    sessions.forEach((s) => {
      const st = (s.status || '').toUpperCase();
      counts[st] = (counts[st] || 0) + 1;
    });
    return counts;
  }, [sessions]);

  return (
    <div className="interviews-page">
      {/* Top Navigation & Breadcrumbs */}
      <div className="candidates-top-nav">
        <button
          type="button"
          className="back-to-interviews-btn"
          onClick={() => navigate('/interviews')}
        >
          &larr; Back to Interviews
        </button>

        <div className="breadcrumb-trail">
          <Link to="/interviews" className="breadcrumb-link">Interviews</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{role}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-badge">Candidates</span>
        </div>
      </div>

      {/* Header */}
      <div className="interviews-page-header">
        <div className="header-text-group">
          <h1 className="interviews-page-title">Candidate Sessions &mdash; {role}</h1>
          <p className="interviews-page-subtitle">
            Overview of all candidate submissions, skill scores, and AI evaluations for this interview.
          </p>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="candidates-stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-icon-wrap blue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-text">
            <span className="stat-number">{metrics.total}</span>
            <span className="stat-label">Total Sessions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stat-text">
            <span className="stat-number">{metrics.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap amber">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="stat-text">
            <span className="stat-number">{metrics.avgScore != null ? `${metrics.avgScore}%` : '—'}</span>
            <span className="stat-label">Average Score</span>
          </div>
        </div>
      </div>

      {/* Toolbar: Status Tabs & Search */}
      <div className="interviews-toolbar">
        <div className="status-tabs" role="tablist">
          <button
            type="button"
            className={`status-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All <span className="tab-count-badge">{statusCounts.ALL}</span>
          </button>
          <button
            type="button"
            className={`status-tab ${statusFilter === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('COMPLETED')}
          >
            <span className="tab-indicator-dot" style={{ backgroundColor: '#10b981' }} />
            Completed <span className="tab-count-badge">{statusCounts.COMPLETED || 0}</span>
          </button>
        </div>

        <div className="search-bar-wrap">
          <span className="search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search candidate name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="interviews-error-card">
          <div className="error-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="error-content">
            <h3>Error loading candidates</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Sessions Table */}
      <div className="interviews-table-card">
        <div className="table-responsive">
          <table className="interviews-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Candidate Name</th>
                <th style={{ width: '22%' }}>Email</th>
                <th style={{ width: '13%' }}>Phone</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Score</th>
                <th style={{ width: '11%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '12%' }}>Completed Date</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map((idx) => (
                  <tr key={idx} className="table-skeleton-row">
                    <td><div className="skeleton-line" style={{ width: '110px', height: '14px' }} /></td>
                    <td><div className="skeleton-line" style={{ width: '130px', height: '14px' }} /></td>
                    <td><div className="skeleton-line" style={{ width: '80px', height: '14px' }} /></td>
                    <td style={{ textAlign: 'center' }}><div className="skeleton-pill" style={{ width: '45px', height: '18px', margin: '0 auto' }} /></td>
                    <td style={{ textAlign: 'center' }}><div className="skeleton-pill" style={{ width: '60px', height: '18px', margin: '0 auto' }} /></td>
                    <td><div className="skeleton-line" style={{ width: '85px', height: '14px' }} /></td>
                    <td style={{ textAlign: 'center' }}><div className="skeleton-pill" style={{ width: '50px', height: '22px', margin: '0 auto' }} /></td>
                  </tr>
                ))
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    <div className="table-empty-state">
                      <div className="empty-table-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2f6bff" strokeWidth="1.6">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                      <h4>{searchQuery ? 'No matching candidate sessions' : 'No candidates found'}</h4>
                      <p>
                        {searchQuery
                          ? `No candidate matches "${searchQuery}".`
                          : 'No candidate interview sessions recorded yet for this setup.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session, index) => {
                  const id = session._id || index;
                  const name = session.candidateName || '—';
                  const email = session.candidateEmail || '—';
                  const phone = session.candidatePhone || '—';
                  const status = (session.status || 'PENDING').toUpperCase();
                  const score = session.overallScore;
                  const date = formatDate(session.completedAt || session.startedAt || session.createdAt);

                  return (
                    <tr
                      key={id}
                      className="interview-table-row clickable-row"
                      onClick={() => handleSelectSession(session)}
                      title="Click to view full session details"
                    >
                      <td className="cell-role">
                        <strong className="role-name">{name}</strong>
                      </td>
                      <td>
                        <span className="text-secondary">{email}</span>
                      </td>
                      <td>
                        <span className="text-secondary">{phone}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {score != null ? (
                          <span
                            className="score-number-badge"
                            style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontWeight: '700',
                              fontSize: '11px',
                              backgroundColor: score >= 70 ? '#ecfdf5' : score >= 40 ? '#fffbeb' : '#fef2f2',
                              color: score >= 70 ? '#047857' : score >= 40 ? '#b45309' : '#b91c1c',
                              border: `1px solid ${score >= 70 ? '#a7f3d0' : score >= 40 ? '#fde68a' : '#fecaca'}`,
                            }}
                          >
                            {score}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`status-badge ${status.toLowerCase()}`}>
                          <span className="status-dot" />
                          {status}
                        </span>
                      </td>
                      <td>
                        <span className="date-text">{date}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="view-eval-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSession(session);
                          }}
                          title="View Details"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Session & Evaluation Details Modal (Centered with enhanced UX) */}
      {selectedSession && (
        <div
          className="jd-modal-backdrop"
          onClick={() => setSelectedSession(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-modal-title"
        >
          <div
            className="session-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="jd-modal-header" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                  }}
                >
                  {(selectedSession.candidateName || 'C')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 id="session-modal-title" className="jd-modal-title" style={{ fontSize: '15px' }}>
                      {selectedSession.candidateName || 'Candidate Session'}
                    </h3>
                    <span className={`status-badge ${(selectedSession.status || 'pending').toLowerCase()}`}>
                      <span className="status-dot" />
                      {selectedSession.status || 'PENDING'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '10.5px', color: '#64748b', marginTop: '2px', flexWrap: 'wrap' }}>
                    <span>✉ {selectedSession.candidateEmail || 'No email'}</span>
                    {selectedSession.candidatePhone && (
                      <span>☎ {selectedSession.candidatePhone}</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="jd-modal-close-btn"
                onClick={() => setSelectedSession(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="jd-modal-body" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '72vh', overflowY: 'auto' }}>
              {/* Executive Overview: Score & Metadata Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
                  border: '1px solid #dbeafe',
                  gap: '14px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#ffffff',
                      border: `2.5px solid ${
                        selectedSession.overallScore >= 70
                          ? '#10b981'
                          : selectedSession.overallScore >= 40
                            ? '#f59e0b'
                            : '#ef4444'
                      }`,
                      color:
                        selectedSession.overallScore >= 70
                          ? '#047857'
                          : selectedSession.overallScore >= 40
                            ? '#b45309'
                            : '#b91c1c',
                      fontWeight: '800',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>
                      {selectedSession.overallScore ?? '—'}
                    </span>
                    <span style={{ fontSize: '8px', color: '#94a3b8' }}>/100</span>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                      Overall Performance Score
                    </h4>
                    <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                      Duration: ⏱ {selectedSession.duration ? `${selectedSession.duration} mins` : '30 mins'}
                    </span>
                  </div>
                </div>

                {/* Timestamps */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '10.5px', color: '#475569' }}>
                  {selectedSession.startedAt && (
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 8px' }}>
                      <span style={{ color: '#94a3b8' }}>Started: </span>
                      <strong>{formatDate(selectedSession.startedAt)}</strong>
                    </div>
                  )}
                  {selectedSession.completedAt && (
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 8px' }}>
                      <span style={{ color: '#94a3b8' }}>Completed: </span>
                      <strong>{formatDate(selectedSession.completedAt)}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Skill Scores Section */}
              {selectedSession.skillScores?.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', fontWeight: '700', margin: '0 0 8px 0' }}>
                    Skill Competency Scores
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                    {selectedSession.skillScores.map((sk, i) => {
                      const scoreVal = typeof sk.score === 'number' ? sk.score : 0;
                      return (
                        <div
                          key={i}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#1e293b' }}>{sk.skill}</span>
                            <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#2563eb' }}>{sk.score}</span>
                          </div>
                          <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${Math.min(100, (scoreVal / 10) * 100)}%`,
                                height: '100%',
                                background: scoreVal >= 7 ? '#10b981' : scoreVal >= 4 ? '#3b82f6' : '#f59e0b',
                                borderRadius: '4px',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Evaluation Feedback */}
              <div>
                <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', fontWeight: '700', margin: '0 0 8px 0' }}>
                  AI Evaluation Feedback
                </h4>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderLeft: '3px solid #2563eb',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    fontSize: '11.5px',
                    lineHeight: '1.6',
                    color: '#334155',
                  }}
                >
                  {selectedSession.evaluation || 'No evaluation notes recorded for this session.'}
                </div>
              </div>

              {/* Questions & Candidate Answers (Loaded via GET /sessions/:sessionId/questions) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', fontWeight: '700', margin: 0 }}>
                    Interview Questions &amp; Answers
                  </h4>
                  {!loadingQuestions && sessionQuestions.length > 0 && (
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', background: '#f1f5f9', padding: '1px 6px', borderRadius: '8px' }}>
                      {sessionQuestions.length} Questions
                    </span>
                  )}
                </div>

                {loadingQuestions ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '11px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #cbd5e1', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginRight: '8px', verticalAlign: 'middle' }} />
                    Loading questions &amp; candidate answers...
                  </div>
                ) : questionsError ? (
                  <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '11px' }}>
                    {questionsError}
                  </div>
                ) : sessionQuestions.length === 0 ? (
                  <div style={{ padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontSize: '11px', textAlign: 'center' }}>
                    No questions recorded for this session.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {sessionQuestions.map((q, idx) => (
                      <div
                        key={q._id || idx}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '12px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: '9.5px',
                              fontWeight: '700',
                              background: '#e2e8f0',
                              color: '#334155',
                              padding: '1px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            Q{q.order || idx + 1}
                          </span>
                          {q.skill && (
                            <span
                              style={{
                                fontSize: '9px',
                                fontWeight: '600',
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                border: '1px solid #bfdbfe',
                                padding: '1px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {q.skill}
                            </span>
                          )}
                          {q.isFollowUp && (
                            <span
                              style={{
                                fontSize: '9px',
                                fontWeight: '600',
                                background: '#fffbeb',
                                color: '#b45309',
                                border: '1px solid #fde68a',
                                padding: '1px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              Follow-Up
                            </span>
                          )}
                        </div>

                        {/* Question Text */}
                        <p style={{ margin: '0 0 8px 0', fontSize: '11.5px', fontWeight: '600', color: '#0f172a', lineHeight: '1.45' }}>
                          {q.questionText}
                        </p>

                        {/* Candidate Answer */}
                        <div
                          style={{
                            background: q.answer ? '#f8fafc' : '#fafafa',
                            border: `1px solid ${q.answer ? '#e2e8f0' : '#f1f5f9'}`,
                            borderLeft: q.answer ? '3px solid #10b981' : '3px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '8px 10px',
                          }}
                        >
                          <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '2px' }}>
                            Candidate Answer:
                          </span>
                          {q.answer ? (
                            <p style={{ margin: 0, fontSize: '11px', color: '#1e293b', lineHeight: '1.5' }}>
                              {q.answer}
                            </p>
                          ) : (
                            <span style={{ fontSize: '10.5px', color: '#94a3b8', fontStyle: 'italic' }}>
                              No answer recorded (unanswered / skipped)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="jd-modal-footer" style={{ padding: '10px 20px', borderTop: '1px solid #f1f5f9', background: '#fbfcfe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                Session ID: {selectedSession._id}
              </span>
              <button
                type="button"
                className="jd-modal-close-action"
                onClick={() => setSelectedSession(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
