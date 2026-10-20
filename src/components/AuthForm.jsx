import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';
import { signupUser, loginUser } from '../services';
import userIcon from '../assets/icons/user.svg';
import mailIcon from '../assets/icons/mail.svg';
import lockIcon from '../assets/icons/lock.svg';
import eyeIcon from '../assets/icons/eye.svg';
import arrowRightIcon from '../assets/icons/arrow-right.svg';

export default function AuthForm() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Build payload matching { username, email, password }
    const usernameValue = formData.username.trim() || formData.email.split('@')[0];
    const payload = {
      username: usernameValue,
      email: formData.email.trim(),
      password: formData.password,
    };

    if (isSignUp && !formData.username.trim()) {
      setErrorMsg('Please enter your username.');
      return;
    }
    if (!payload.email) {
      setErrorMsg('Please enter your email.');
      return;
    }
    if (!payload.password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      let response;
      if (isSignUp) {
        response = await signupUser(payload);
        setSuccessMsg(response?.message || 'Account created successfully!');
      } else {
        response = await loginUser(payload);
        setSuccessMsg(response?.message || 'Logged in successfully!');
      }

      // Store user info in localStorage for Dashboard display
      const userData = response?.user || response?.data || {
        username: payload.username,
        email: payload.email,
      };
      localStorage.setItem('simulator_user', JSON.stringify(userData));

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      console.error('Form submission error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-card">
      <div className="auth-form-header">
        <span className="welcome-tag">{isSignUp ? 'Welcome!' : 'Welcome back!'}</span>
        <h2 className="form-title">{isSignUp ? 'Create your account' : 'Log in to your account'}</h2>
        <p className="form-subtitle">
          {isSignUp
            ? 'Start your journey towards a better future.'
            : 'Enter your credentials to continue your practice.'}
        </p>
      </div>

      {errorMsg && (
        <div className="auth-error-banner" role="alert">
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="auth-success-banner" role="status">
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Username field */}
        <InputField
          id="username"
          name="username"
          label="Username"
          type="text"
          placeholder="Enter your username"
          icon={userIcon}
          value={formData.username}
          onChange={handleChange}
          required={isSignUp}
        />

        {/* Email Address */}
        <InputField
          id="email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon={mailIcon}
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password */}
        <InputField
          id="password"
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
          icon={lockIcon}
          value={formData.password}
          onChange={handleChange}
          required
          rightElement={
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <img src={eyeIcon} alt="" className={`eye-icon ${showPassword ? 'eye-active' : ''}`} />
            </button>
          }
        />

        {/* Submit button with loading spinner */}
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? (
            <span className="btn-spinner" />
          ) : (
            <>
              <span>{isSignUp ? 'Sign Up' : 'Log In'}</span>
              <img src={arrowRightIcon} alt="" className="btn-arrow-icon" />
            </>
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span className="divider-line" />
        <span className="divider-text">OR</span>
        <span className="divider-line" />
      </div>

      <div className="auth-footer">
        <p>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="auth-toggle-btn"
            onClick={handleToggleMode}
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
