import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  {
    to: '/interviews',
    label: 'Interviews',
    icon: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
      </>
    ),
  },
  {
    to: '/create-interview',
    label: 'Create Interview',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </>
    ),
  },
];

function RobotMascot() {
  return (
    <svg className="sb-robot" viewBox="0 0 200 170" aria-hidden="true">
      <defs>
        <linearGradient id="rbBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbe7ff" />
        </linearGradient>
        <linearGradient id="rbAccent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      {/* soft background blob */}
      <path d="M18 120c-14-38 8-84 52-92 30-6 46 10 72 6 34-5 56 22 50 56-7 40-44 66-92 66-40 0-72-6-82-36z" fill="#e8f0ff" />
      {/* code bubble */}
      <circle cx="150" cy="44" r="22" fill="#dbe7ff" />
      <path d="M143 37l-7 7 7 7M157 37l7 7-7 7M152 33l-4 22" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* antenna */}
      <line x1="72" y1="40" x2="72" y2="52" stroke="#93b4f5" strokeWidth="3" strokeLinecap="round" />
      <circle cx="72" cy="37" r="4" fill="url(#rbAccent)" />
      {/* head */}
      <rect x="40" y="52" width="64" height="48" rx="22" fill="url(#rbBody)" stroke="#c7d8fb" strokeWidth="1.5" />
      <rect x="49" y="62" width="46" height="28" rx="13" fill="#1e3a8a" />
      <ellipse cx="62" cy="76" rx="5" ry="6" fill="#60a5fa" />
      <ellipse cx="82" cy="76" rx="5" ry="6" fill="#60a5fa" />
      <rect x="34" y="68" width="8" height="16" rx="4" fill="url(#rbAccent)" />
      <rect x="102" y="68" width="8" height="16" rx="4" fill="url(#rbAccent)" />
      {/* body */}
      <path d="M48 106h48c4 0 7 3 7 7v18c0 14-12 24-31 24s-31-10-31-24v-18c0-4 3-7 7-7z" fill="url(#rbBody)" stroke="#c7d8fb" strokeWidth="1.5" />
      <path d="M62 124h20l-10 16z" fill="url(#rbAccent)" opacity="0.85" />
      {/* arms */}
      <path d="M44 114c-10 4-14 14-12 24" fill="none" stroke="#c7d8fb" strokeWidth="9" strokeLinecap="round" />
      <path d="M100 114c12-2 22-10 28-20" fill="none" stroke="#c7d8fb" strokeWidth="9" strokeLinecap="round" />
      <path d="M126 92c2-6 8-8 12-5l-3 4 5 1-2 4 4 2c-4 5-11 6-16 2z" fill="url(#rbAccent)" />
    </svg>
  );
}

export default function Sidebar() {
  return (
    <aside className="sb" aria-label="Primary">
      <nav className="sb-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sb-link ${isActive ? 'is-active' : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {item.icon}
            </svg>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sb-bottom">
        <RobotMascot />
        <div className="sb-status">
          <span className="sb-status-dot" />
          <span>Simulator Engine v1.0</span>
        </div>
      </div>
    </aside>
  );
}
