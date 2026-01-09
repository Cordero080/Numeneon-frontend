// =============================================================================
// 🟡 NATALIA - Auth Lead
// Login.jsx - User login page
// =============================================================================
//
// TODO: Create the login form component
//
// This is where existing users sign in to NUMENEON.
// IMPORTANT: Login uses EMAIL, not username!
//
// STATE:
// - formData: { email: '', password: '' }
// - errors: {} for validation errors
// - isLoading: boolean for submit state
// - showPassword: boolean for password visibility toggle
//
// FEATURES:
// 1. Email and password input fields
// 2. Form validation (email format, password length)
// 3. Show/hide password toggle
// 4. "Remember me" checkbox (optional)
// 5. "Forgot password" link (placeholder)
// 6. Loading state during submission
// 7. Error display for invalid credentials
// 8. Redirect to original destination after login
//
// INTEGRATION:
// - useAuth() hook for login() function
// - useNavigate() for redirect after success
// - useLocation() to get redirect destination from ProtectedRoute
//
// REDIRECT LOGIC:
// - ProtectedRoute passes { from: location, message: '...' } in state
// - After successful login, navigate(from, { replace: true })
// - This sends user back to where they were trying to go
//
// VALIDATION:
// - Email: required, must be valid email format
// - Password: required, minimum 6 characters
//
// Think about:
// - How do controlled inputs work? (value + onChange)
// - What prevents page refresh on submit? (e.preventDefault())
// - When do you show loading state?
// - How do you clear errors when user starts typing?
//
// Hint: const { login } = useAuth();
// Hint: const from = location.state?.from?.pathname || '/home';
// Hint: After login succeeds, navigate(from, { replace: true });
// =============================================================================

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import './Login.scss';
import { BackArrowGradientIcon, EyeIcon, EyeOffIcon } from '@assets/icons';

function Login() {
  // TODO: Set up hooks
  // const navigate = useNavigate();
  // const location = useLocation();
  // const { login } = useAuth();
  // const from = location.state?.from?.pathname || '/home';
  // const redirectMessage = location.state?.message;

  // TODO: Set up state
  // const [formData, setFormData] = useState({ email: '', password: '' });
  // const [errors, setErrors] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);

  // TODO: Create handleChange function for inputs
  // Hint: Update formData and clear related error

  // TODO: Create validateForm function
  // Hint: Check email format and password length
  // Hint: Return object with field names as keys, error messages as values

  // TODO: Create handleSubmit function
  // Hint: e.preventDefault()
  // Hint: Validate, then call login(), then navigate on success

  // TODO: Return JSX with form
  // Structure:
  // - Container with back button
  // - Header with title and subtitle
  // - Redirect message if present
  // - Form with email input, password input (with toggle), submit button
  // - Footer with link to signup

  return (
    <div className="login-container">
      {/* Your code here */}
    </div>
  );
}

export default Login;