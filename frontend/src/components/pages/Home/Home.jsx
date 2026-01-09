// =============================================================================
// 🔵 PABLO - UI Architect
// Home.jsx - Main home feed page with composer, stories, and timeline
// =============================================================================
//
// TODO: Build the main home feed page
//
// LAYOUT:
// ┌────────────────────────────────────────────────────────────────────────┐
// │  ┌─────────────────────────────────────────────────────────────────┐  │
// │  │ [avatar] [Share something…_______________] [expand btn]         │  │
// │  └─────────────────────────────────────────────────────────────────┘  │
// │                                                                        │
// │  ┌─────────────────────────────────────────────────────────────────┐  │
// │  │ [Your Story] [Friend1] [Friend2] [Friend3] → (scrollable)       │  │
// │  └─────────────────────────────────────────────────────────────────┘  │
// │                                                                        │
// │  ┌─────────────────────────────────────────────────────────────────┐  │
// │  │                    TimelineRiverFeed                            │  │
// │  │                    (posts from context)                         │  │
// │  └─────────────────────────────────────────────────────────────────┘  │
// │                                                                        │
// │  [ComposerModal - shown when showComposer is true]                    │
// └────────────────────────────────────────────────────────────────────────┘
//
// IMPORTS:
// - useState from react
// - TimelineRiverFeed from './components/TimelineRiverFeed'
// - ComposerModal from '@Profile/components/ComposerModal/ComposerModal'
// - usePosts, useFriends from '@contexts'
// - Icons: UserIcon, PostTriangleIcon, MaximizeIcon from '@assets/icons'
// - Home.scss (PROVIDED)
//
// FROM CONTEXT:
// - usePosts(): { posts, createPost, deletePost, updatePost }
// - useFriends(): { friends }
//
// STATE VARIABLES:
// - showComposer: Boolean - controls if ComposerModal is open
// - composerType: 'thought' | 'media' | 'milestone' - type of post being created
// - composerText: String - text in the inline composer textarea
// - isPosting: Boolean - loading state while creating post
// - activeCommentPostId: Number|null - which post has comment box open
// - commentText: String - what user is typing in comment box
//
// HELPER FUNCTIONS:
// - getInitials(firstName, lastName, username): Returns "AB" from "Arthur Bernier"
//   - If firstName + lastName exist: return first letters
//   - If only firstName: return first 2 chars
//   - Fallback: return first 2 chars of username
//
// HANDLERS:
// - handleInlineKeyDown(e): 
//   - If Cmd/Ctrl + Enter: prevent default, call handleInlinePost
//
// - handleInlinePost():
//   - If no text or already posting, return early
//   - Set isPosting true
//   - Call createPost({ content, type: 'thoughts' })
//   - Set isPosting false
//   - If success: clear composerText
//   - If error: show alert
//
// - handleStoryMouseMove(e): 3D tilt effect on hover
//   - Get card element and its bounding rect
//   - Calculate mouse position relative to card
//   - Calculate rotation based on distance from center (max ±1 degree)
//   - Apply transform: translateY + rotateX + rotateY + scale
//
// - handleStoryMouseLeave(e): Reset card transform
//
// DERIVED DATA:
// - stories: Array built from friends
//   - First item: { id: 0, name: "Your Story", hasStory: false, isYours: true }
//   - Rest: map friends to { id, name: username, avatar: initials, hasStory: true }
//
// JSX STRUCTURE:
// 1. div.feed-container
//    2. div.composer-section
//       - div.composer-avatar with UserIcon
//       - div.composer-input-wrapper
//         - textarea.composer-input (controlled by composerText)
//         - PostTriangleIcon (shown when text exists, not posting)
//       - button.composer-expand-btn with MaximizeIcon (opens modal)
//    
//    3. div.stories-section
//       - div.stories-scroll
//         - Map stories → div.story-card (with mouse handlers for 3D effect)
//           - div.story-avatar (with/without has-story class)
//             - If isYours: div.add-story-icon with "+"
//             - Else: UserIcon
//           - div.story-name
//    
//    4. TimelineRiverFeed component (pass all props for posts and comments)
//    
//    5. ComposerModal component (pass showComposer state and setters)
// =============================================================================

import { useState } from 'react';
import './Home.scss';
import TimelineRiverFeed from './components/TimelineRiverFeed';
import ComposerModal from '@Profile/components/ComposerModal/ComposerModal';
import { usePosts, useFriends } from '@contexts';
import { UserIcon, PostTriangleIcon, MaximizeIcon } from '@assets/icons';

function Home() {
  const { posts, createPost, deletePost, updatePost } = usePosts();
  const { friends } = useFriends();
  
  const [showComposer, setShowComposer] = useState(false);
  const [composerType, setComposerType] = useState('thought');
  const [composerText, setComposerText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  
  const getInitials = (firstName, lastName, username) => {
    // TODO: Return initials from name or username
  };
  
  const handleInlineKeyDown = (e) => {
    // TODO: If Cmd/Ctrl + Enter, prevent default and call handleInlinePost
  };
  
  const handleInlinePost = async () => {
    // TODO: If no text or isPosting, return early
    // TODO: Set isPosting true
    // TODO: Call createPost({ content: composerText, type: 'thoughts' })
    // TODO: Set isPosting false
    // TODO: If success, clear composerText; else show alert
  };
  
  const handleStoryMouseMove = (e) => {
    // TODO: 3D tilt effect on story cards
    // Get card bounds, calculate mouse position relative to center
    // Apply transform with rotateX, rotateY, translateY, scale
  };
  
  const handleStoryMouseLeave = (e) => {
    // TODO: Reset card transform to initial state
  };
  
  // TODO: Build stories array from friends
  const stories = [
    { id: 0, name: 'Your Story', hasStory: false, isYours: true },
    // TODO: Map friends to story objects
  ];

  return (
    <div className="feed-container">
      <div className="composer-section">
        <div className="composer-avatar">
          <UserIcon size={24} />
        </div>
        <div className="composer-input-wrapper">
          <textarea
            className="composer-input"
            placeholder="Share something…"
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
            onKeyDown={handleInlineKeyDown}
          />
          {composerText && !isPosting && (
            <PostTriangleIcon size={20} onClick={handleInlinePost} />
          )}
        </div>
        <button 
          className="composer-expand-btn"
          onClick={() => setShowComposer(true)}
        >
          <MaximizeIcon size={20} />
        </button>
      </div>

      <div className="stories-section">
        <div className="stories-scroll">
          {stories.map((story) => (
            <div 
              key={story.id} 
              className="story-card"
              onMouseMove={handleStoryMouseMove}
              onMouseLeave={handleStoryMouseLeave}
            >
              <div className={`story-avatar ${story.hasStory ? 'has-story' : ''}`}>
                {story.isYours ? (
                  <div className="add-story-icon">+</div>
                ) : (
                  <UserIcon size={20} />
                )}
              </div>
              <div className="story-name">{story.name}</div>
            </div>
          ))}
        </div>
      </div>

      <TimelineRiverFeed
        posts={posts}
        activeCommentPostId={activeCommentPostId}
        setActiveCommentPostId={setActiveCommentPostId}
        commentText={commentText}
        setCommentText={setCommentText}
        onDeletePost={deletePost}
        onUpdatePost={updatePost}
      />

      <ComposerModal
        showComposer={showComposer}
        setShowComposer={setShowComposer}
        composerType={composerType}
        setComposerType={setComposerType}
      />
    </div>
  );
}

export default Home;