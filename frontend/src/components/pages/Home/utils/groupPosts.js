/**
 * Groups posts by USER ONLY for Timeline River layout
 * All posts from the same user go into ONE row (carousel navigates between them)
 * Posts are capped at MAX_POSTS_PER_TYPE for carousel performance
 * @param {Array} posts - Flat array of posts
 * @param {Object} options - Configuration options
 * @param {number} options.maxPostsPerType - Max posts per type (default: 12)
 * @returns {Object} Structure: { orderId: { user, thoughts[], media[], milestones[], mostRecentDate } }
 */

// Maximum posts per type in carousel (prevents excessive clicking)
const MAX_POSTS_PER_TYPE = 12;

export const groupPostsByUserAndDay = (posts, options = {}) => {
  const maxPosts = options.maxPostsPerType ?? MAX_POSTS_PER_TYPE;
  const grouped = {}; // 🔵 Keyed by userId only (not date!)

  posts.forEach((post) => {
    // Handle author as object (backend) or string (mock)
    const authorObj = typeof post.author === "object" ? post.author : null;
    const orderId = post.userId || (authorObj ? authorObj.id : post.author);

    // Get display name - always use username
    const getDisplayName = (author) => {
      if (!author) return "Unknown";
      if (typeof author === "string") return author;
      return author.username || "Unknown";
    };

    // Generate avatar initials from name
    const getInitials = (author) => {
      if (!author) return "??";
      if (typeof author === "string") return author.slice(0, 2).toUpperCase();
      if (author.first_name && author.last_name) {
        return `${author.first_name[0]}${author.last_name[0]}`.toUpperCase();
      }
      if (author.first_name) {
        return author.first_name.slice(0, 2).toUpperCase();
      }
      return author.username ? author.username.slice(0, 2).toUpperCase() : "??";
    };

    const authorName = getDisplayName(authorObj || post.author);
    const postDate = new Date(post.createdAt || post.created_at || Date.now());

    // Create user bucket if it doesn't exist
    if (!grouped[orderId]) {
      grouped[orderId] = {
        user: {
          id: orderId,
          name: authorName,
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
        mostRecentDate: postDate, // Track most recent post date
        totalCounts: { thoughts: 0, media: 0, milestones: 0 }, // Track total before cap
      };
    }

    // Update most recent date if this post is newer
    if (postDate > grouped[orderId].mostRecentDate) {
      grouped[orderId].mostRecentDate = postDate;
    }

    // Add post to correct category (thoughts/media/milestones)
    // Cap at maxPosts per type for carousel performance
    const type = post.type || "thoughts";
    if (grouped[orderId][type]) {
      grouped[orderId].totalCounts[type]++; // Track total count
      if (grouped[orderId][type].length < maxPosts) {
        grouped[orderId][type].push(post);
      }
    }
  });

  return grouped;
};

/**
 * Converts grouped posts into sorted array for rendering
 * Sorts by most recent post timestamp - whoever posted most recently appears first
 * @param {Object} grouped - Result from groupPostsByUserAndDay
 * @returns {Array} Sorted array of { orderId, data, mostRecentTimestamp }
 */
export const sortGroupedPosts = (grouped) => {
  const rows = [];

  Object.keys(grouped).forEach((orderId) => {
    const userData = grouped[orderId];

    // Find the most recent post timestamp across all types
    const allPosts = [
      ...userData.thoughts,
      ...userData.media,
      ...userData.milestones,
    ];

    const mostRecentTimestamp = allPosts.reduce((latest, post) => {
      const postTime = new Date(
        post.createdAt || post.created_at || 0
      ).getTime();
      return postTime > latest ? postTime : latest;
    }, 0);

    // Format the most recent date for display
    const mostRecentDate = new Date(mostRecentTimestamp)
      .toISOString()
      .split("T")[0];

    rows.push({
      date: mostRecentDate, // Show most recent post date
      orderId,
      data: userData,
      mostRecentTimestamp,
    });
  });

  // Sort by most recent timestamp (newest first)
  rows.sort((a, b) => b.mostRecentTimestamp - a.mostRecentTimestamp);

  return rows;
};
