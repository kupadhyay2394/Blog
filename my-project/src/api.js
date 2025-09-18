// src/services/apiService.js

import { api } from './api'; // Assuming your helper is in 'api.js'

// You would get this from your environment variables
const API_BASE_URL = 'https://blog-2-tt3h.onrender.com'; 

// --- Post-Specific API Calls ---

export const getPostById = (postId) => {
  return api(`/api/v1/post/${postId}`, { baseUrl: API_BASE_URL });
};

export const togglePostLike = (postId, token) => {
  // Use the 'options' object for method and the 'token' argument for auth
  const options = { 
    method: 'PATCH',
    baseUrl: API_BASE_URL 
  };
  return api(`/api/v1/post/${postId}/like`, options, token);
};

export const deletePost = (postId, token) => {
  const options = {
    method: 'DELETE',
    baseUrl: API_BASE_URL
  };
  return api(`/apiv1/posts/${postId}`, options, token);
};

// You can add other API functions here as your app grows
// export const getAllPosts = () => api('/api/posts', { baseUrl: API_BASE_URL });