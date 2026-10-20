import React, { useState } from 'react';
import logo from '../assets/logo.svg';

export default function Navbar({ user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const displayName = user?.username || user?.name || 'Admin';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="app-navbar">
      <div className="nav-brand">
        <div className="nav-logo-box">
          <img src={logo} alt="Logo" className="nav-logo" />
        </div>
        <div className="nav-brand-text">
          <div className="nav-title-row">
            <span className="nav-title">AI Interview Simulator</span>
            <span className="nav-tag">Recruiter Pro</span>
          </div>
          <span className="nav-subtitle">Smarter Practice. Better Opportunities.</span>
        </div>
      </div>

      <div className="nav-user-menu">
        <button
          type="button"
          className="user-pill-btn"
          onClick={() => setShowDropdown(!showDropdown)}
          aria-expanded={showDropdown}
        >
          <span className="user-avatar">{initial}</span>
          <div className="user-meta">
            <span className="user-name">{displayName}</span>
            <span className="user-role">Admin</span>
          </div>
          <span className="user-arrow">▾</span>
        </button>

        {showDropdown && (
          <div className="user-dropdown-menu">
            <div className="dropdown-user-info">
              <strong>{displayName}</strong>
              {user?.email && <span>{user.email}</span>}
            </div>
            <hr className="dropdown-divider" />
            <button
              type="button"
              className="dropdown-item logout"
              onClick={onLogout}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

