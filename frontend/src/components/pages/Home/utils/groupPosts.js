/**
 * Utility functions for grouping posts by user for the Timeline River layout.
 * Used by TimelineRiverFeed.jsx to organize posts into user rows.
 */

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS (defined once, not recreated per iteration)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get display name from author object or string
 */
const getDisplayName = (author) => {
  if (!author) return "Unknown";
  if (typeof author === "string") return author;
  return author.username || "Unknown";
};

/**
 * Generate avatar initials from author
 */
const getInitials = (author) => {
  if (!author) return "??";
  if (typeof author === "string") return author.slice(0, 2).toUpperCase();
  if (author.first_name && author.last_name) {
    return `${author.first_name[0]}${author.last_name[0]}`.toUpperCase();
  }
  if (author.first_name) return author.first_name.slice(0, 2).toUpperCase();
  return author.username?.slice(0, 2).toUpperCase() || "??";
};

/**
 * Parse post timestamp to milliseconds
 */
const getPostTime = (post) =>
  new Date(post.createdAt || post.created_at || 0).getTime();

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Groups posts by user for Timeline River layout.
 * Each user gets ONE bucket with three category arrays (thoughts, media, milestones).
 *
 * @param {Array} posts - Flat array of posts from backend
 * @returns {Object} { orderId: { user, thoughts[], media[], milestones[], mostRecentTimestamp } }
 */
export const groupPostsByUser = (posts) => {
  const grouped = {};

  posts.forEach((post) => {
    // Extract author info (handles both object and string formats)
    const authorObj = typeof post.author === "object" ? post.author : null;
    const orderId = post.userId || authorObj?.id || post.author;
    const postTime = getPostTime(post);
    const type = post.type || "thoughts";

    // Create user bucket if it doesn't exist
    if (!grouped[orderId]) {
      grouped[orderId] = {
        user: {
          id: orderId,
          name: getDisplayName(authorObj || post.author),
          username:
            authorObj?.username ||
            (typeof post.author === "string" ? post.author : null),
          first_name: authorObj?.first_name || "",
          last_name: authorObj?.last_name || "",
          avatar: post.avatar || getInitials(authorObj || post.author),
        },
        thoughts: [],
        media: [],
        milestones: [],
        mostRecentTimestamp: postTime,
      };
    }

    // Update most recent timestamp if this post is newer
    if (postTime > grouped[orderId].mostRecentTimestamp) {
      grouped[orderId].mostRecentTimestamp = postTime;
    }

    // Add post to correct category
    if (grouped[orderId][type]) {
      grouped[orderId][type].push(post);
    }
  });

  return grouped;
};

/**
 * Converts grouped posts into sorted array for rendering.
 * Sorts by most recent post timestamp (newest first).
 *
 * @param {Object} grouped - Result from groupPostsByUser
 * @returns {Array} [{ date, orderId, data }] sorted newest first
 */
export const sortGroupedPosts = (grouped) => {
  return Object.entries(grouped)
    .map(([orderId, userData]) => ({
      date: new Date(userData.mostRecentTimestamp).toISOString().split("T")[0],
      orderId,
      data: userData,
      mostRecentTimestamp: userData.mostRecentTimestamp,
    }))
    .sort((a, b) => b.mostRecentTimestamp - a.mostRecentTimestamp);
};
