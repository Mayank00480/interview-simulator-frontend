import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { logoutUser } from '../services';

export default function DashboardPage() {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem('simulator_user');
  const user = rawUser
    ? JSON.parse(rawUser)
    : { username: 'Candidate', email: 'user@example.com' };

  const displayName = user.username || user.name || 'Candidate';

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="bg-shape bg-shape-1" aria-hidden="true" />
      <div className="bg-shape bg-shape-2" aria-hidden="true" />

      <main className="dashboard-card">
        <div className="dashboard-header">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <h1>Welcome, {displayName}!</h1>
          <p>{user.email}</p>
        </div>

        <div className="dashboard-stats-grid">
          <div className="dash-stat-box">
            <span className="dash-stat-number">3</span>
            <span className="dash-stat-label">Available Tracks</span>
          </div>
          <div className="dash-stat-box">
            <span className="dash-stat-number">0</span>
            <span className="dash-stat-label">Interviews Completed</span>
          </div>
          <div className="dash-stat-box">
            <span className="dash-stat-number">100%</span>
            <span className="dash-stat-label">Readiness Score</span>
          </div>
        </div>

        <div className="dashboard-actions">
          <button
            type="button"
            className="submit-button"
            onClick={() => alert('Starting your AI interview simulation session...')}
          >
            Start Practice Interview
          </button>
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
