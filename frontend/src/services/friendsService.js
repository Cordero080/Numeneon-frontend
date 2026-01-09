// =============================================================================
// 🟣 CRYSTAL - Friends Lead
// friendsService.js - API calls for friends system
// =============================================================================
//
// TODO: Create a service object with methods for all friends API calls
//
// This is a plain JavaScript object containing async functions.
// Each function makes an API call and returns the data.
// Uses apiClient (from Tito) which handles JWT tokens automatically.
//
// API ENDPOINTS:
// - GET    /api/friends/                  → List my current friends
// - GET    /api/friends/requests/         → Get pending incoming requests
// - POST   /api/friends/request/:user_id/ → Send friend request
// - POST   /api/friends/accept/:request_id/ → Accept incoming request
// - POST   /api/friends/decline/:request_id/ → Decline incoming request
// - DELETE /api/friends/remove/:user_id/  → Remove a friend
//
// FRIEND OBJECT SHAPE:
// {
//   id: number,
//   username: string,
//   first_name: string,
//   last_name: string,
//   profile_picture: string | null
// }
//
// REQUEST OBJECT SHAPE:
// {
//   id: number (request ID, not user ID),
//   from_user: { id, username, ... },
//   created_at: timestamp
// }
//
// Think about:
// - Why are there different IDs? (user ID vs request ID)
// - acceptRequest uses request ID (from pending list)
// - removeFriend uses user ID (from friends list)
//
// Hint: import apiClient from './apiClient';
// Hint: const response = await apiClient.get('/friends/');
// Hint: return response.data;
// =============================================================================

import apiClient from "./apiClient";

const friendsService = {
  // TODO: getAll - GET /api/friends/
  // Returns array of friend user objects
  getAll: async () => {
    // Your code here
  },

  // TODO: getPendingRequests - GET /api/friends/requests/
  // Returns array of incoming friend request objects
  getPendingRequests: async () => {
    // Your code here
  },

  // TODO: sendRequest - POST /api/friends/request/:userId/
  // Sends friend request to specified user
  sendRequest: async (userId) => {
    // Your code here
  },

  // TODO: acceptRequest - POST /api/friends/accept/:requestId/
  // Accepts incoming request, returns the new friend object
  acceptRequest: async (requestId) => {
    // Your code here
  },

  // TODO: declineRequest - POST /api/friends/decline/:requestId/
  // Declines incoming request
  declineRequest: async (requestId) => {
    // Your code here
  },

  // TODO: remove - DELETE /api/friends/remove/:userId/
  // Removes existing friend (no return value)
  remove: async (userId) => {
    // Your code here
  },
};

export default friendsService;
