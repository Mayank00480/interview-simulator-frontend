import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-section-header">
          <span className="sidebar-section-title">Navigation</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/interviews"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </span>
            <span className="nav-label-text">Interviews</span>
            <span className="nav-active-pip" />
          </NavLink>

          <NavLink
            to="/create-interview"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </span>
            <span className="nav-label-text">Create Interview</span>
            <span className="nav-active-pip" />
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-footer">
          <div className="lightbulb-badge">
            <span className="lightbulb-icon">💡</span>
          </div>
          <div className="sidebar-footer-text">
            <strong>Pro Tip</strong>
            <p>Build great interviews, find great talent.</p>
          </div>
        </div>

        <div className="sidebar-system-status">
          <span className="status-indicator-dot" />
          <span>Simulator Engine v1.0</span>
        </div>
      </div>
    </aside>
  );
}

