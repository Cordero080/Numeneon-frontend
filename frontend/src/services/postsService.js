// =============================================================================
// 🟢 COLIN - Posts Lead
// postsService.js - API calls for posts CRUD operations
// =============================================================================
//
// TODO: Create a service object with methods for all posts API calls
//
// This is a plain JavaScript object (not a class) containing async functions.
// Each function makes an API call and returns the data.
// Uses apiClient (from Tito) which handles JWT tokens automatically.
//
// API ENDPOINTS:
// - GET    /api/posts/              → List all posts
// - GET    /api/posts/?username=xxx → List posts by user
// - GET    /api/posts/:id/          → Get single post
// - GET    /api/posts/:id/replies/  → Get replies to a post
// - POST   /api/posts/              → Create new post
// - PATCH  /api/posts/:id/          → Update post
// - DELETE /api/posts/:id/          → Delete post
// - POST   /api/posts/:id/like/     → Toggle like
// - POST   /api/posts/:id/share/    → Increment share count
//
// POST DATA FORMAT:
// {
//   content: string,
//   type: 'thoughts' | 'media' | 'milestones',
//   media_url?: string (optional)
// }
//
// REPLY DATA FORMAT:
// Same as post, but includes parent_id
//
// Think about:
// - Why return response.data instead of full response?
// - What does PATCH vs PUT mean? (Partial update vs full replace)
// - Why doesn't delete() return anything? (204 No Content)
//
// Hint: import apiClient from './apiClient';
// Hint: const response = await apiClient.get('/posts/');
// Hint: return response.data;
// =============================================================================

import apiClient from "./apiClient";

const postsService = {
  // TODO: getAll - GET /api/posts/
  // Returns array of posts
  getAll: async () => {
    // Your code here
  },

  // TODO: getByUsername - GET /api/posts/?username=xxx
  // Returns posts filtered by username
  getByUsername: async (username) => {
    // Your code here
  },

  // TODO: getById - GET /api/posts/:id/
  // Returns single post object
  getById: async (id) => {
    // Your code here
  },

  // TODO: getReplies - GET /api/posts/:id/replies/
  // Returns array of reply posts
  getReplies: async (id) => {
    // Your code here
  },

  // TODO: create - POST /api/posts/
  // Body: { content, type, media_url? }
  // Returns created post with id
  create: async (data) => {
    // Your code here
  },

  // TODO: createReply - POST /api/posts/
  // Body: { ...data, parent_id }
  // Returns created reply post
  createReply: async (parentId, data) => {
    // Your code here
  },

  // TODO: update - PATCH /api/posts/:id/
  // Body: { content? } (partial update)
  // Returns updated post
  update: async (id, data) => {
    // Your code here
  },

  // TODO: delete - DELETE /api/posts/:id/
  // No return value (204 No Content)
  delete: async (id) => {
    // Your code here
  },

  // TODO: like - POST /api/posts/:id/like/
  // Toggles like, returns updated post with is_liked and likes_count
  like: async (id) => {
    // Your code here
  },

  // TODO: share - POST /api/posts/:id/share/
  // Increments share count, returns updated post
  share: async (id) => {
    // Your code here
  },
};

export default postsService;
