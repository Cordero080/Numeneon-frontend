/**
 * =============================================================================
 * POSTS CONTEXT
 * =============================================================================
 * Responsibility: Global posts state management
 * =============================================================================
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import postsService from "@services/postsService";
import { useAuth } from "./AuthContext";

// Create the context object - this is what components will consume(empty container that will hold the global posts state)
const PostsContext = createContext(null);
// WHAT THIS IS: The Provider is the actual broadcasting antenna.
// It wraps around your app (the {children}) and broadcasts the data.
export const PostsProvider = ({ children }) => {
  // All the STATE and functions are defined here
  const { user, isLoading: authLoading, isAuthenticated } = useAuth(); // Get auth state (AuthContext) from AuthProvider to know when user logs in/out and to access current user's info for posts fetching and creation

  // STATE - the "source of truth" for all posts data
  const [posts, setPosts] = useState([]); // Array of post objects
  const [isLoading, setIsLoading] = useState(false); // True while fetching-Track if the app is currently waiting for the database.
  const [error, setError] = useState(null); // Error message if something fails in backend calls

  // COLLAPSED DECKS - shared across Home and Profile pages
  // Set of category types that are currently collapsed: 'thoughts', 'media', 'milestones'
  // Persisted to localStorage so it survives page refresh
  const [collapsedDecks, setCollapsedDecks] = useState(() => {
    // Initialize from localStorage
    try {
      const saved = localStorage.getItem("collapsedDecks");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Save to localStorage whenever collapsedDecks changes
  useEffect(() => {
    localStorage.setItem("collapsedDecks", JSON.stringify([...collapsedDecks]));
  }, [collapsedDecks]);

  // Collapse a deck category
  const collapseDeck = (type) => {
    setCollapsedDecks((prev) => new Set([...prev, type]));
  };

  // Expand a deck category
  const expandDeck = (type) => {
    setCollapsedDecks((prev) => {
      const next = new Set(prev);
      next.delete(type);
      return next;
    });
  };

  // FETCH WHEN USER LOGS IN (and auth is done loading)
  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish
    if (user && isAuthenticated) {
      fetchPosts();
    } else {
      setPosts([]); // Clear posts when logged out
    }
  }, [user, authLoading, isAuthenticated]);
  // By putting those three variables inside the array, the engineer gives React a strict rule: "Only run the code inside the braces if user, authLoading, or isAuthenticated changes. Otherwise, do absolutely nothing."

  // FETCH ALL POSTS
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null); // Clear any previous errors
    try {
      // Reach out to the Django backend and wait for the array of posts.
      const data = await postsService.getAll(); // Call service, get array// Shove that downloaded array into the React state blueprint.
      // React sees this happen and instantly draws the posts on the screen.
      setPosts(data); // Store in state
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch posts");
      // If the database crashes or network drops, grab the exact error
      // message Django sent back and save it to the error state so the UI can show it.
    } finally {
      setIsLoading(false); // Always turn off loading, success or fail
    }
  };

  // FETCH POSTS BY USERNAME - for viewing a specific user's profile
  const fetchPostsByUsername = async (username) => {
    try {
      const data = await postsService.getByUsername(username);
      // Merge into existing posts (avoid duplicates)
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = data.filter((p) => !existingIds.has(p.id));
        return [...newPosts, ...prev];
      });
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || "Failed to fetch user posts",
      };
    }
  };

  // CREATE POST
  const createPost = async (postData) => {
    try {
      console.log("📝 Creating post with data:", postData);
      const newPost = await postsService.create(postData); // Returns new post with id
      console.log("📝 Post created, response:", newPost);

      // If this was a wall post, manually attach the target_profile_id
      // (in case backend doesn't return it yet)
      if (postData.target_profile_id && !newPost.target_profile_id) {
        newPost.target_profile_id = postData.target_profile_id;
      }

      setPosts((prev) => [newPost, ...prev]); // Add to top of list (spread previous posts after)

      // Auto-expand the category that was just posted to
      const postType = postData.type || newPost.type;
      if (postType) {
        expandDeck(postType);
      }

      return { success: true, post: newPost };
    } catch (err) {
      console.error("📝 Post creation failed:", err);
      return {
        success: false,
        error: err.response?.data?.detail || "Failed to create post",
      };
    }
  };
  // UPDATE POST
  const updatePost = async (id, data) => {
    try {
      const updatedPost = await postsService.update(id, data); // Returns updated post
      // Replace old post with updated one in state
      // PRESERVE target_profile_id if it existed (for wall posts)
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...updatedPost,
                target_profile_id:
                  post.target_profile_id || updatedPost.target_profile_id,
              }
            : post,
        ),
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || "Failed to update post",
      };
    }
  };
  // DELETE POST
  const deletePost = async (id) => {
    try {
      await postsService.delete(id); // No return value
      setPosts((prev) => prev.filter((post) => post.id !== id)); // Remove from state by filtering out
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || "Failed to delete post",
      };
    }
  };

  // FETCH REPLIES for a post
  const fetchReplies = async (postId) => {
    try {
      const replies = await postsService.getReplies(postId);
      return { success: true, data: replies };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || "Failed to fetch replies",
      };
    }
  };

  // CREATE REPLY to a post
  const createReply = async (parentId, content) => {
    try {
      const newReply = await postsService.createReply(parentId, content);
      // Update reply_count on the parent post
      setPosts((prev) =>
        prev.map((post) =>
          post.id === parentId
            ? { ...post, reply_count: (post.reply_count || 0) + 1 }
            : post,
        ),
      );
      return { success: true, data: newReply };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || "Failed to create reply",
      };
    }
  };

  // LIKE/UNLIKE a post - uses explicit action to prevent mobile double-tap race conditions
  const likePost = async (id) => {
    try {
      // Find current post state to determine the action/to see if we already liked it.
      const currentPost = posts.find((p) => p.id === id);
      const action = currentPost?.is_liked ? "unlike" : "like";
      // 2. Tell Django to toggle the like in the database.
      const updatedPost = await postsService.like(id, action);
      // Update the post in state with new like count and is_liked status
      // PRESERVE target_profile_id if it existed (for wall posts)
      setPosts((prev) =>
        prev.map(
          (
            post, // 3. Update the screen (The Switcher / .map)
          ) =>
            post.id === id // "Is this the post that was just liked?"
              ? {
                  ...updatedPost,
                  target_profile_id:
                    post.target_profile_id || updatedPost.target_profile_id,
                }
              : // If YES (?): Swap in the new like count, but keep the old target ID.
                post,
        ),
      );
      return { success: true, data: updatedPost };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || "Failed to like post",
      };
    }
  };

  // SHARE a post
  const sharePost = async (id) => {
    try {
      const updatedPost = await postsService.share(id);
      // Update the post in state with new share count
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? updatedPost : post)),
      );
      return { success: true, data: updatedPost };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || "Failed to share post",
      };
    }
  };

  // PROVIDER - wraps app and exposes state + actions to all children
  // It takes all the state and all the functions we just built
  // and "broadcasts" them so any component can use them.
  return (
    <PostsContext.Provider
      value={{
        // 'value' is the actual data package being sent out.
        //State
        posts,
        isLoading,
        error,
        collapsedDecks,
        // Actions
        fetchPosts,
        fetchPostsByUsername,
        createPost,
        updatePost,
        deletePost,
        fetchReplies,
        createReply,
        likePost,
        sharePost,
        collapseDeck,
        expandDeck,
      }}
    >
      {children} {/* {children} represents every other component in your app */}
    </PostsContext.Provider>
  );
};

// CUSTOM HOOK - cleaner way to consume context
export const usePosts = () => {
  const context = useContext(PostsContext); // Grab context value
  // Safety check: If a developer tries to use posts data
  // outside of the Provider wrapper, throw an error.
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider"); // Safety check
  }
  return context;
};

export default PostsContext;
