// =============================================================================
// 🔵 PABLO - UI Architect
// App.jsx - Main routing and layout structure
// =============================================================================
//
// TODO: Create the main application component with routing
//
// This is the root component that handles:
// 1. React Router setup with all page routes
// 2. Conditional rendering of TopBar and SideNav
// 3. Theme initialization from localStorage
// 4. Background decorations (blob elements)
//
// ROUTES:
// - / → Landing (public)
// - /login → Login (public)
// - /signup → Signup (public)
// - /home → Home (protected)
// - /profile → Current user's profile (protected)
// - /profile/:username → Other user's profile (protected)
// - /about → About page (protected)
// - /friends → Friends page (protected)
// - * → NotFound (404 catch-all)
//
// LAYOUT LOGIC:
// - TopBar and SideNav should NOT show on:
//   - Landing page (/)
//   - Login page (/login)
//   - Signup page (/signup)
// - They SHOULD show on all other pages
//
// THEME INITIALIZATION:
// - useEffect on mount to read theme from localStorage
// - Apply to document.documentElement.dataset.theme
//
// PROTECTED ROUTES:
// - Wrap protected pages with <ProtectedRoute> component
// - Example: <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>} />
//
// Think about:
// - Why wrap AppContent separately from BrowserRouter?
// - Why use useLocation inside AppContent?
// - What order should Routes be in? (Specific before catch-all)
//
// Hint: const location = useLocation();
// Hint: const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
// Hint: {!isAuthPage && !isLandingPage && <TopBar />}
// =============================================================================

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
// Layout components
import TopBar from './components/layout/TopBar';
import SideNav from './components/layout/SideNav';
// Page components
import Landing from './components/pages/Landing';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import SignUp from './components/pages/Signup';
import Profile from './components/pages/Profile';
import About from './components/pages/About';
import Friends from './components/pages/Friends';
import NotFound from './components/pages/NotFound';
// Protected Route
import ProtectedRoute from './components/ui/ProtectedRoute';
// Contexts
import { MessageProvider } from './contexts';

function AppContent() {
  // TODO: Get current location for conditional nav rendering
  // const location = useLocation();

  // TODO: Initialize theme from localStorage on mount
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('theme') || 'dark';
  //   document.documentElement.dataset.theme = savedTheme;
  // }, []);

  // TODO: Determine if current page should hide nav
  // const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  // const isLandingPage = location.pathname === '/';

  // TODO: Return JSX with:
  // - Conditional TopBar (not on landing/auth)
  // - Background blob decorations
  // - Routes for all pages (protected routes wrapped)
  // - Conditional SideNav (not on landing/auth)

  return (
    <div className="App">
      {/* Your code here */}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MessageProvider>
        <AppContent />
      </MessageProvider>
    </BrowserRouter>
  );
}

export default App;