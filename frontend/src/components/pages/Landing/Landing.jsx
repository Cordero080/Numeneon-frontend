// =============================================================================
// 🔵 PABLO - UI Architect
// Landing.jsx - Public landing/welcome page with animated title
// =============================================================================
//
// TODO: Build the landing page with animated NUMENEON title
//
// LAYOUT:
// ┌────────────────────────────────────────────────────────────────────────┐
// │                                                                        │
// │                                                                        │
// │                         N U M E N E O N                                │
// │                    (each letter animated separately)                   │
// │                                                                        │
// │                     [Login]  [Sign Up]                                │
// │                        or                                              │
// │                       [Enter]  (if authenticated)                      │
// │                                                                        │
// └────────────────────────────────────────────────────────────────────────┘
//
// IMPORTS:
// - useNavigate from 'react-router-dom'
// - useMemo, useState, useRef from 'react'
// - useAuth from '@contexts/AuthContext'
// - Landing.scss (PROVIDED)
//
// CONSTANTS:
// - PHI: Golden ratio = (1 + Math.sqrt(5)) / 2 ≈ 1.618
// - BLOB_FADE_DELAY: 1.0s (wait for background blobs)
// - PAGE_FADE_DURATION: 0.8s (page fade-in time)
// - TOTAL_WAIT: BLOB_FADE_DELAY + PAGE_FADE_DURATION
//
// FROM CONTEXT:
// - useAuth(): { isAuthenticated, isLoading }
//
// STATE/REFS:
// - hoveredRef: useRef(new Set()) - tracks which letters have been hovered
// - isAnimatingRef: useRef(false) - prevents tracking during animation
// - replayGlitch: false | 'reset' | 'replay' - controls replay animation state
//
// COMPUTED (useMemo):
// - letterDelays: Array of 8 delay values for each letter animation
//   - Uses Weyl sequence: ((i + 1) * PHI) % 1
//   - Scale to 0.6s max delay, offset by TOTAL_WAIT
//   - This creates beautiful pseudo-random delays using golden ratio
//
// ARRAYS:
// - hoverDelays: [0.08, 0.12, 0.05, 0.14, 0.09, 0.11, 0.07, 0.13]
// - colorVariants: ['magenta', 'cyan', 'aqua', 'purple', 'blue', 'orange', 'pink', 'green']
//
// HANDLERS:
// - handleLetterHover(index):
//   - If animating, return early
//   - Add index to hoveredRef set
//   - If all 8 letters hovered:
//     - Set isAnimatingRef true
//     - Reset hoveredRef to new Set
//     - Set replayGlitch to 'reset'
//     - Use double requestAnimationFrame then set to 'replay'
//     - After 4000ms, reset replayGlitch to false and allow tracking again
//
// JSX STRUCTURE:
// 1. div.landing-container
//    2. h1.landing-title (with conditional replay classes)
//       - Map 'NUMENEON'.split('') → span.title-letter
//         - Add .title-letter--flip for index 0 and 7 (first/last N)
//         - Add .title-letter--{colorVariant} for unique colors
//         - Set animationDelay from letterDelays
//         - Set --hover-delay CSS variable from hoverDelays
//         - Set data-letter attribute
//         - onMouseEnter calls handleLetterHover(index)
//    
//    3. div.auth-buttons
//       - If authenticated: single "Enter" button → navigate('/home')
//       - If not authenticated: "Login" and "Sign Up" buttons
// =============================================================================

import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useRef } from 'react';
import { useAuth } from '@contexts/AuthContext';
import './Landing.scss';

const PHI = (1 + Math.sqrt(5)) / 2;

function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  
  const hoveredRef = useRef(new Set());
  const isAnimatingRef = useRef(false);
  const [replayGlitch, setReplayGlitch] = useState(false);
  
  // TODO: Calculate letter delays using golden ratio
  const letterDelays = useMemo(() => {
    const BLOB_FADE_DELAY = 1.0;
    const PAGE_FADE_DURATION = 0.8;
    const TOTAL_WAIT = BLOB_FADE_DELAY + PAGE_FADE_DURATION;
    // TODO: Use Weyl sequence: ((i + 1) * PHI) % 1 for each of 8 letters
    // Scale to 0.6s max delay, offset by TOTAL_WAIT
    return Array(8).fill(TOTAL_WAIT); // Replace with actual calculation
  }, []);
  
  const hoverDelays = []; // TODO: 8 values like 0.08, 0.12, 0.05...
  const colorVariants = []; // TODO: 8 colors like 'magenta', 'cyan'...
  
  const handleLetterHover = (index) => {
    // TODO: If animating, return early
    // TODO: Add index to hoveredRef set
    // TODO: If all 8 letters hovered:
    //   - Set isAnimatingRef true, reset hoveredRef
    //   - Set replayGlitch to 'reset'
    //   - Double requestAnimationFrame → set to 'replay'
    //   - After 4000ms, reset replayGlitch to false
  };

  return (
    <div className="landing-container">
      <h1 className={`landing-title ${replayGlitch === 'reset' ? 'landing-title--reset' : ''} ${replayGlitch === 'replay' ? 'landing-title--replay' : ''}`}>
        {'NUMENEON'.split('').map((letter, index) => (
          <span
            key={index}
            className={`title-letter ${index === 0 || index === 7 ? 'title-letter--flip' : ''} title-letter--${colorVariants[index]}`}
            style={{ 
              animationDelay: `${letterDelays[index]}s`,
              '--hover-delay': `${hoverDelays[index]}s`
            }}
            data-letter={letter}
            onMouseEnter={() => handleLetterHover(index)}
          >
            {letter}
          </span>
        ))}
      </h1>
      
      <div className="auth-buttons">
        {/* TODO: If isLoading, show nothing or loading state */}
        {/* TODO: If isAuthenticated, show single Enter button */}
        {/* TODO: If not authenticated, show Login and Sign Up buttons */}
        {isAuthenticated ? (
          <button onClick={() => navigate('/home')}>
            {/* TODO: Button text */}
          </button>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>
              {/* TODO: Login button text */}
            </button>
            <button onClick={() => navigate('/signup')}>
              {/* TODO: Sign Up button text */}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Landing;
