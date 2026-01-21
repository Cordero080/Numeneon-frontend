/**
 * =============================================================================
 * LOGIN PAGE - TODO: NATALIA
 * =============================================================================
 * File: frontend/src/components/pages/Login/Login.jsx
 * Assigned to: NATALIA (API Logic) + PABLO (UI/Styling)
 * Status: TODO 🟡
 * 
 * REFERENCE: See branch 'pablo-working-backup' for working implementation
 * =============================================================================
 * 
 * WHAT THIS FILE DOES:
 * - Renders login form with email and password fields
 * - Validates form input before submission
 * - Calls AuthContext login() function
 * - Redirects to /home on success (or back to where user came from)
 * - Shows error messages on failure
 * 
 * =============================================================================
 * IMPLEMENTATION HINTS:
 * =============================================================================
 * 
 * 1. STATE YOU NEED:
 *    - formData: { email: '', password: '' }
 *    - errors: {} for validation errors
 *    - isLoading: boolean for submit button state
 *    - showPassword: boolean for password visibility toggle
 * 
 * 2. GET login FROM AuthContext:
 *    const { login } = useAuth();
 * 
 * 3. HANDLE REDIRECT FROM PROTECTED ROUTE:
 *    - useLocation() to get location.state?.from?.pathname
 *    - This is where user tried to go before being redirected to login
 *    - After successful login, navigate(from, { replace: true })
 * 
 * 4. FORM VALIDATION:
 *    - Email: required, must match email pattern
 *    - Password: required, min 6 characters
 * 
 * 5. HANDLE SUBMIT:
 *    - Validate form
 *    - Call login(email, password)
 *    - If success: navigate to destination
 *    - If fail: show error message
 * 
 * 6. ICONS AVAILABLE:
 *    - BackArrowGradientIcon - for back button
 *    - EyeIcon, EyeOffIcon - for password visibility toggle
 * 
 * =============================================================================
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import './Login.scss';
import { BackArrowGradientIcon, EyeIcon, EyeOffIcon } from '@assets/icons';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // TODO: Get redirect destination from location.state
  const from = location.state?.from?.pathname || '/home';
  const redirectMessage = location.state?.message;
  
  // TODO: Add form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // TODO: Implement handleChange
  const handleChange = (e) => {
    // HINT: Update formData[e.target.name] with e.target.value
    // HINT: Clear errors[e.target.name] when user types
  };

  // TODO: Implement validateForm
  const validateForm = () => {
    // HINT: Return object of errors like { email: 'Email is required' }
    // Check: email required, email format valid
    // Check: password required, min 6 chars
    return {};
  };

  // TODO: Implement handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // HINT:
    // 1. Validate form
    // 2. If errors, setErrors and return
    // 3. setIsLoading(true)
    // 4. Call login(formData.email, formData.password)
    // 5. If success: navigate(from, { replace: true })
    // 6. If fail: setErrors({ submit: result.error })
    // 7. setIsLoading(false) in finally block
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button onClick={() => navigate('/')} className="back-button" title="Back to Home">
          <BackArrowGradientIcon size={32} />
        </button>
        
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue to Numeneon</p>
        </div>

        {/* Show redirect message if user was redirected from protected route */}
        {redirectMessage && (
          <div className="login-redirect-message">
            {redirectMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* TODO: Email input field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email…"
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* TODO: Password input field with visibility toggle */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password…"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Submit error message */}
          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

          {/* Submit button */}
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don&apos;t have an account? <button onClick={() => navigate('/signup')} className="link-button">Sign up</button></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
