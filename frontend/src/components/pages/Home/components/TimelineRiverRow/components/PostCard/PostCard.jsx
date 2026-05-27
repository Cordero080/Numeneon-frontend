// 🔵 PABLO - UI Component
// PostCard.jsx - Individual post card with actions
// STATELESS in terms of data — owns NO posts array, just receives one post as a prop
// All data mutations (like, delete, edit) are called UP to PostsContext via props

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
// ↑ createPortal renders a child outside the normal DOM tree (used for full-page composer overlay)

import { formatRelativeTime } from "@utils/helpers";
// ↑ utility function — converts ISO date string to "2 hours ago" style

import ThreadView from "../ThreadView";
// ↑ sibling component — renders the reply thread below a post

import RepostModal from "../RepostModal/RepostModal";
// ↑ sibling component — the modal that pops up when you hit the repost button

import ReactionPicker from "../ReactionPicker";
// ↑ sibling component — shows on long-press, lets you pick heart or bolt reaction

import {
  UserIcon, // ← fallback avatar when no profile picture
  HeartDynamicIcon, // ← like button icon (filled/unfilled based on is_liked)
  BoltDynamicIcon, // ← "emphasis" reaction icon (alternative to heart)
  MessageBubbleIcon, // ← comment button icon
  RepostIcon, // ← repost button icon
  BookmarkIcon, // ← bookmark button icon
  MessageLineIcon, // ← DM button icon (only shows on other people's posts)
  GraphLineIcon, // ← analytics icon (only shows on your own posts)
  EditIcon, // ← edit button icon (only shows on your own posts)
  TrashIcon, // ← delete button icon (only shows on your own posts)
  MaximizeIcon, // ← expand media / expand composer icon
  ChevronRightIcon, // ← submit comment arrow button
  CloseIcon, // ← close button for full-page composer
  ImageIcon, // ← add media button inside full-page composer
  VisibilityIcon, // ← privacy indicator (public/friends/private)
} from "@assets/icons";
// ↑ all icons live in frontend/src/assets/icons/ — grouped by category

import "./PostCard.scss";

function PostCard({
  // DATA PROPS — information passed down to display
  post, // ← the full post object (content, likes_count, is_liked, etc.)
  //   born in posts/serializers.py → traveled here via PostsContext
  type, // ← 'thoughts', 'media', or 'milestones' — set in TimelineRiverRow
  user, // ← the post author's user object — nested inside post from serializer
  currentUser, // ← the logged-in user — lives in AuthContext, passed down here
  isSinglePost, // ← true when post is displayed alone, not in a feed stack
  isShortPost, // ← true for compact display mode
  isGridView, // ← true when posts are in grid layout instead of list

  // ACTION PROPS — functions defined OUTSIDE, passed down to call
  // These are NOT defined here — PostCard just calls them when something happens
  onUserClick, // ← defined in TimelineRiverRow, navigates to user's profile
  onLike, // ← defined in PostsContext → postsService → backend like() @action
  onShare, // ← defined in PostsContext → postsService → backend
  onComment, // ← defined in TimelineRiverRow, opens the inline comment composer
  onMessage, // ← defined in MessageContext, opens DM to post author
  onEdit, // ← defined in PostsContext → postsService → backend
  onDelete, // ← defined in PostsContext → postsService → backend destroy()
  onExpandMedia, // ← defined in TimelineRiverRow, opens the media lightbox
  onCardClick, // ← defined in TimelineRiverRow, opens post detail modal

  // THREAD PROPS — everything needed to show/hide reply threads
  onToggleThread, // ← opens/closes the reply thread below the post
  expandedThreadId, // ← the post.id whose thread is currently open (null = none)
  threadReplies, // ← object: { [postId]: [array of reply objects] }
  loadingThread, // ← post.id that is currently fetching replies
  showAllReplies, // ← object: { [postId]: true/false } — show all or just first 3
  onToggleShowAllReplies, // ← flips showAllReplies for a given postId
  onReplySubmit, // ← submits a new reply → PostsContext → backend
  onUpdateReply, // ← edits an existing reply → PostsContext → backend
  onDeleteReply, // ← deletes a reply → PostsContext → backend
  onReplyToComment, // ← reply to a specific comment with @mention

  // COMMENT COMPOSER PROPS — controls the inline comment box state
  // These live in TimelineRiverRow so ONE composer is shared across all posts in the row
  activeCommentPostId, // ← which post.id has the composer open right now
  commentText, // ← current text in the comment input
  setCommentText, // ← updates commentText in TimelineRiverRow
  setActiveCommentPostId, // ← opens/closes the composer for a specific post
  isComposerFullPage, // ← true when composer is expanded to full-screen overlay
  setIsComposerFullPage, // ← toggles the full-page composer
  isSaving, // ← true while the reply is being submitted to backend
}) {
  // LOCAL UI STATE — only affects how THIS card looks, not any actual data
  // These never leave this component — they don't go to context or backend

  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  // ← is the heart bouncing right now? set to true on click, back to false after 300ms

  const [showRepostModal, setShowRepostModal] = useState(false);
  // ← controls whether the RepostModal is visible

  const [showReactionPicker, setShowReactionPicker] = useState(false);
  // ← controls whether the long-press reaction picker is visible

  const [reactionType, setReactionType] = useState(
    post.reaction_type || "like",
  );
  // ← which icon to show: 'like' (heart) or 'emphasis' (bolt)
  // post.reaction_type comes from backend — || 'like' = default if backend returns null

  const longPressTimer = useRef(null);
  // ← stores the setTimeout timer ID for long-press detection
  // useRef not useState — changing this value does NOT trigger a re-render

  const LONG_PRESS_DURATION = 400; // ms before long-press fires

  // color for the heart icon — changes based on post type
  const heartColors = {
    thoughts: "#31fcfcff", // cyan/blue
    media: "#ad7afeff", // purple
    milestones: "#0ce77dff", // green
  };
  const heartColor = heartColors[type] || "#2fcefaff";
  // ↑ look up this post's type in the object above
  // || '#2fcefaff' = fallback color if type is something unexpected

  // LONG-PRESS HANDLERS — detect difference between tap (like) and hold (reaction picker)

  const handleReactionMouseDown = (e) => {
    e.stopPropagation(); // ← don't let this click bubble up to the card click handler
    longPressTimer.current = setTimeout(() => {
      setShowReactionPicker(true); // ← held long enough — show the picker
    }, LONG_PRESS_DURATION);
  };

  const handleReactionMouseUp = async (e) => {
    e.stopPropagation();
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current); // ← cancel the long-press timer
      longPressTimer.current = null;

      if (!showReactionPicker) {
        // ← timer was still running = it was a quick tap, not a hold
        setIsHeartAnimating(true);
        setTimeout(() => setIsHeartAnimating(false), 300); // ← animate for 300ms then stop
        await onLike(post.id); // ← call up to PostsContext → postsService → backend
      }
    }
  };

  const handleReactionMouseLeave = () => {
    // ← if mouse leaves while holding, cancel — don't fire long-press
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleReactionSelect = async (selectedReaction) => {
    // ← fires when user picks a reaction from the picker (heart or bolt)
    setShowReactionPicker(false);
    setReactionType(selectedReaction); // ← swap the icon locally
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 300);

    if (!post.is_liked) {
      await onLike(post.id); // ← only toggle like if not already liked
    }
    // TODO: When backend supports reaction types, pass selectedReaction to API
  };

  const currentReaction = post.is_liked ? reactionType : null;
  // ← null = not liked, 'like'/'emphasis' = which reaction is active

  const handleCardClick = (e) => {
    // ← fires when user clicks the card background (not a button inside it)
    if (
      e.target.closest("button") ||
      e.target.closest(".river-avatar") ||
      e.target.closest(".river-author") ||
      e.target.closest(".river-post-actions") ||
      e.target.closest(".river-post-media") ||
      e.target.closest(".inline-comment-composer") ||
      e.target.closest(".thread-view")
    ) {
      return; // ← clicked inside an interactive element — don't open the detail modal
    }
    onCardClick?.(post); // ← ?. = only call if onCardClick was passed as a prop
  };

  return (
    <>
      <div
        className={`river-post-card post--${type} ${isSinglePost ? "post--single" : ""} ${isShortPost ? "post--compact" : ""} ${isGridView ? "post--grid-view" : ""} fade-in`}
        // ↑ CSS classes built dynamically — post--thoughts / post--media / post--milestones
        onClick={handleCardClick}
        style={{ cursor: "pointer" }}
      >
        {/* ── HEADER: Avatar + Name + Timestamp + Privacy icon ── */}
        <div className="river-post-header">
          <div
            className="river-avatar clickable-user"
            onClick={(e) => onUserClick(e, user.id, user.username)}
            // ↑ calls onUserClick from TimelineRiverRow → navigates to profile page
            title={`View ${user.name}'s profile`}
          >
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={user.name}
                className="river-avatar-img"
              />
            ) : (
              <UserIcon size={24} /> // ← fallback if no profile picture
            )}
          </div>
          <div className="river-post-info">
            <div
              className="river-author clickable-user"
              onClick={(e) => onUserClick(e, user.id, user.username)}
              title={`View ${user.name}'s profile`}
            >
              {user.name}
            </div>
            <div className="river-meta">
              <span className="river-timestamp">
                {formatRelativeTime(post.created_at || post.createdAt)}
              </span>
              {/* ↑ post.created_at = backend field name, post.createdAt = camelCase fallback */}
            </div>
          </div>
          <VisibilityIcon
            visibility={post.visibility}
            size={20}
            className="privacy-icon"
          />
          {/* ↑ post.visibility comes from backend serializer — 'public', 'friends', or 'private' */}
        </div>

        {/* ── MEDIA IMAGE — only renders for 'media' type posts with a media_url ── */}
        {type === "media" && post.media_url && (
          <div
            className="river-post-media"
            onClick={(e) => {
              e.stopPropagation(); // ← don't trigger handleCardClick
              onExpandMedia(post); // ← calls onExpandMedia from TimelineRiverRow → opens lightbox
            }}
          >
            <img
              src={post.media_url}
              alt="Post media"
              className="river-media-image"
            />
            <div className="media-expand-hint">
              <MaximizeIcon size={20} />
            </div>
          </div>
        )}

        {/* ── POST CONTENT ── */}
        <p
          className={`river-post-content ${isGridView ? "river-post-content--truncated" : ""}`}
        >
          {post.content}
        </p>
        {isGridView && post.content && post.content.length > 80 && (
          <span
            className="see-more-link"
            onClick={(e) => {
              e.stopPropagation();
              onCardClick?.(post);
            }}
          >
            See more
          </span>
          // ↑ only shows in grid view when content is long — clicking opens full post detail
        )}

        {/* ── POST ACTIONS BAR ── */}
        <div
          className={`river-post-actions ${showReactionPicker ? "picker-open" : ""}`}
        >
          {/* LIKE — tap = toggle like, hold = show reaction picker */}
          <div
            className={`river-post-likes ${post.is_liked ? "is-liked" : ""} ${isHeartAnimating ? "heart-pulse" : ""}`}
            // ↑ post.is_liked comes from backend serializer (SerializerMethodField)
            onMouseDown={handleReactionMouseDown}
            onMouseUp={handleReactionMouseUp}
            onMouseLeave={handleReactionMouseLeave}
            onTouchStart={handleReactionMouseDown} // ← mobile equivalent of mouseDown
            onTouchEnd={handleReactionMouseUp} // ← mobile equivalent of mouseUp
            title={
              post.is_liked ? "Unlike (hold for more)" : "Like (hold for more)"
            }
            style={{
              cursor: "pointer",
              "--heart-color": heartColor,
              position: "relative",
            }}
          >
            {reactionType === "emphasis" ? (
              <BoltDynamicIcon
                size={18}
                filled={post.is_liked}
                fillColor={heartColor}
              />
            ) : (
              <HeartDynamicIcon size={18} filled={post.is_liked} />
            )}
            {post.likes_count || 0}
            {/* ↑ post.likes_count = integer from backend, || 0 = show 0 if null */}

            <ReactionPicker
              isOpen={showReactionPicker} // ← local state — is it visible?
              onSelect={handleReactionSelect}
              onClose={() => setShowReactionPicker(false)}
              reactionColor={heartColor}
              currentReaction={currentReaction} // ← null or 'like' or 'emphasis'
            />
          </div>

          {/* COMMENT — opens the inline composer below this post */}
          <button
            className={`river-action-btn ${post.reply_count > 0 ? "has-replies" : ""}`}
            title="Comment"
            onClick={() => onComment(post.id)}
            // ↑ onComment comes from TimelineRiverRow → sets activeCommentPostId = post.id
          >
            <MessageBubbleIcon
              size={20}
              stroke="rgba(201,168,255,0.5)"
              strokeWidth="1.5"
            />
            {post.reply_count > 0 && (
              <span className="reply-count">{post.reply_count}</span>
            )}
            {/* ↑ post.reply_count = integer from backend, only renders if > 0 */}
          </button>

          {/* REPOST */}
          <button
            className="river-action-btn"
            title="Repost"
            onClick={(e) => {
              e.stopPropagation();
              setShowRepostModal(true); // ← local state — shows RepostModal below
            }}
          >
            <RepostIcon
              size={20}
              stroke="rgba(79,255,255,0.5)"
              strokeWidth="1.5"
            />
            {post.shares_count > 0 && (
              <span className="share-count">{post.shares_count}</span>
            )}
          </button>

          {/* BOOKMARK */}
          <button className="river-action-btn" title="Bookmark">
            <BookmarkIcon
              size={20}
              stroke="rgba(201,168,255,0.5)"
              strokeWidth="1.5"
            />
          </button>

          {/* DM BUTTON — only visible on OTHER people's posts */}
          {currentUser && post.author?.id !== currentUser.id && (
            // ↑ currentUser from AuthContext, post.author from backend serializer
            // post.author?.id = optional chaining — safe if author is null
            <button
              className="river-action-btn river-action-btn--message"
              title={`Message ${post.author?.username || "user"}`}
              onClick={(e) => {
                e.stopPropagation();
                onMessage({
                  id: post.author?.id,
                  username: post.author?.username,
                  displayName: post.author?.username,
                });
                // ↑ onMessage comes from MessageContext → opens DM conversation
              }}
            >
              <MessageLineIcon
                size={20}
                stroke="rgba(0,212,255,0.5)"
                strokeWidth="1.5"
              />
            </button>
          )}

          {/* ANALYTICS + EDIT + DELETE — only visible on YOUR OWN posts */}
          {currentUser && post.author?.id === currentUser.id && (
            // ↑ same check as above but flipped — show only if post belongs to logged-in user
            <>
              <button className="river-action-btn" title="Analytics">
                <GraphLineIcon
                  size={20}
                  stroke="rgba(26,231,132,0.5)"
                  strokeWidth="1.5"
                />
              </button>
              <button
                className="river-action-btn river-action-btn--edit"
                title="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(post); // ← calls up to PostsContext → postsService → backend PATCH
                }}
              >
                <EditIcon
                  size={20}
                  stroke="rgba(255,193,7,0.6)"
                  strokeWidth="1.5"
                />
              </button>
              <button
                className="river-action-btn river-action-btn--delete"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(post.id); // ← calls up to PostsContext → postsService → backend DELETE
                }}
              >
                <TrashIcon
                  size={20}
                  stroke="rgba(255,82,82,0.6)"
                  strokeWidth="1.5"
                />
              </button>
            </>
          )}
        </div>

        {/* ── INLINE COMMENT COMPOSER — appears below the post when comment button clicked ── */}
        {activeCommentPostId === post.id && !isComposerFullPage && (
          // ↑ activeCommentPostId lives in TimelineRiverRow — only ONE composer open at a time
          <div className="inline-comment-composer-wrapper">
            <div className="inline-comment-composer">
              <div className="comment-input-wrapper">
                <textarea
                  className="comment-input"
                  placeholder="Comment..."
                  value={commentText} // ← controlled by TimelineRiverRow state
                  onChange={(e) => {
                    setCommentText(e.target.value); // ← updates TimelineRiverRow state
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px"; // ← auto-grow
                  }}
                  rows={1}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (commentText.trim()) {
                        onReplySubmit(post.id, commentText);
                        // ↑ calls up to PostsContext → postsService → backend
                      }
                    }
                    if (e.key === "Escape") {
                      setActiveCommentPostId(null); // ← closes the composer
                      setCommentText("");
                    }
                  }}
                />
                <button
                  className="expand-composer-btn"
                  onClick={() => setIsComposerFullPage(true)} // ← switch to full-screen overlay
                  title="Expand to full page"
                >
                  <MaximizeIcon size={12} strokeWidth="2.5" />
                </button>
              </div>
              <button
                className="comment-submit-btn"
                disabled={!commentText.trim()} // ← disabled if textarea is empty
                onClick={async () => {
                  if (commentText.trim()) {
                    await onReplySubmit(post.id, commentText);
                    // ↑ async because it waits for the API call to complete
                  }
                }}
              >
                <ChevronRightIcon size={22} strokeWidth="2.5" />
              </button>
            </div>
            <button
              className={`inline-composer-cancel inline-composer-cancel--${type}`}
              onClick={() => {
                setActiveCommentPostId(null); // ← closes composer
                setCommentText(""); // ← clears the input
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* ── VIEW THREAD LINK — shows when post has replies but thread is collapsed ── */}
        {post.reply_count > 0 && expandedThreadId !== post.id && (
          // ↑ expandedThreadId lives in TimelineRiverRow — only one thread open at a time
          <button
            className="view-thread-btn"
            onClick={() => onToggleThread(post.id)} // ← opens the ThreadView below
          >
            <span className="thread-line" />
            View {post.reply_count}{" "}
            {post.reply_count === 1 ? "reply" : "replies"}
          </button>
        )}

        {/* ── THREAD VIEW — renders when this post's thread is expanded ── */}
        {expandedThreadId === post.id && (
          <ThreadView
            postId={post.id}
            postType={type}
            replies={threadReplies[post.id]} // ← array of reply objects for this post
            isLoading={loadingThread === post.id} // ← true while fetching replies
            currentUser={currentUser} // ← from AuthContext, passed down
            onCollapse={() => onToggleThread(post.id)} // ← collapses the thread
            onUpdateReply={onUpdateReply} // ← edit reply → PostsContext → backend
            onDeleteReply={onDeleteReply} // ← delete reply → PostsContext → backend
            onReplyToComment={onReplyToComment}
            showAllReplies={showAllReplies[post.id]} // ← true/false for this post
            onToggleShowAll={() => onToggleShowAllReplies(post.id)}
          />
        )}

        {/* ── FULL PAGE COMPOSER OVERLAY — rendered via createPortal directly onto document.body ── */}
        {activeCommentPostId === post.id &&
          isComposerFullPage &&
          createPortal(
            // ↑ createPortal = render this outside the normal component tree
            // it appears on top of everything because it's attached to document.body
            <div className="full-page-composer-overlay">
              <div className="full-page-composer">
                {/* Header with close button */}
                <div className="full-page-header">
                  <button
                    className="close-btn-glow"
                    onClick={() => {
                      setIsComposerFullPage(false); // ← back to inline composer
                      setActiveCommentPostId(null); // ← close composer entirely
                      setCommentText("");
                    }}
                    title="Close"
                  >
                    <CloseIcon size={20} />
                  </button>
                </div>

                {/* Original Post Context — shows the post being replied to */}
                <div className="full-page-content">
                  <div className="reply-context">
                    <div className="reply-context-header">
                      <div className="reply-context-avatar">
                        {user.profile_picture ? (
                          <img
                            src={user.profile_picture}
                            alt={user.name}
                            className="reply-context-avatar-img"
                          />
                        ) : (
                          <UserIcon size={20} />
                        )}
                      </div>
                      <span className="reply-context-name">{user.name}</span>
                      <span className="reply-context-handle">
                        @{user.username}
                      </span>
                      <span className="reply-context-dot">·</span>
                      <span className="reply-context-time">
                        {formatRelativeTime(post.created_at || post.createdAt)}
                      </span>
                    </div>
                    <p className="reply-context-content">{post.content}</p>
                    {type === "media" && post.media_url && (
                      <div className="reply-context-media">
                        <img src={post.media_url} alt="Post media" />
                      </div>
                    )}
                  </div>

                  {/* Existing replies shown inside the full-page composer */}
                  {threadReplies[post.id] &&
                    threadReplies[post.id].length > 0 && (
                      <div className="full-page-thread">
                        <ThreadView
                          postId={post.id}
                          postType={type}
                          replies={threadReplies[post.id]}
                          isLoading={loadingThread === post.id}
                          currentUser={currentUser}
                          onCollapse={() => {}} // ← no collapse in full-page view
                          onUpdateReply={onUpdateReply}
                          onDeleteReply={onDeleteReply}
                          onReplyToComment={onReplyToComment}
                          showAllReplies={showAllReplies[post.id]}
                          onToggleShowAll={() =>
                            onToggleShowAllReplies(post.id)
                          }
                        />
                      </div>
                    )}
                </div>

                {/* Fixed bottom area — actions + composer input */}
                <div className="full-page-composer-fixed">
                  <div className="full-page-actions">
                    {/* Like */}
                    <div
                      className={`reply-action-btn ${post.is_liked ? "is-liked" : ""}`}
                      onClick={async () => await onLike(post.id)}
                      style={{ cursor: "pointer", "--heart-color": heartColor }}
                    >
                      <HeartDynamicIcon size={20} filled={post.is_liked} />
                      <span>{post.likes_count || 0}</span>
                    </div>
                    {/* Comment count */}
                    <div className="reply-action-btn">
                      <MessageBubbleIcon
                        size={20}
                        stroke="rgba(201,168,255,0.5)"
                        strokeWidth="1.5"
                      />
                      <span>{post.reply_count || 0}</span>
                    </div>
                    {/* Share */}
                    <div
                      className="reply-action-btn"
                      onClick={() => setShowRepostModal(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <RepostIcon
                        size={20}
                        stroke="rgba(79,255,255,0.5)"
                        strokeWidth="1.5"
                      />
                      <span>{post.shares_count || 0}</span>
                    </div>
                    {/* Bookmark */}
                    <div
                      className="reply-action-btn"
                      style={{ cursor: "pointer" }}
                    >
                      <BookmarkIcon
                        size={20}
                        stroke="rgba(201,168,255,0.5)"
                        strokeWidth="1.5"
                      />
                    </div>
                  </div>

                  {/* Composer input row */}
                  <div className="expanded-composer-row">
                    <div className="comment-input-wrapper">
                      <textarea
                        className="comment-input"
                        placeholder="Share your thoughts..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={3}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (commentText.trim()) {
                              onReplySubmit(post.id, commentText);
                              setCommentText("");
                            }
                          }
                          if (e.key === "Escape") {
                            setIsComposerFullPage(false); // ← back to inline, don't close entirely
                          }
                        }}
                      />
                      <button
                        className="comment-media-btn"
                        title="Add media"
                        onClick={() => {}}
                      >
                        <ImageIcon
                          size={18}
                          stroke="rgba(220, 8, 188, 0.5)"
                          strokeWidth="1.5"
                        />
                      </button>
                    </div>
                    <button
                      className="expanded-send-btn"
                      disabled={!commentText.trim() || isSaving}
                      // ↑ isSaving = true while API call is in flight — prevents double-submit
                      onClick={async () => {
                        if (commentText.trim()) {
                          await onReplySubmit(post.id, commentText);
                          setCommentText("");
                        }
                      }}
                    >
                      <ChevronRightIcon
                        size={24}
                        stroke="currentColor"
                        strokeWidth="2.5"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body, // ← second argument to createPortal — where to mount it
          )}
      </div>

      {/* REPOST MODAL — rendered outside the card div to avoid z-index issues */}
      {showRepostModal && (
        <RepostModal
          post={post}
          user={user}
          type={type}
          onClose={() => setShowRepostModal(false)}
          onRepost={onShare} // ← calls up to PostsContext → postsService → backend
          onCopyLink={() => {}}
        />
      )}
    </>
  );
}

export default PostCard;
