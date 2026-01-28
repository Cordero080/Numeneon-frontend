// Utilities for grouping and sorting posts for Timeline River layout
// 🛠️ Import shared helpers instead of duplicating them here!
import { getDisplayName, getInitials, getPostTime } from '@utils/helpers';

// Group posts by user
export const groupPostsByUser = (posts) => {
  const grouped = {};//"Create the function. Start with an empty object called grouped — this will hold all the user buckets."

  //Loop through every post in the array. For each post, do the stuff inside.
  posts.forEach((post) => {
    //For each post, grab 4 things:
    const authorObj = typeof post.author === "object" ? post.author : null;
     //the author object (or null if it's just a string)
    const orderId = post.userId || authorObj?.id || post.author;
     //the user's ID (used as the bucket key)
    const postTime = getPostTime(post);
     //when it was posted (in milliseconds)
    const type = post.type || "thoughts";
     //thoughts, media, or milestones (defaults to thoughts)"

    // Create user bucket if it doesn't exist
    if (!grouped[orderId]) {
      grouped[orderId] = {
        // User info
        user: {
          id: orderId,
          name: getDisplayName(authorObj || post.author),
          username:
          // is the author an object with a username? don't crash if not
            authorObj?.username ||
            // else, if author is just a string, use that
            (typeof post.author === "string" ? post.author : null),
            // if neither, null
          first_name: authorObj?.first_name || "",
            // if authorObj exists, use first_name, else empty string
          last_name: authorObj?.last_name || "",

          avatar: post.avatar || getInitials(authorObj || post.author),
          // if post has avatar, use it; else generate initials
        },
        // Post category arrays
        thoughts: [],
        media: [],
        milestones: [],
        // Most recent timestamp
        mostRecentTimestamp: postTime,
      };
    }

    // Next, update timestamp if needed
    // Update most recent timestamp if this post is newer
    if (postTime > grouped[orderId].mostRecentTimestamp) {
      grouped[orderId].mostRecentTimestamp = postTime;
    }

    // Then, add post to correct category
    // Add post to correct category
    if (grouped[orderId][type]) {
      grouped[orderId][type].push(post);
    }
  });
  return grouped;
};

// Convert grouped  object/posts into sorted array
export const sortGroupedPosts = (grouped) => {
  return Object.entries(grouped)
    .map(([orderId, userData]) => ({
      // Convert to array with needed info
      date: new Date(userData.mostRecentTimestamp).toISOString().split("T")[0],
      orderId,
      data: userData,
      mostRecentTimestamp: userData.mostRecentTimestamp,
    }))
    .sort((a, b) => b.mostRecentTimestamp - a.mostRecentTimestamp);
};
