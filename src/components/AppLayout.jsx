import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { logoutUser, getUserProfile } from '../services';

export default function AppLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('simulator_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('simulator_user', JSON.stringify(data.user));
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      navigate('/');
    }
  };

  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="app-body">
        <Sidebar />

        <main className="app-main-content">
          <Outlet context={{ user, setUser }} />
        </main>
      </div>
    </div>
  );
}
