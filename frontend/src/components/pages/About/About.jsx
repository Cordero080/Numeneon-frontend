// =============================================================================
// 🟣 CRYSTAL - Friends System Lead
// About.jsx - About page with manifesto and interactive title
// =============================================================================
//
// TODO: Build the about page with grid layout and interactive NUMENEON title
//
// LAYOUT:
// ┌────────────────────────────────────────────────────────────────────────┐
// │                           About                                        │
// │                       N U M E N E O N                                  │
// │            Not another social network. A digital neighborhood.         │
// ├────────────────────────────────────────────────────────────────────────┤
// │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
// │  │ • We're tired... │  │ •• The aesthetic │  │    Pull quote    │     │
// │  │   (manifesto)    │  │    is the msg    │  │                  │     │
// │  └──────────────────┘  └──────────────────┘  └──────────────────┘     │
// │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
// │  │ ••• The internet │  │ •••• Look       │  │ ― Who we are     │     │
// │  │    used to work  │  │                  │  │                  │     │
// │  └──────────────────┘  └──────────────────┘  └──────────────────┘     │
// │                        ┌──────────────────┐                            │
// │                        │  CTA: Your feed  │                            │
// │                        │  should be yours │                            │
// │                        └──────────────────┘                            │
// └────────────────────────────────────────────────────────────────────────┘
//
// IMPORTS:
// - useState, useRef from 'react'
// - About.scss (PROVIDED)
//
// STATE/REFS:
// - hoveredRef: useRef(new Set()) - tracks which letters have been hovered
// - isAnimatingRef: useRef(false) - prevents tracking during animation
// - replayGlitch: false | 'reset' | 'replay' - controls replay animation state
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
// 1. div.about-page
//    2. div.about-hero
//       - span.hero-label: "About"
//       - h1.hero-title.hero-title--interactive (with replay classes)
//         - Map 'NUMENEON' → span.title-letter (same pattern as Landing)
//           - .title-letter--flip for index 0 and 7
//           - .title-letter--{colorVariant}
//           - --hover-delay CSS variable
//           - data-letter attribute
//           - onMouseEnter handler
//       - p.hero-sub: tagline text with <br/>
//    
//    3. div.about-grid (7 grid items)
//       - div.grid-item.manifesto
//         - span.item-number: "•"
//         - h2: "We're tired of the same shit."
//         - p: (algorithmic feeds rant)
//       
//       - div.grid-item.design
//         - span.item-number: "••"
//         - h2: "The aesthetic is the message."
//         - p: (neo-punk explanation)
//       
//       - div.grid-item.pull-quote
//         - blockquote: "We'd rather make something people actually love..."
//       
//       - div.grid-item.timing
//         - span.item-number: "•••"
//         - h2: "The internet used to work."
//         - p: (chronological feed explanation)
//       
//       - div.grid-item.honest
//         - span.item-number: "••••"
//         - h2: "Look"
//         - p: (won't replace Instagram)
//         - p: (design is loud)
//       
//       - div.grid-item.team
//         - span.item-number: "―"
//         - h2: "Who we are."
//         - p: (small crew, no VC)
//       
//       - div.grid-item.cta
//         - span.cta-text: "Your feed should be yours."
// =============================================================================

import { useState, useRef } from 'react';
import './About.scss';

function About() {
  const hoveredRef = useRef(new Set());
  const isAnimatingRef = useRef(false);
  const [replayGlitch, setReplayGlitch] = useState(false);
  
  // TODO: Define arrays
  const hoverDelays = []; // 8 delay values like 0.08, 0.12...
  const colorVariants = []; // 8 colors: 'magenta', 'cyan'...
  
  const handleLetterHover = (index) => {
    // TODO: If animating, return early
    // TODO: Add index to hoveredRef set
    // TODO: If all 8 letters hovered:
    //   - Set isAnimatingRef true
    //   - Reset hoveredRef to new Set()
    //   - Set replayGlitch to 'reset'
    //   - Double requestAnimationFrame → set to 'replay'
    //   - After 4000ms, reset replayGlitch to false, allow tracking again
  };

  return (
    <div className="about-page">
      <div className="about-hero">
        <span className="hero-label">About</span>
        <h1 className={`hero-title hero-title--interactive ${replayGlitch === 'reset' ? 'hero-title--reset' : ''} ${replayGlitch === 'replay' ? 'hero-title--replay' : ''}`}>
          {'NUMENEON'.split('').map((letter, index) => (
            <span
              key={index}
              className={`title-letter ${index === 0 || index === 7 ? 'title-letter--flip' : ''} title-letter--${colorVariants[index]}`}
              style={{ '--hover-delay': `${hoverDelays[index]}s` }}
              data-letter={letter}
              onMouseEnter={() => handleLetterHover(index)}
            >
              {letter}
            </span>
          ))}
        </h1>
        <p className="hero-sub">
          {/* TODO: Add tagline text with <br/> for line breaks */}
        </p>
      </div>

      <div className="about-grid">
        <div className="grid-item manifesto">
          <span className="item-number">•</span>
          <h2>{/* TODO: "We're tired of the same shit." */}</h2>
          <p>{/* TODO: Manifesto paragraph about algorithmic feeds */}</p>
        </div>

        <div className="grid-item design">
          <span className="item-number">••</span>
          <h2>{/* TODO: "The aesthetic is the message." */}</h2>
          <p>{/* TODO: Neo-punk design explanation */}</p>
        </div>

        <div className="grid-item pull-quote">
          <blockquote>
            {/* TODO: Pull quote text */}
          </blockquote>
        </div>

        <div className="grid-item timing">
          <span className="item-number">•••</span>
          <h2>{/* TODO: "The internet used to work." */}</h2>
          <p>{/* TODO: Chronological feed explanation */}</p>
        </div>

        <div className="grid-item honest">
          <span className="item-number">••••</span>
          <h2>{/* TODO: "Look" */}</h2>
          <p>{/* TODO: Won't replace Instagram text */}</p>
          <p>{/* TODO: Design is loud text */}</p>
        </div>

        <div className="grid-item team">
          <span className="item-number">―</span>
          <h2>{/* TODO: "Who we are." */}</h2>
          <p>{/* TODO: Small crew, no VC text */}</p>
        </div>

        <div className="grid-item cta">
          <span className="cta-text">{/* TODO: "Your feed should be yours." */}</span>
        </div>
      </div>
    </div>
  );
}

export default About;
