import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { getInterviewSessions } from '../services';

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
                      onClick={() => setSelectedSession(session)}
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
                            setSelectedSession(session);
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

      {/* Full Session & Evaluation Details Modal */}
      {selectedSession && (
        <div
          className="jd-modal-overlay"
          onClick={() => setSelectedSession(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="jd-modal-card"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="jd-modal-header">
              <div>
                <h3 className="jd-modal-title">
                  {selectedSession.candidateName || 'Candidate Session'}
                </h3>
                <span className="date-text">
                  {selectedSession.candidateEmail} {selectedSession.candidatePhone && `\u2022 ${selectedSession.candidatePhone}`}
                </span>
              </div>
              <button
                type="button"
                className="jd-close-btn"
                onClick={() => setSelectedSession(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="jd-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '75vh', overflowY: 'auto' }}>
              {/* Score & Status Highlight */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#ffffff',
                      border: '2.5px solid #2563eb',
                      color: '#2563eb',
                      fontWeight: '800',
                    }}
                  >
                    <span style={{ fontSize: '15px', lineHeight: 1 }}>
                      {selectedSession.overallScore ?? '—'}
                    </span>
                    <span style={{ fontSize: '8px', color: '#64748b' }}>/100</span>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '12.5px', color: '#0f172a' }}>
                      Overall AI Assessment Score
                    </h4>
                    <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                      Duration: {selectedSession.duration ? `${selectedSession.duration} mins` : '30 mins'}
                    </span>
                  </div>
                </div>

                <span className={`status-badge ${(selectedSession.status || 'pending').toLowerCase()}`}>
                  <span className="status-dot" />
                  {selectedSession.status || 'PENDING'}
                </span>
              </div>

              {/* Timing info */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '10.5px',
                  color: '#64748b',
                  background: '#ffffff',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              >
                {selectedSession.startedAt && (
                  <div>
                    <strong>Started:</strong> {formatDate(selectedSession.startedAt)}
                  </div>
                )}
                {selectedSession.completedAt && (
                  <div>
                    <strong>Completed:</strong> {formatDate(selectedSession.completedAt)}
                  </div>
                )}
              </div>

              {/* Skill Scores */}
              {selectedSession.skillScores?.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.4px', color: '#475569', marginBottom: '8px' }}>
                    Skill Scores
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {selectedSession.skillScores.map((sk, i) => (
                      <div
                        key={i}
                        style={{
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#166534' }}>{sk.skill}</span>
                        <strong style={{ fontSize: '12px', color: '#15803d' }}>{sk.score}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Evaluation */}
              <div>
                <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.4px', color: '#475569', marginBottom: '8px' }}>
                  AI Evaluation Feedback
                </h4>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderLeft: '3px solid #2563eb',
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '11.5px',
                    lineHeight: '1.6',
                    color: '#334155',
                  }}
                >
                  {selectedSession.evaluation || 'No evaluation text available for this session.'}
                </div>
              </div>
            </div>

            <div className="jd-modal-footer">
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
