import React, { useState } from 'react';
import logo from '../assets/logo.svg';

export default function Navbar({ user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const displayName = user?.username || user?.name || 'Admin';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="app-navbar">
      <div className="nav-brand">
        <img src={logo} alt="Logo" className="nav-logo" />
        <div className="nav-brand-text">
          <span className="nav-title">AI Interview Simulator</span>
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
          <span className="user-name">{displayName}</span>
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
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
