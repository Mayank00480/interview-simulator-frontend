import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

/**
 * Route guard component to protect authenticated routes like Dashboard
 * Redirects unauthenticated users to the login/signup page
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const user = localStorage.getItem('simulator_user');

  if (!user) {
    // Redirect to login/signup page and preserve attempted route
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
