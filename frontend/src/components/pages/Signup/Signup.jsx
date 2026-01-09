// =============================================================================
// 🟡 NATALIA - Auth Lead
// Signup.jsx - User registration page
// =============================================================================
//
// TODO: Create the signup form component
//
// This is where new users create accounts for NUMENEON.
//
// STATE:
// - formData: { username: '', email: '', password: '', confirmPassword: '' }
// - errors: {} for validation errors
// - isLoading: boolean for submit state
// - showPassword: boolean for password visibility
// - showConfirmPassword: boolean for confirm password visibility
//
// FEATURES:
// 1. Username, email, password, confirm password fields
// 2. Validate passwords match before submitting
// 3. Show/hide toggles for both password fields
// 4. Loading state during submission
// 5. Error display for validation/server errors
// 6. Navigate to /login on success
//
// VALIDATION:
// - Username: required, minimum 3 characters
// - Email: required, valid email format
// - Password: required, minimum 6 characters
// - Confirm Password: required, must match password
//
// API CALL:
// - POST to http://localhost:8000/api/auth/signup/
// - Body: { username, email, password }
// - On success: navigate to /login
// - On error: display error message
//
// Think about:
// - Why validate on frontend AND backend?
// - How do you show "passwords don't match" error?
// - What happens after successful signup? (Redirect to login)
//
// Hint: Use fetch() or apiClient for the POST request
// Hint: Check response.ok before processing
// =============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.scss';
import { BackArrowGradientIcon, EyeIcon, EyeOffIcon } from '@assets/icons';

function Signup() {
  // TODO: Set up hooks and state
  // const navigate = useNavigate();
  // const [formData, setFormData] = useState({...});
  // const [errors, setErrors] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // TODO: Create handleChange function for inputs

  // TODO: Create validateForm function
  // Hint: Check all 4 fields, return errors object

  // TODO: Create handleSubmit function
  // Hint: POST to /api/auth/signup/, navigate to /login on success

  // TODO: Return JSX with form
  // Structure:
  // - Container with back button
  // - Header with title "Join NUMENEON"
  // - Form with 4 input fields
  // - Submit button with loading state
  // - Footer with link to login

  return (
    <div className="signup-container">
      {/* Your code here */}
    </div>
  );
}

export default Signup;