import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInterviews } from '../services';
import { useToast } from '../context/ToastContext';
import JobDescriptionModal from '../components/JobDescriptionModal';

export default function InterviewPage() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInterviewForJD, setSelectedInterviewForJD] = useState(null);
  const { showToast } = useToast();

  const normalizeStatus = (status) => {
    const upper = (status || 'DRAFT').toUpperCase();
    if (upper === 'PUBLISHED' || upper === 'ACTIVE') return 'PUBLISHED';
    if (upper === 'CLOSED' || upper === 'COMPLETED' || upper === 'EXPIRED') return 'CLOSED';
    return 'DRAFT';
  };

  const fetchInterviewsList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInterviews();
      // Handle direct array or wrapped responses ({ interviews: [...] } or { data: [...] })
      const list = Array.isArray(response)
        ? response
        : (response?.interviews || response?.data || response?.results || []);
      setInterviews(list);
    } catch (err) {
      console.error('Failed to load interviews:', err);
      const errMsg = err?.message || 'Failed to fetch interviews. Please check your connection or backend server.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewsList();
  }, []);

  // Compute status counts for tabs
  const statusCounts = interviews.reduce(
    (acc, item) => {
      acc.ALL += 1;
      const s = normalizeStatus(item.status);
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    { ALL: 0, DRAFT: 0, PUBLISHED: 0, CLOSED: 0 }
  );

  const STATUS_TABS = [
    { id: 'ALL', label: 'All', count: statusCounts.ALL, dotColor: null },
    { id: 'DRAFT', label: 'Draft', count: statusCounts.DRAFT, dotColor: '#f59e0b' },
    { id: 'PUBLISHED', label: 'Published', count: statusCounts.PUBLISHED, dotColor: '#10b981' },
    { id: 'CLOSED', label: 'Closed', count: statusCounts.CLOSED, dotColor: '#94a3b8' },
  ];

  // Filter interviews by search query and status filter
  const filteredInterviews = interviews.filter((item) => {
    const role = (item.jobRole || item.title || item.role || '').toLowerCase();
    const desc = (item.jobDescription || item.description || '').toLowerCase();
    const skills = Array.isArray(item.skills)
      ? item.skills.join(' ').toLowerCase()
      : (item.skills || '').toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      role.includes(searchQuery.toLowerCase()) ||
      desc.includes(searchQuery.toLowerCase()) ||
      skills.includes(searchQuery.toLowerCase());

    const itemStatus = normalizeStatus(item.status);
    const matchesStatus =
      statusFilter === 'ALL' || itemStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenCandidates = (item) => {
    const targetId = item._id || item.id;
    if (targetId) {
      navigate(`/interviews/${targetId}/candidates`, { state: { interview: item } });
    }
  };

  const handleCopySessionUrl = (item) => {
    const targetId = item._id || item.id;
    if (!targetId) return;
    const url = `${window.location.origin}/candidate-session/${targetId}`;
    navigator.clipboard?.writeText(url);
    showToast('Candidate session URL copied to clipboard!', 'success');
  };

  return (
    <div className="interviews-page">
      {/* Page Header */}
      <div className="interviews-page-header">
        <div className="header-text-group">
          <h1 className="interviews-page-title">Interviews</h1>
          <p className="interviews-page-subtitle">
            Overview of all scheduled, active, and completed technical interview setups.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar: Tabs on Left, Search on Right */}
      <div className="interviews-toolbar">
        {/* Left: Status Tabs */}
        <div className="status-tabs" role="tablist" aria-label="Filter by status">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`status-tab ${statusFilter === tab.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.id)}
              role="tab"
              aria-selected={statusFilter === tab.id}
            >
              {tab.dotColor && (
                <span
                  className="tab-indicator-dot"
                  style={{ backgroundColor: tab.dotColor }}
                />
              )}
              <span>{tab.label}</span>
              <span className="tab-count-badge">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Right: Search Input */}
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
            placeholder="Search by role, skills, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
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
            <h3>Failed to Load Interviews</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Tabular Data View: Reduced width, no horizontal scrollbar, clean fit */}
      <div className="interviews-table-card">
        <div className="table-responsive">
          <table className="interviews-table">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Job Role</th>
                <th style={{ width: '13%' }}>Experience Level</th>
                <th style={{ width: '20%' }}>Skills Required</th>
                <th style={{ width: '8%', textAlign: 'center' }}>Duration</th>
                <th style={{ width: '8%', textAlign: 'center' }}>Questions</th>
                <th style={{ width: '12%' }}>Expires / Created</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '9%', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Shimmering skeleton rows during fetch
                [1, 2, 3, 4, 5].map((idx) => (
                  <tr key={idx} className="table-skeleton-row">
                    <td>
                      <div className="skeleton-line" style={{ width: '110px', height: '14px', marginBottom: '4px' }} />
                      <div className="skeleton-line" style={{ width: '55px', height: '12px' }} />
                    </td>
                    <td><div className="skeleton-line" style={{ width: '70px', height: '14px' }} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <div className="skeleton-pill" style={{ width: '45px', height: '16px' }} />
                        <div className="skeleton-pill" style={{ width: '50px', height: '16px' }} />
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="skeleton-line" style={{ width: '38px', height: '14px', margin: '0 auto' }} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="skeleton-line" style={{ width: '32px', height: '14px', margin: '0 auto' }} />
                    </td>
                    <td><div className="skeleton-line" style={{ width: '75px', height: '14px' }} /></td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="skeleton-pill" style={{ width: '55px', height: '18px', margin: '0 auto' }} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="skeleton-pill" style={{ width: '26px', height: '26px', borderRadius: '7px', margin: '0 auto' }} />
                    </td>
                  </tr>
                ))
              ) : filteredInterviews.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-table-cell">
                    <div className="table-empty-state">
                      <div className="empty-table-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2f6bff" strokeWidth="1.6">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      </div>
                      <h4>{searchQuery ? 'No matching interviews found' : 'No interviews recorded'}</h4>
                      <p>
                        {searchQuery
                          ? `No interview setup matches "${searchQuery}". Try modifying your search criteria.`
                          : 'There are currently no interview records available from the server.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInterviews.map((item, index) => {
                  const role = item.jobRole || item.title || item.role || 'Technical Interview';
                  const exp = item.experienceLevel || item.experience || 'All Levels';
                  const rawSkills = item.skills;
                  const skills = Array.isArray(rawSkills)
                    ? rawSkills
                    : typeof rawSkills === 'string' && rawSkills.trim()
                      ? rawSkills.split(',').map((s) => s.trim())
                      : [];
                  const duration = item.duration || 30;
                  const questionsCount = item.questionCount || item.questionsCount || item.questions?.length || 4;
                  const status = normalizeStatus(item.status);
                  const dateVal = item.expiresAt || item.createdAt;
                  const formattedDate = dateVal
                    ? new Date(dateVal).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                    : '—';
                  const id = item._id || item.id || index;

                  return (
                    <tr
                      key={id}
                      className="interview-table-row clickable-row"
                      onClick={() => handleOpenCandidates(item)}
                      title="Click to view candidates for this interview"
                    >
                      {/* Job Role */}
                      <td className="cell-role">
                        <div className="role-title-wrap">
                          <span className="role-name role-clickable" title={role}>
                            {role}
                          </span>
                          <span className="view-candidates-tag">
                            View Candidates &rarr;
                          </span>
                        </div>
                      </td>

                      {/* Experience Level */}
                      <td className="cell-exp">
                        <span className="exp-badge">{exp}</span>
                      </td>

                      {/* Skills */}
                      <td className="cell-skills">
                        <div className="skills-inline-list">
                          {skills.length > 0 ? (
                            <>
                              {skills.slice(0, 2).map((skill, sIdx) => (
                                <span key={sIdx} className="table-skill-pill" title={skill}>
                                  {skill}
                                </span>
                              ))}
                              {skills.length > 2 && (
                                <span
                                  className="table-skill-pill more"
                                  title={skills.slice(2).join(', ')}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedInterviewForJD(item);
                                  }}
                                >
                                  +{skills.length - 2}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="cell-duration" style={{ textAlign: 'center' }}>
                        <span className="duration-pill">{duration}m</span>
                      </td>

                      {/* Questions Count */}
                      <td className="cell-questions" style={{ textAlign: 'center' }}>
                        <span className="questions-pill">{questionsCount} Qs</span>
                      </td>

                      {/* Date */}
                      <td className="cell-date">
                        <span className="date-text">{formattedDate}</span>
                      </td>

                      {/* Status */}
                      <td className="cell-status" style={{ textAlign: 'center' }}>
                        <span className={`status-badge ${status.toLowerCase()}`}>
                          <span className="status-dot" />
                          {status}
                        </span>
                      </td>

                      {/* Action - Candidates & Eye buttons */}
                      <td className="cell-action" style={{ textAlign: 'center' }}>
                        <div className="table-actions-group">
                          {status === 'PUBLISHED' && (
                            <button
                              type="button"
                              className="action-copy-url-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopySessionUrl(item);
                              }}
                              title="Copy Candidate Session URL"
                              aria-label={`Copy candidate session URL for ${role}`}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                              </svg>
                            </button>
                          )}
                          <button
                            type="button"
                            className="action-candidates-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenCandidates(item);
                            }}
                            title="View Candidates"
                            aria-label={`View Candidates for ${role}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="action-eye-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInterviewForJD(item);
                            }}
                            title="View Job Description"
                            aria-label={`View Job Description for ${role}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Description Popup Modal (Separate Component) */}
      <JobDescriptionModal
        interview={selectedInterviewForJD}
        onClose={() => setSelectedInterviewForJD(null)}
      />
    </div>
  );
}
