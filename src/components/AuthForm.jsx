import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';
import userIcon from '../assets/icons/user.svg';
import mailIcon from '../assets/icons/mail.svg';
import lockIcon from '../assets/icons/lock.svg';
import eyeIcon from '../assets/icons/eye.svg';
import arrowRightIcon from '../assets/icons/arrow-right.svg';

export default function AuthForm() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(
      'simulator_user',
      JSON.stringify({
        name: isSignUp ? formData.fullName : formData.email.split('@')[0],
        email: formData.email,
      })
    );
    navigate('/dashboard');
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

      <form onSubmit={handleSubmit} className="auth-form">
        {isSignUp && (
          <InputField
            id="fullName"
            name="fullName"
            label="Full Name"
            type="text"
            placeholder="Enter your name"
            icon={userIcon}
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        )}

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

        <button type="submit" className="submit-button">
          <span>{isSignUp ? 'Sign Up' : 'Log In'}</span>
          <img src={arrowRightIcon} alt="" className="btn-arrow-icon" />
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
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
