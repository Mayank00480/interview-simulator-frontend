import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import CreateInterviewPage from './pages/CreateInterviewPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Route */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected App Routes inside AppLayout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/create-interview" element={<CreateInterviewPage />} />
          <Route path="/dashboard" element={<Navigate to="/create-interview" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/create-interview" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
