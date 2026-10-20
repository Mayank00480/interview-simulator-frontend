import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import CreateInterviewPage from './pages/CreateInterviewPage';
import InterviewPage from './pages/InterviewPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import { ToastProvider } from './context/ToastContext';
import './App.css';

function App() {
  return (
    <ToastProvider>
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
            <Route path="/interviews" element={<InterviewPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/create-interview" element={<CreateInterviewPage />} />
            <Route path="/dashboard" element={<Navigate to="/interviews" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/interviews" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
