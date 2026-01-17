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

function SmartDeck({
  posts,
  type,
  currentIndex,
  onNextCard,
  onPrevCard,
  onSelectCard,
  isRecentType,
  renderPostCard
}) {
  if (posts.length === 0) return null;

  const currentPost = posts[currentIndex];
  const totalCards = posts.length;
  const config = typeConfig[type];

  return (
    <div className={`smart-deck smart-deck--${type}${isRecentType ? ' smart-deck--recent' : ''}`}>
      {/* Deck Header - icon, label and count */}
      <div className="smart-deck-header">
        <span className="smart-deck-icon">{typeIcons[type]}</span>
        <span className="smart-deck-label">{config.label}</span>
        <span className="smart-deck-count">{totalCards}</span>
      </div>
      
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
