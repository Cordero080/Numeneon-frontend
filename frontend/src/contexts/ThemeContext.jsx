// =============================================================================
// 🟠 TITO - Infrastructure Lead
// ThemeContext.jsx - Global theme state (dark/light mode)
// =============================================================================
//
// TODO: Create a context that manages the app's color theme
//
// This context provides:
// - theme: Current theme ('dark' or 'light')
// - toggleTheme: Function to switch between themes
//
// REQUIREMENTS:
// 1. Initialize theme from localStorage (or default to 'dark')
// 2. Apply theme to document via data-theme attribute
// 3. Persist changes to localStorage
// 4. Provide toggleTheme function
// 5. Export useTheme hook for easy consumption
//
// How it works:
// - CSS uses [data-theme="dark"] and [data-theme="light"] selectors
// - Setting document.documentElement.setAttribute('data-theme', theme)
//   makes all themed CSS variables switch automatically
//
// State:
// - theme: 'dark' | 'light'
//
// Think about:
// - How do you read from localStorage on initial load?
// - When should you update localStorage?
// - What if localStorage doesn't have a saved theme?
//
// Hint: useState can take a function for lazy initialization
// Hint: useEffect to sync theme changes to DOM and localStorage
// Hint: document.documentElement.setAttribute('data-theme', theme)
// =============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // TODO: Initialize theme state from localStorage or default to 'dark'
  // Hint: const [theme, setTheme] = useState(() => { ... });
  
  // TODO: useEffect to apply theme to document and save to localStorage
  // Hint: document.documentElement.setAttribute('data-theme', theme);
  // Hint: localStorage.setItem('theme', theme);
  
  // TODO: Create toggleTheme function
  // Hint: setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  
  // TODO: Return provider with value={{ theme, toggleTheme }}
  // Your code here
};

export const useTheme = () => {
  // TODO: Return useContext(ThemeContext) with error check
  // Your code here
};

export default ThemeContext;
