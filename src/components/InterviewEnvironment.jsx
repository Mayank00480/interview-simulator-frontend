import React, { useState, useEffect, useRef } from 'react';
import { submitSessionAnswer, completeSession } from '../services';
import { useToast } from '../context/ToastContext';

export default function InterviewEnvironment({ session, questions = [], interview, onExit }) {
  const { showToast } = useToast();

  const sessionId = session?._id || session?.id;
  const candidateName = session?.candidateName || 'Candidate';
  const durationMinutes = Number(session?.duration) || 30;

  // Main questions list
  const [mainQuestions] = useState(questions);
  const [currentMainIndex, setCurrentMainIndex] = useState(0);

  // Active question currently being asked
  const [activeQuestion, setActiveQuestion] = useState(questions[0] || null);

  // Answer text
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Completion states
  const [readyToComplete, setReadyToComplete] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedSessionData, setCompletedSessionData] = useState(null);

  // Completed history
  const [history, setHistory] = useState([]);

  // Audio / Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Countdown timer in seconds
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  // Timer Countdown
  useEffect(() => {
    if (isCompleted || readyToComplete || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted, readyToComplete, timeLeft]);

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Final Complete Interview API call
  const handleCompleteInterview = async () => {
    if (!sessionId) {
      showToast('Session reference missing.', 'error');
      return;
    }

    setCompleting(true);
    try {
      const response = await completeSession(sessionId);
      const sessionData = response?.session || response?.data || response;
      setCompletedSessionData(sessionData);
      setIsCompleted(true);
      showToast(response?.message || 'Session completed successfully!', 'success');
    } catch (err) {
      console.error('Complete interview error:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to complete interview session.';
      showToast(msg, 'error');
      // Transition to completed so candidate is not stranded
      setIsCompleted(true);
    } finally {
      setCompleting(false);
    }
  };

  const handleTimeExpired = () => {
    showToast('Interview duration has expired! Automatically completing and submitting interview...', 'warning');
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    stopSpeaking();
    handleCompleteInterview();
  };

  // Text-to-Speech: AI speaks the question
  const speakQuestion = (text) => {
    if (!text || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Automatically read new question out loud when it appears
  useEffect(() => {
    if (activeQuestion?.questionText && !isCompleted && !readyToComplete) {
      speakQuestion(activeQuestion.questionText);
    }
    return () => {
      stopSpeaking();
    };
  }, [activeQuestion, isCompleted, readyToComplete]);

  // Speech Recognition: Candidate can speak answer
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech recognition not supported in your browser. Please type your answer.', 'error');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Microphone active. Speak your answer...', 'info');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setAnswer((prev) => (prev ? `${prev} ${transcript.trim()}` : transcript.trim()));
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  // Submit Answer handler
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!answer.trim()) {
      showToast('Please type or speak your answer before submitting.', 'error');
      return;
    }

    if (!activeQuestion?._id || !sessionId) {
      showToast('Missing question or session reference.', 'error');
      return;
    }

    // Stop recording/speaking if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    stopSpeaking();

    setSubmitting(true);
    try {
      const result = await submitSessionAnswer(sessionId, {
        questionId: activeQuestion._id,
        answer: answer.trim(),
      });

      showToast(result?.message || 'Answer recorded successfully!', 'success');

      // Record in local history
      const answeredItem = {
        question: activeQuestion,
        answer: answer.trim(),
        isFollowUp: Boolean(activeQuestion.isFollowUp),
      };
      setHistory((prev) => [...prev, answeredItem]);

      // Check for follow-up question
      if (!activeQuestion.isFollowUp && result?.followUp && result.followUp.questionText) {
        // AI has a follow-up for this main question!
        showToast('AI Interviewer has a follow-up question for you.', 'info');
        setActiveQuestion({
          ...result.followUp,
          isFollowUp: true,
          parentQuestionOrder: currentMainIndex + 1,
        });
        setAnswer('');
      } else {
        // If we just answered a follow-up (or if no follow-up was provided), move to next main question
        const nextIndex = currentMainIndex + 1;
        if (nextIndex < mainQuestions.length) {
          setCurrentMainIndex(nextIndex);
          setActiveQuestion(mainQuestions[nextIndex]);
          setAnswer('');
        } else {
          // All questions completed! Prompt user to complete interview
          setReadyToComplete(true);
          showToast('All questions answered! You can now complete your interview.', 'success');
        }
      }
    } catch (err) {
      console.error('Submit answer error:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to submit answer. Please try again.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // SCREEN 1: READY TO COMPLETE (Shown when all questions are answered)
  if (readyToComplete && !isCompleted) {
    return (
      <div className="ie-ready-complete-wrapper">
        <div className="ie-ready-complete-card">
          <div className="ie-ready-icon-wrap">
            🎉
          </div>
          <h2>All Questions Completed!</h2>
          <p className="ie-ready-desc">
            Well done, <strong>{candidateName}</strong>! You have answered all {history.length} questions and follow-ups.
          </p>

          <div className="ie-completed-stats-row">
            <div className="ie-stat-card">
              <span className="ie-stat-val">{history.length}</span>
              <span className="ie-stat-lbl">Questions Answered</span>
            </div>
            <div className="ie-stat-card">
              <span className="ie-stat-val">
                {Math.max(1, Math.round((durationMinutes * 60 - timeLeft) / 60))}m
              </span>
              <span className="ie-stat-lbl">Time Spent</span>
            </div>
            <div className="ie-stat-card">
              <span className="ie-stat-val">100%</span>
              <span className="ie-stat-lbl">Finished</span>
            </div>
          </div>

          <div className="ie-ready-note">
            <p>Click below to complete and submit your interview assessment to the recruiter.</p>
          </div>

          <button
            type="button"
            className="submit-button ie-complete-action-btn"
            onClick={handleCompleteInterview}
            disabled={completing}
          >
            {completing ? (
              <>
                <span className="btn-spinner" />
                <span>Completing Interview...</span>
              </>
            ) : (
              <>
                <span>Complete Interview</span>
                <span>✓</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // SCREEN 2: FINAL COMPLETED CONFIRMATION (Scores explicitly NOT shown)
  if (isCompleted) {
    const completedAt =
      completedSessionData?.completedAt ||
      completedSessionData?.updatedAt ||
      new Date().toISOString();

    return (
      <div className="ie-completed-wrapper">
        <div className="ie-completed-card">
          <div className="ie-completed-icon-wrap">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2>Interview Completed Successfully!</h2>
          <p className="ie-completed-sub">
            Thank you, <strong>{candidateName}</strong>. Your technical assessment has been submitted to the recruiting team.
          </p>

          <div className="ie-completed-summary">
            <h4>Assessment Details</h4>
            <div className="ie-summary-item">
              <span>Candidate Name:</span>
              <strong>{candidateName}</strong>
            </div>
            {interview?.jobRole && (
              <div className="ie-summary-item">
                <span>Role:</span>
                <strong>{interview.jobRole}</strong>
              </div>
            )}
            <div className="ie-summary-item">
              <span>Session Reference:</span>
              <code>{sessionId}</code>
            </div>
            <div className="ie-summary-item">
              <span>Total Questions:</span>
              <strong>{history.length}</strong>
            </div>
            <div className="ie-summary-item">
              <span>Status:</span>
              <span className="cs-status-ready">COMPLETED</span>
            </div>
            <div className="ie-summary-item">
              <span>Completed Time:</span>
              <span>{new Date(completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div className="ie-candidate-closing-box">
            <p>
              Your responses have been recorded. The hiring team will review your interview assessment and follow up with you regarding next steps.
            </p>
          </div>

          {onExit && (
            <button type="button" className="submit-button ie-exit-btn" onClick={onExit}>
              Close Session Portal
            </button>
          )}
        </div>
      </div>
    );
  }

  // SCREEN 3: ACTIVE INTERVIEW ENVIRONMENT
  return (
    <div className="interview-env-wrapper">
      {/* Top Session Bar */}
      <header className="ie-top-bar">
        <div className="ie-top-left">
          <div className="ie-brand-badge">
            <span className="ie-brand-pulse" />
            <span>AI Interview Simulator</span>
          </div>
          <span className="ie-candidate-chip">
            👤 {candidateName}
          </span>
          {interview?.jobRole && (
            <span className="ie-role-chip">
              💼 {interview.jobRole}
            </span>
          )}
        </div>

        <div className="ie-top-right">
          <div className={`ie-timer-badge ${timeLeft < 300 ? 'timer-warning' : ''}`}>
            <span className="ie-timer-icon">⏱</span>
            <span className="ie-timer-text">{formatTime(timeLeft)}</span>
          </div>

          <div className="ie-progress-pill">
            <span>Main Q{currentMainIndex + 1} of {mainQuestions.length}</span>
            {activeQuestion?.isFollowUp && (
              <span className="ie-followup-pill">+ Follow-Up</span>
            )}
          </div>

          {history.length > 0 && (
            <button
              type="button"
              className="ie-top-complete-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to finalize and complete the interview now?')) {
                  handleCompleteInterview();
                }
              }}
              disabled={completing}
              title="Finish and submit interview"
            >
              Complete Interview ✓
            </button>
          )}
        </div>
      </header>

      {/* Main Interview Stage */}
      <main className="ie-stage-container">
        {/* Left / Top: AI Interviewer Card */}
        <section className="ie-ai-card" aria-label="AI Interviewer Question">
          <div className="ie-ai-header">
            <div className="ie-ai-avatar-wrap">
              <div className={`ie-ai-avatar ${isSpeaking ? 'speaking-pulse' : ''}`}>
                🤖
              </div>
              <div className="ie-ai-avatar-meta">
                <strong>AI Technical Interviewer</strong>
                <span className="ie-ai-speaking-status">
                  {isSpeaking ? 'Speaking...' : 'Listening for your response'}
                </span>
              </div>
            </div>

            <div className="ie-ai-controls">
              {isSpeaking ? (
                <button
                  type="button"
                  className="ie-audio-btn stop"
                  onClick={stopSpeaking}
                  title="Mute AI voice"
                >
                  🔇 Mute Voice
                </button>
              ) : (
                <button
                  type="button"
                  className="ie-audio-btn speak"
                  onClick={() => speakQuestion(activeQuestion?.questionText)}
                  title="Re-play question voice"
                >
                  🔊 Listen to Question
                </button>
              )}
            </div>
          </div>

          {/* Question Display */}
          <div className="ie-question-box">
            <div className="ie-q-meta-row">
              {activeQuestion?.isFollowUp ? (
                <span className="ie-q-type-badge followup">
                  ⚡ Follow-Up Question
                </span>
              ) : (
                <span className="ie-q-type-badge main">
                  Question {currentMainIndex + 1} of {mainQuestions.length}
                </span>
              )}

              {activeQuestion?.skill && (
                <span className="ie-q-skill-badge">
                  🎯 {activeQuestion.skill}
                </span>
              )}
            </div>

            <h2 className="ie-q-text">
              {activeQuestion?.questionText || 'Loading question...'}
            </h2>
          </div>
        </section>

        {/* Candidate Answer Workspace */}
        <section className="ie-answer-section" aria-label="Candidate Answer">
          <form onSubmit={handleSubmitAnswer} className="ie-answer-form">
            <div className="ie-answer-header">
              <label htmlFor="answer-input" className="ie-answer-label">
                Your Technical Answer
              </label>

              <div className="ie-voice-action-wrap">
                <button
                  type="button"
                  className={`ie-voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={toggleListening}
                  title={isListening ? 'Stop voice recording' : 'Speak your answer using microphone'}
                >
                  <span className="ie-mic-icon">🎙</span>
                  <span>{isListening ? 'Recording... (Click to Stop)' : 'Voice Input'}</span>
                </button>
              </div>
            </div>

            <textarea
              id="answer-input"
              className="ie-answer-textarea"
              rows="6"
              placeholder="Type your explanation or click 'Voice Input' to speak your answer clearly..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitting}
              required
            />

            <div className="ie-answer-footer">
              <span className="ie-word-count">
                {answer.trim() ? `${answer.trim().split(/\s+/).length} words` : '0 words'}
              </span>

              <button
                type="submit"
                className="submit-button ie-submit-btn"
                disabled={submitting || !answer.trim()}
              >
                {submitting ? (
                  <>
                    <span className="btn-spinner" />
                    <span>Submitting Answer...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Proceed</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Previous Answer History Strip */}
        {history.length > 0 && (
          <section className="ie-history-section">
            <div className="ie-history-header">
              <h4>Answered Questions ({history.length})</h4>
            </div>
            <div className="ie-history-list">
              {history.map((item, idx) => (
                <div key={idx} className="ie-history-item">
                  <div className="ie-hi-q-row">
                    <span className="ie-hi-num">
                      {item.isFollowUp ? '⚡ Follow-Up' : `Q${idx + 1}`}
                    </span>
                    <span className="ie-hi-text">{item.question.questionText}</span>
                  </div>
                  <div className="ie-hi-answer">
                    <strong>Your Answer:</strong> {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
