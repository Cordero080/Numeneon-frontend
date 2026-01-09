// =============================================================================
// 🟠 TITO - Infrastructure Lead
// main.jsx - Application entry point
// =============================================================================
//
// TODO: Set up the React application entry point
//
// This file bootstraps the entire React application. It:
// 1. Creates the React root element
// 2. Wraps App with all necessary Context Providers
// 3. Imports global styles
//
// CONTEXT PROVIDER ORDER MATTERS!
// - AuthProvider must be FIRST (other contexts need auth state)
// - PostsProvider and FriendsProvider depend on AuthProvider
// - SearchProvider can be anywhere
// - App goes inside all providers
//
// Think about:
// - Why does StrictMode help during development?
// - What happens if you put PostsProvider outside AuthProvider?
// - How do nested providers pass data down?
//
// Hint: createRoot(document.getElementById('root')).render(...)
// Hint: Providers wrap each other like nesting dolls
// Hint: Import styles BEFORE App so they're available immediately
//
// Provider nesting structure:
//   <AuthProvider>
//     <PostsProvider>
//       <FriendsProvider>
//         <SearchProvider>
//           <App />
//         </SearchProvider>
//       </FriendsProvider>
//     </PostsProvider>
//   </AuthProvider>
// =============================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss'
import App from './App.jsx'
// Context Providers
import { AuthProvider } from './contexts/AuthContext'
import { PostsProvider } from './contexts/PostsContext'
import { FriendsProvider } from './contexts/FriendsContext'
import { SearchProvider } from './contexts/SearchContext'

// TODO: Render the app with all providers
// Your code here
