// =============================================================================
// 🟢 COLIN - Posts Lead
// PostsContext.jsx - Global posts state management
// =============================================================================
//
// TODO: Create a context that manages all posts data
//
// This context is the "single source of truth" for posts.
// Any component that needs posts data consumes this context.
//
// STATE:
// - posts: Array of post objects
// - isLoading: Boolean, true while fetching
// - error: Error message string or null
//
// FUNCTIONS TO PROVIDE:
// - fetchPosts(): Get all posts from API
// - fetchPostsByUsername(username): Get posts for specific user
// - createPost(content): Create new post
// - updatePost(id, data): Update existing post
// - deletePost(id): Delete a post
// - fetchReplies(postId): Get replies to a post
// - createReply(parentId, content): Reply to a post
// - likePost(id): Toggle like on a post
// - sharePost(id): Increment share count
//
// FETCH ON AUTH:
// - useEffect that watches AuthContext's user state
// - When user logs in, fetch posts
// - When user logs out, clear posts
//
// POST OBJECT SHAPE (from API):
// {
//   id: number,
//   author: { id, username, profile_picture },
//   type: 'thoughts' | 'media' | 'milestones',
//   content: string,
//   media_url: string | null,
//   likes_count: number,
//   reply_count: number,
//   shares_count: number,
//   is_liked: boolean,
//   created_at: timestamp
// }
//
// STATE UPDATES:
// - createPost: Add new post to START of array [newPost, ...prev]
// - updatePost: Map over array, replace matching post
// - deletePost: Filter out matching post
// - likePost: Update likes_count and is_liked on matching post
//
// Think about:
// - Why wait for auth before fetching?
// - How do you avoid duplicate posts when fetching by username?
// - Why return { success, error } from async functions?
//
// Hint: const { user, isLoading: authLoading } = useAuth();
// Hint: useEffect dependency array includes [user, authLoading]
// =============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import postsService from '@services/postsService';
import { useAuth } from './AuthContext';

const PostsContext = createContext(null);

export const PostsProvider = ({ children }) => {
  // TODO: Get auth state to know when to fetch
  // const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  // TODO: Set up state
  // const [posts, setPosts] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  // TODO: useEffect to fetch posts when user logs in
  // Hint: if (authLoading) return; // Wait for auth
  // Hint: if (user && isAuthenticated) fetchPosts();
  // Hint: else setPosts([]); // Clear on logout

  // TODO: Implement fetchPosts
  // Hint: const data = await postsService.getAll();
  // Hint: setPosts(data);

  // TODO: Implement fetchPostsByUsername
  // Hint: Merge new posts without duplicates

  // TODO: Implement createPost
  // Hint: setPosts(prev => [newPost, ...prev]);

  // TODO: Implement updatePost
  // Hint: setPosts(prev => prev.map(post => post.id === id ? updated : post));

  // TODO: Implement deletePost
  // Hint: setPosts(prev => prev.filter(post => post.id !== id));

  // TODO: Implement fetchReplies, createReply, likePost, sharePost

  // TODO: Return provider with all state and functions
  // Your code here
};

export const usePosts = () => {
  // TODO: Return useContext(PostsContext) with error check
  // Your code here
};

export default PostsContext;