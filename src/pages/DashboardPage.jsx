import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { logoutUser, getUserProfile } from '../services';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('simulator_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        setIsLoading(true);
        const data = await getUserProfile();
        if (isMounted && data?.user) {
          setUser(data.user);
          localStorage.setItem('simulator_user', JSON.stringify(data.user));
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load profile:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/');
    }
  };

  const displayName = user?.username || user?.name || 'Candidate';
  const displayEmail = user?.email || '';

  return (
    <div className="auth-page-wrapper">
      <div className="bg-shape bg-shape-1" aria-hidden="true" />
      <div className="bg-shape bg-shape-2" aria-hidden="true" />

      <main className="dashboard-card">
        <div className="dashboard-header">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          {isLoading && !user ? (
            <div className="dashboard-loading-state">
              <span
                className="btn-spinner"
                style={{
                  borderColor: 'rgba(47, 107, 255, 0.2)',
                  borderTopColor: '#2f6bff',
                  margin: '12px auto',
                }}
              />
              <p>Loading your profile...</p>
            </div>
          ) : (
            <>
              <h1>Welcome, {displayName}!</h1>
              {displayEmail && <p>{displayEmail}</p>}
              {user?._id && (
                <span className="dashboard-user-id">ID: {user._id}</span>
              )}
            </>
          )}
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
            onClick={() => alert(`Starting AI interview simulation for ${displayName}...`)}
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
