import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import CreateInterviewPage from './pages/CreateInterviewPage';
import InterviewPage from './pages/InterviewPage';
import InterviewCandidatesPage from './pages/InterviewCandidatesPage';
import CandidateSessionPage from './pages/CandidateSessionPage';
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

          {/* Public Candidate Session Routes (No recruiter authentication required) */}
          <Route path="/candidate-session/:interviewId" element={<CandidateSessionPage />} />
          <Route path="/candidate-session/:interviewId/:sessionId" element={<CandidateSessionPage />} />
          <Route path="/interview-session/:interviewId" element={<CandidateSessionPage />} />
          <Route path="/interview-session/:interviewId/:sessionId" element={<CandidateSessionPage />} />

          {/* Protected App Routes inside AppLayout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/interviews" element={<InterviewPage />} />
            <Route path="/interviews/:interviewId/candidates" element={<InterviewCandidatesPage />} />
            <Route path="/interviews/:interviewId" element={<InterviewCandidatesPage />} />
            <Route path="/create-interview" element={<CreateInterviewPage />} />
            <Route path="/create-interviews" element={<CreateInterviewPage />} />
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
