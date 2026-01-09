// =============================================================================
// 🔵 PABLO - UI Architect
// NotFound.jsx - 404 error page
// =============================================================================
//
// TODO: Build a simple 404 page for unknown routes
//
// LAYOUT:
// ┌────────────────────────────────────────────────────────────────────────┐
// │                                                                        │
// │                                                                        │
// │                               404                                      │
// │                                                                        │
// │                         Page Not Found                                 │
// │                                                                        │
// │        The page you're looking for doesn't exist or has been moved.   │
// │                                                                        │
// │                         [Go Back Home]                                 │
// │                                                                        │
// │                                                                        │
// └────────────────────────────────────────────────────────────────────────┘
//
// IMPORTS:
// - Link from 'react-router-dom'
// - NotFound.scss (PROVIDED)
//
// STATE: None needed - this is a simple static page
//
// JSX STRUCTURE:
// 1. div.not-found
//    2. div.not-found__content
//       - h1.not-found__code: "404"
//       - h2.not-found__title: "Page Not Found"
//       - p.not-found__message: explanation text
//       - Link.not-found__link to="/": "Go Back Home"
// =============================================================================

import { Link } from 'react-router-dom';
import './NotFound.scss';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__code">{/* TODO: 404 */}</h1>
        <h2 className="not-found__title">{/* TODO: Page Not Found */}</h2>
        <p className="not-found__message">
          {/* TODO: The page you're looking for doesn't exist or has been moved. */}
        </p>
        <Link to="/" className="not-found__link">
          {/* TODO: Go Back Home */}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
