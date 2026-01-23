// 🔵 PABLO - UI Architect
// TimelineRiverRow.jsx - Single row in timeline showing one user's posts across 3 columns
// Refactored: Components extracted to ./components/

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TimelineRiverRow.scss';
import MediaLightbox from '../MediaLightbox/MediaLightbox';
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal';
import { useAuth, usePosts, useMessages } from '@contexts';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, CheckIcon, CloseIcon, ThoughtBubbleIcon, ImageIcon, StarIcon, UserIcon } from '@assets/icons';
import { createPortal } from 'react-dom';

// Extracted components
import { PostCard, MobileTabNav } from './components';
import SmartDeck, { SmartDeckContent } from './components/SmartDeck/SmartDeck';

function TimelineRiverRow({ rowData, onCommentClick, activeCommentPostId, commentText, setCommentText, setActiveCommentPostId, onDeletePost, onUpdatePost }) {
  // 🔵 Extract data from props
  const { user } = rowData;
  const { user: currentUser } = useAuth();
  const { posts, fetchReplies, createReply, deletePost, updatePost, likePost, sharePost, collapsedDecks, collapseDeck, expandDeck } = usePosts();
  const { openMessages } = useMessages();
  const navigate = useNavigate();
  
  // Navigate to user's profile when clicking their name/avatar
  const handleUserClick = (e, userId, username) => {
    e.stopPropagation();
    if (currentUser?.id === userId || currentUser?.username === username) {
      navigate('/profile');
    } else {
      navigate(`/profile/${username}`);
    }
  };
  
  // Get fresh post data from context (rowData may have stale snapshots)
  const getFreshPost = (postId) => posts.find(p => p.id === postId);
  
  // Map rowData posts to fresh versions from context
  const thoughts = (rowData.thoughts || []).map(p => getFreshPost(p.id) || p);
  const media = (rowData.media || []).map(p => getFreshPost(p.id) || p);
  const milestones = (rowData.milestones || []).map(p => getFreshPost(p.id) || p);
  
  // 🔵 Calculate which post type was most recently posted
  const getMostRecentType = () => {
    const getLatestTimestamp = (arr) => {
      if (!arr.length) return 0;
      return Math.max(...arr.map(p => new Date(p.createdAt || p.created_at || 0).getTime()));
    };
    
    const timestamps = {
      thoughts: getLatestTimestamp(thoughts),
      media: getLatestTimestamp(media),
      milestones: getLatestTimestamp(milestones)
    };
    
    let mostRecent = null;
    let maxTime = 0;
    for (const [type, time] of Object.entries(timestamps)) {
      if (time > maxTime) {
        maxTime = time;
        mostRecent = type;
      }
    }
    return mostRecent;
  };
  
  const mostRecentType = getMostRecentType();
  
  // State for edit mode (dedicated edit modal, separate from comment composer)
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostContent, setEditingPostContent] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  
  // State for delete modal
  const [deleteModalPostId, setDeleteModalPostId] = useState(null);
  const [deleteModalParentId, setDeleteModalParentId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for thread view (expanded replies)
  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [threadReplies, setThreadReplies] = useState({});
  const [loadingThread, setLoadingThread] = useState(null);
  const [showAllReplies, setShowAllReplies] = useState({});
  
  // Mobile state
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState(mostRecentType || 'thoughts');
  const [mobileCardIndex, setMobileCardIndex] = useState({ thoughts: 0, media: 0, milestones: 0 });
  
  // Desktop state
  const [activeColumnType, setActiveColumnType] = useState(null);
  const [expandedMediaPost, setExpandedMediaPost] = useState(null);

  const [isComposerFullPage, setIsComposerFullPage] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Smart Deck state
  const [deckIndex, setDeckIndex] = useState({
    thoughts: 0,
    media: 0,
    milestones: 0
  });
  
  // Collapsed decks state - now from context (shared across pages)
  // Handlers: collapseDeck, expandDeck from usePosts()
  
  // Deck navigation
  const nextCard = (type, totalCards) => {
    setDeckIndex(prev => ({
      ...prev,
      [type]: (prev[type] + 1) % totalCards
    }));
  };
  
  const prevCard = (type, totalCards) => {
    setDeckIndex(prev => ({
      ...prev,
      [type]: prev[type] === 0 ? totalCards - 1 : prev[type] - 1
    }));
  };
  
  const selectCard = (type, index) => {
    setDeckIndex(prev => ({ ...prev, [type]: index }));
  };
  
  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 650);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Toggle thread view and load replies
  const toggleThread = async (postId) => {
    if (expandedThreadId === postId) {
      setExpandedThreadId(null);
    } else {
      setExpandedThreadId(postId);
      if (!threadReplies[postId]) {
        setLoadingThread(postId);
        const result = await fetchReplies(postId);
        if (result.success) {
          setThreadReplies(prev => ({ ...prev, [postId]: result.data }));
        }
        setLoadingThread(null);
      }
    }
  };
  
  // Handle reply submission
  const handleReplySubmit = async (postId, content) => {
    const result = await createReply(postId, { content, type: 'thoughts' });
    if (result.success) {
      setThreadReplies(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), result.data]
      }));
      setCommentText('');
      // Don't close the expanded view - user should see their new reply
      // setActiveCommentPostId(null);
      setExpandedThreadId(postId);
      return true;
    }
    return false;
  };
  
  // Handle reply update
  const handleUpdateReply = async (replyId, data) => {
    const result = await updatePost(replyId, data);
    if (result.success) {
      // Update in all thread replies
      setThreadReplies(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(postId => {
          updated[postId] = updated[postId].map(r => 
            r.id === replyId ? { ...r, ...data } : r
          );
        });
        return updated;
      });
      return true;
    }
    return false;
  };
  
  // Handle expand media - fetch replies if not already loaded
  const handleExpandMedia = async (post) => {
    setExpandedMediaPost(post);
    // Fetch replies if not already loaded
    if (!threadReplies[post.id]) {
      setLoadingThread(post.id);
      const result = await fetchReplies(post.id);
      if (result.success) {
        setThreadReplies(prev => ({ ...prev, [post.id]: result.data }));
      }
      setLoadingThread(null);
    }
  };
  
  // Handle reply delete
  const handleDeleteReply = (replyId, parentId) => {
    setDeleteModalPostId(replyId);
    setDeleteModalParentId(parentId);
  };
  
  // Toggle show all replies
  const toggleShowAllReplies = (postId) => {
    setShowAllReplies(prev => ({ ...prev, [postId]: !prev[postId] }));
  };
  
  // Handle edit post - opens dedicated edit modal (separate from comment composer)
  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setEditingPostContent(post.content);
  };

  // Handle card click - opens expanded view with comments
  const handleCardClick = async (post) => {
    // Set active comment post to show full-page composer
    setActiveCommentPostId(post.id);
    setIsComposerFullPage(true);
    // Fetch replies if not already loaded
    if (!threadReplies[post.id]) {
      setLoadingThread(post.id);
      const result = await fetchReplies(post.id);
      if (result.success) {
        setThreadReplies(prev => ({ ...prev, [post.id]: result.data }));
      }
      setLoadingThread(null);
    }
  };
  
  // Render a post card with all necessary props
  const renderPostCard = (post, type) => {
    const contentLength = (post.content || '').length;
    const hasNoMedia = !post.image && !post.media_url;
    const isShortPost = contentLength < 80 && hasNoMedia;
    
    const isSinglePost = 
      (type === 'thoughts' && thoughts.length === 1 && media.length === 0 && milestones.length === 0) ||
      (type === 'media' && media.length === 1 && thoughts.length === 0 && milestones.length === 0) ||
      (type === 'milestones' && milestones.length === 1 && thoughts.length === 0 && media.length === 0);
    
    return (
      <PostCard
        key={post.id}
        post={post}
        type={type}
        user={user}
        currentUser={currentUser}
        isSinglePost={isSinglePost}
        isShortPost={isShortPost}
        // Actions
        onUserClick={handleUserClick}
        onLike={likePost}
        onShare={sharePost}
        onComment={onCommentClick}
        onMessage={openMessages}
        onEdit={handleEditPost}
        onDelete={(id) => setDeleteModalPostId(id)}
        onExpandMedia={handleExpandMedia}
        onCardClick={handleCardClick}
        // Thread props
        onToggleThread={toggleThread}
        expandedThreadId={expandedThreadId}
        threadReplies={threadReplies}
        loadingThread={loadingThread}
        showAllReplies={showAllReplies}
        onToggleShowAllReplies={toggleShowAllReplies}
        onReplySubmit={handleReplySubmit}
        onUpdateReply={handleUpdateReply}
        onDeleteReply={handleDeleteReply}
        // Comment composer props
        activeCommentPostId={activeCommentPostId}
        commentText={commentText}
        setCommentText={setCommentText}
        setActiveCommentPostId={setActiveCommentPostId}
        isComposerFullPage={isComposerFullPage}
        setIsComposerFullPage={setIsComposerFullPage}
        isSaving={false}
      />
    );
  };
  
  // Count how many post types exist
  const hasThoughts = thoughts.length > 0;
  const hasMedia = media.length > 0;
  const hasMilestones = milestones.length > 0;
  const columnCount = [hasThoughts, hasMedia, hasMilestones].filter(Boolean).length;
  
  // Desktop navigation handlers
  const handleNextColumn = () => {
    const columns = [hasThoughts && 'thoughts', hasMedia && 'media', hasMilestones && 'milestones'].filter(Boolean);
    const currentIndex = columns.indexOf(activeColumnType);
    const nextIndex = (currentIndex + 1) % columns.length;
    setActiveColumnType(columns[nextIndex]);
  };
  
  const handlePrevColumn = () => {
    const columns = [hasThoughts && 'thoughts', hasMedia && 'media', hasMilestones && 'milestones'].filter(Boolean);
    const currentIndex = columns.indexOf(activeColumnType);
    const prevIndex = currentIndex <= 0 ? columns.length - 1 : currentIndex - 1;
    setActiveColumnType(columns[prevIndex]);
  };
  
  // Build arrays for mobile tabs
  const postsByType = {
    thoughts: hasThoughts ? thoughts : [],
    media: hasMedia ? media : [],
    milestones: hasMilestones ? milestones : []
  };
  
  const postCounts = {
    thoughts: thoughts.length,
    media: media.length,
    milestones: milestones.length
  };
  
  const availableTabs = [];
  if (hasThoughts) availableTabs.push('thoughts');
  if (hasMedia) availableTabs.push('media');
  if (hasMilestones) availableTabs.push('milestones');
  
  const effectiveTab = postsByType[mobileActiveTab]?.length > 0 ? mobileActiveTab : availableTabs[0] || 'thoughts';
  const currentTabPosts = postsByType[effectiveTab] || [];
  const currentTabIndex = mobileCardIndex[effectiveTab] || 0;

  // 🟢 MOBILE: Tab-based navigation
  if (isMobile && availableTabs.length > 0) {
    return (
      <div className="timeline-river-row-wrapper timeline-river-row-wrapper--mobile">
        <MobileTabNav
          availableTabs={availableTabs}
          activeTab={effectiveTab}
          onTabChange={setMobileActiveTab}
          postCounts={postCounts}
        />
        
        <div className="mobile-card-area">
          {currentTabPosts.length > 0 && (
            <>
              <div className="mobile-card-container">
                {renderPostCard(currentTabPosts[currentTabIndex], effectiveTab)}
              </div>
              
              {currentTabPosts.length > 1 && (
                <div className="mobile-card-controls">
                  <span className="mobile-nav-position">
                    {currentTabIndex + 1}/{currentTabPosts.length}
                  </span>
                  <button 
                    className="mobile-nav-btn mobile-nav-btn--prev"
                    onClick={() => setMobileCardIndex(prev => ({
                      ...prev,
                      [effectiveTab]: prev[effectiveTab] === 0 ? currentTabPosts.length - 1 : prev[effectiveTab] - 1
                    }))}
                  >
                    <ChevronLeftIcon size={20} />
                  </button>
                  
                  <div className="mobile-card-indicators">
                    {currentTabPosts.map((_, index) => (
                      <div 
                        key={index} 
                        className={`mobile-indicator ${index === currentTabIndex ? 'mobile-indicator--active' : ''}`}
                        onClick={() => setMobileCardIndex(prev => ({ ...prev, [effectiveTab]: index }))}
                      />
                    ))}
                  </div>
                  
                  <button 
                    className="mobile-nav-btn mobile-nav-btn--next"
                    onClick={() => setMobileCardIndex(prev => ({
                      ...prev,
                      [effectiveTab]: (prev[effectiveTab] + 1) % currentTabPosts.length
                    }))}
                  >
                    <ChevronRightIcon size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        <MediaLightbox 
          post={expandedMediaPost ? (posts.find(p => p.id === expandedMediaPost.id) || expandedMediaPost) : null}
          onClose={() => setExpandedMediaPost(null)}
          commentText={commentText}
          setCommentText={setCommentText}
          threadReplies={threadReplies}
          onReplySubmit={handleReplySubmit}
        />
      </div>
    );
  }

  // Calculate how many decks are currently expanded
  const expandedCount = [
    hasThoughts && !collapsedDecks.has('thoughts'),
    hasMedia && !collapsedDecks.has('media'),
    hasMilestones && !collapsedDecks.has('milestones')
  ].filter(Boolean).length;
  
  // Collapse all decks
  const handleCollapseAll = () => {
    if (hasThoughts) collapseDeck('thoughts');
    if (hasMedia) collapseDeck('media');
    if (hasMilestones) collapseDeck('milestones');
  };

  // 🟢 DESKTOP: Tabs in header row, content below - like mobile tabs
  const allCollapsed = expandedCount === 0;
  
  return (
    <div className={`timeline-river-row timeline-river-row--expanded-${expandedCount}`}>
      {/* User info header - only when ALL tabs collapsed */}
      {allCollapsed && (
        <div className="timeline-river-row__user-header">
          <div 
            className="river-avatar clickable-user"
            onClick={(e) => handleUserClick(e, user.id, user.username)}
          >
            <UserIcon size={24} />
          </div>
          <span 
            className="river-author clickable-user"
            onClick={(e) => handleUserClick(e, user.id, user.username)}
          >
            {user.display_name || user.name || user.username}
          </span>
        </div>
      )}
      
      {/* Tabs row - all tabs same size, collapsed ones greyed out, non-recent dimmed */}
      <div className="timeline-river-row__tabs">
        {hasThoughts && (
          <button 
            className={`deck-tab deck-tab--thoughts${collapsedDecks.has('thoughts') ? ' deck-tab--collapsed' : ''}${mostRecentType && mostRecentType !== 'thoughts' ? ' deck-tab--not-recent' : ''}`}
            onClick={() => collapsedDecks.has('thoughts') ? expandDeck('thoughts') : collapseDeck('thoughts')}
          >
            <span className="deck-tab__icon"><ThoughtBubbleIcon className="smart-deck-icon-svg" /></span>
            <span className="deck-tab__label">Thoughts</span>
            <span className="deck-tab__count">{thoughts.length}</span>
            <span className="deck-tab__collapse">{collapsedDecks.has('thoughts') ? '+' : '−'}</span>
          </button>
        )}
        {hasMedia && (
          <button 
            className={`deck-tab deck-tab--media${collapsedDecks.has('media') ? ' deck-tab--collapsed' : ''}${mostRecentType && mostRecentType !== 'media' ? ' deck-tab--not-recent' : ''}`}
            onClick={() => collapsedDecks.has('media') ? expandDeck('media') : collapseDeck('media')}
          >
            <span className="deck-tab__icon"><ImageIcon className="smart-deck-icon-svg" /></span>
            <span className="deck-tab__label">Media</span>
            <span className="deck-tab__count">{media.length}</span>
            <span className="deck-tab__collapse">{collapsedDecks.has('media') ? '+' : '−'}</span>
          </button>
        )}
        {hasMilestones && (
          <button 
            className={`deck-tab deck-tab--milestones${collapsedDecks.has('milestones') ? ' deck-tab--collapsed' : ''}${mostRecentType && mostRecentType !== 'milestones' ? ' deck-tab--not-recent' : ''}`}
            onClick={() => collapsedDecks.has('milestones') ? expandDeck('milestones') : collapseDeck('milestones')}
          >
            <span className="deck-tab__icon"><StarIcon className="smart-deck-icon-svg" /></span>
            <span className="deck-tab__label">Milestones</span>
            <span className="deck-tab__count">{milestones.length}</span>
            <span className="deck-tab__collapse">{collapsedDecks.has('milestones') ? '+' : '−'}</span>
          </button>
        )}
      </div>
      
      {/* Content row - only expanded decks */}
      <div className="timeline-river-row__content">
        {hasThoughts && !collapsedDecks.has('thoughts') && (
          <SmartDeckContent
            posts={thoughts}
            type="thoughts"
            currentIndex={deckIndex.thoughts}
            onNextCard={nextCard}
            onPrevCard={prevCard}
            onSelectCard={selectCard}
            renderPostCard={renderPostCard}
          />
        )}
        {hasMedia && !collapsedDecks.has('media') && (
          <SmartDeckContent
            posts={media}
            type="media"
            currentIndex={deckIndex.media}
            onNextCard={nextCard}
            onPrevCard={prevCard}
            onSelectCard={selectCard}
            renderPostCard={renderPostCard}
          />
        )}
        {hasMilestones && !collapsedDecks.has('milestones') && (
          <SmartDeckContent
            posts={milestones}
            type="milestones"
            currentIndex={deckIndex.milestones}
            onNextCard={nextCard}
            onPrevCard={prevCard}
            onSelectCard={selectCard}
            renderPostCard={renderPostCard}
          />
        )}
      </div>
      
      {/* Desktop navigation controls */}
      {columnCount === 3 && activeColumnType && (
        <div className="desktop-stack-nav">
          <button 
            className="desktop-stack-close"
            onClick={() => setActiveColumnType(null)}
            title="Close (Esc)"
          >
            ×
          </button>
          <button 
            className="desktop-stack-btn desktop-stack-btn--prev"
            onClick={handlePrevColumn}
            title="Previous card"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <button 
            className="desktop-stack-btn desktop-stack-btn--next"
            onClick={handleNextColumn}
            title="Next card"
          >
            <ChevronRightIcon size={20} />
          </button>
        </div>
      )}

      <MediaLightbox 
        post={expandedMediaPost ? (posts.find(p => p.id === expandedMediaPost.id) || expandedMediaPost) : null}
        onClose={() => setExpandedMediaPost(null)}
        commentText={commentText}
        setCommentText={setCommentText}
        threadReplies={threadReplies}
        onReplySubmit={handleReplySubmit}
      />

      <DeleteConfirmModal
        isOpen={deleteModalPostId !== null}
        onClose={() => {
          setDeleteModalPostId(null);
          setDeleteModalParentId(null);
        }}
        onConfirm={async () => {
          setIsDeleting(true);
          
          if (deleteModalParentId) {
            const result = await deletePost(deleteModalPostId);
            if (result.success) {
              setThreadReplies(prev => ({
                ...prev,
                [deleteModalParentId]: (prev[deleteModalParentId] || []).filter(r => r.id !== deleteModalPostId)
              }));
            }
          } else {
            await onDeletePost(deleteModalPostId);
          }
          
          setIsDeleting(false);
          setDeleteModalPostId(null);
          setDeleteModalParentId(null);
        }}
        isDeleting={isDeleting}
      />

      {/* Edit Modal - Dedicated editor (same as Profile page) */}
      {editingPostId && createPortal(
        <div className="expanded-composer-overlay" onClick={() => {
          setEditingPostId(null);
          setEditingPostContent('');
        }}>
          <div className="expanded-composer-modal edit-mode" onClick={(e) => e.stopPropagation()}>
            <div className="expanded-composer-header">
              <h3>
                <EditIcon size={20} />
                Edit Post
              </h3>
              <button 
                className="close-btn-glow"
                onClick={() => {
                  setEditingPostId(null);
                  setEditingPostContent('');
                }}
              >
                <CloseIcon size={24} />
              </button>
            </div>
            <div className="expanded-composer-body">
              <textarea
                className="composer-textarea"
                placeholder="Edit your post..."
                value={editingPostContent}
                onChange={(e) => setEditingPostContent(e.target.value)}
                autoFocus
              />
            </div>
            <div className="expanded-composer-footer">
              <button 
                className="submit-btn icon-btn"
                disabled={!editingPostContent.trim() || isSavingEdit}
                onClick={async () => {
                  if (editingPostContent.trim() && editingPostId && onUpdatePost) {
                    setIsSavingEdit(true);
                    try {
                      await onUpdatePost(editingPostId, { content: editingPostContent.trim() });
                      setEditingPostId(null);
                      setEditingPostContent('');
                    } catch (error) {
                      console.error('Failed to update post:', error);
                    } finally {
                      setIsSavingEdit(false);
                    }
                  }
                }}
                title="Save"
              >
                <CheckIcon size={24} strokeWidth="2.5" />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default TimelineRiverRow;
