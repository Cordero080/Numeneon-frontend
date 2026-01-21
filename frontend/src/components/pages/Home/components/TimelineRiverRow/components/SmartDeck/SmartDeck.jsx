// 🔵 PABLO - UI Component
// SmartDeck.jsx - Card deck display with navigation for a post type

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ThoughtBubbleIcon,
  ImageIcon,
  StarIcon
} from '@assets/icons';
import './SmartDeck.scss';

const typeConfig = {
  thoughts: { label: 'Thoughts', color: '#4fffff' },
  media: { label: 'Media', color: '#c9a8ff' },
  milestones: { label: 'Milestones', color: '#1ae784' }
};

const typeIcons = {
  thoughts: <ThoughtBubbleIcon className="smart-deck-icon-svg" />,
  media: <ImageIcon className="smart-deck-icon-svg" />,
  milestones: <StarIcon className="smart-deck-icon-svg" />
};

/**
 * SmartDeckHeader - Just the clickable tab header
 * Used in the fixed 3-column header row
 */
export function SmartDeckHeader({
  type,
  count,
  isCollapsed,
  isRecentType,
  onCollapse,
  onExpand
}) {
  const config = typeConfig[type];
  
  return (
    <button 
      className={`smart-deck-header smart-deck-header--${type}${isRecentType && !isCollapsed ? ' smart-deck-header--recent' : ''}${isCollapsed ? ' smart-deck-header--collapsed' : ''}`}
      onClick={() => isCollapsed ? onExpand?.(type) : onCollapse?.(type)}
      title={isCollapsed ? "Click to expand" : "Click to collapse"}
    >
      <span className="smart-deck-icon">{typeIcons[type]}</span>
      <span className="smart-deck-label">{config.label}</span>
      <span className="smart-deck-count">{count}</span>
      {!isCollapsed && <span className="smart-deck-collapse-icon">−</span>}
    </button>
  );
}

/**
 * SmartDeckContent - The card content with navigation
 * Used in the flexible content row (only when expanded)
 */
export function SmartDeckContent({
  posts,
  type,
  currentIndex,
  onNextCard,
  onPrevCard,
  onSelectCard,
  renderPostCard
}) {
  if (posts.length === 0) return null;

  const currentPost = posts[currentIndex];
  const totalCards = posts.length;

  return (
    <div className={`smart-deck-content smart-deck-content--${type}`}>
      {/* Current card */}
      <div className="smart-deck-card-container">
        {renderPostCard(currentPost, type)}
      </div>
      
      {/* Navigation for multiple cards */}
      {totalCards > 1 && (
        <div className="smart-deck-nav">
          <span className="smart-deck-nav-position">
            {currentIndex + 1}/{totalCards}
          </span>
          <button 
            className="smart-deck-nav-btn"
            onClick={(e) => {
              e.stopPropagation();
              onPrevCard(type, totalCards);
            }}
            aria-label="Previous card"
          >
            <ChevronLeftIcon size={16} />
          </button>
          
          <div className="smart-deck-dots">
            {posts.map((_, idx) => (
              <span 
                key={idx} 
                className={`smart-deck-dot ${idx === currentIndex ? 'smart-deck-dot--active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCard(type, idx);
                }}
              />
            ))}
          </div>
          
          <button 
            className="smart-deck-nav-btn"
            onClick={(e) => {
              e.stopPropagation();
              onNextCard(type, totalCards);
            }}
            aria-label="Next card"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * SmartDeck - Combined header + content (legacy, for backwards compatibility)
 */
function SmartDeck({
  posts,
  type,
  currentIndex,
  onNextCard,
  onPrevCard,
  onSelectCard,
  isRecentType,
  renderPostCard,
  isCollapsed = false,
  onCollapse,
  onExpand,
  userName
}) {
  if (posts.length === 0) return null;

  const currentPost = posts[currentIndex];
  const totalCards = posts.length;
  const config = typeConfig[type];

  // Collapsed view - small icon-only button
  if (isCollapsed) {
    return (
      <button 
        className={`smart-deck-collapsed smart-deck-collapsed--${type}`}
        onClick={() => onExpand?.(type)}
        title={`Click to expand ${config.label}`}
      >
        <span className="smart-deck-collapsed-icon">{typeIcons[type]}</span>
        <span className="smart-deck-collapsed-count">{totalCards}</span>
      </button>
    );
  }

  return (
    <div className={`smart-deck smart-deck--${type}${isRecentType ? ' smart-deck--recent' : ''}`}>
      {/* Deck Header - icon, label, count with clickable collapse */}
      <button 
        className="smart-deck-header"
        onClick={() => onCollapse?.(type)}
        title="Click to collapse"
      >
        <span className="smart-deck-icon">{typeIcons[type]}</span>
        <span className="smart-deck-label">{config.label}</span>
        <span className="smart-deck-count">{totalCards}</span>
        <span className="smart-deck-collapse-icon">−</span>
      </button>
      
      {/* Current card */}
      <div className="smart-deck-card-container">
        {renderPostCard(currentPost, type)}
      </div>
      
      {/* Navigation for multiple cards */}
      {totalCards > 1 && (
        <div className="smart-deck-nav">
          {/* Position indicator - shown above nav on mobile */}
          <span className="smart-deck-nav-position">
            {currentIndex + 1}/{totalCards}
          </span>
          <button 
            className="smart-deck-nav-btn"
            onClick={(e) => {
              e.stopPropagation();
              onPrevCard(type, totalCards);
            }}
            aria-label="Previous card"
          >
            <ChevronLeftIcon size={16} />
          </button>
          
          {/* Dot indicators */}
          <div className="smart-deck-dots">
            {posts.map((_, idx) => (
              <span 
                key={idx} 
                className={`smart-deck-dot ${idx === currentIndex ? 'smart-deck-dot--active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCard(type, idx);
                }}
              />
            ))}
          </div>
          
          <button 
            className="smart-deck-nav-btn"
            onClick={(e) => {
              e.stopPropagation();
              onNextCard(type, totalCards);
            }}
            aria-label="Next card"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default SmartDeck;
