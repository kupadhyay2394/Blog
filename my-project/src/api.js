// src/api.js

// The base URL for your API. All requests will be prefixed with this.
const BASE_URL = "https://blog-4-gzpl.onrender.com/api/v1";

/**
 * A helper function to handle API requests, including setting headers,
 * checking the response, and parsing JSON. This reduces boilerplate code.
 * @param {string} endpoint - The API endpoint to call (e.g., '/users/login').
 * @param {string} [method='GET'] - The HTTP method.
 * @param {object|null} [body=null] - The request body for POST/PUT/PATCH requests.
 * @param {string|null} [token=null] - The authorization token.
 * @returns {Promise<any>} - A promise that resolves with the JSON data from the API.
 * @throws {Error} - Throws an error if the network request fails or the API returns an error.
 */
const apiCall = async (endpoint, method = 'GET', body = null, token = null) => {
  console.log("api called");
  
  const options = {
    method,
    headers: {},
  };

  // If a body is provided, set the Content-Type and stringify the body.
  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  // If a token is provided, add the Authorization header.
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    // If the response is not ok (status code is not 2xx), throw an error.
    if (!response.ok) {
      // Use the error message from the API if available, otherwise use a default.
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call failed: ${method} ${endpoint}`, error);
    
    throw error;
  }
};

// --- User Authentication ---
export const loginUser = (credentials) => apiCall('/users/login', 'POST', credentials);
export const registerUser = (userData) => apiCall('/users/register', 'POST', userData);

// --- Post Management ---
export const getAllPosts = (token) => apiCall('/post/getallpost', 'GET', null, token);
export const getPostById = (postId, token) => apiCall(`/post/getpostbyID/${postId}`, 'GET', null, token);
export const createPost = (postData, token) => apiCall('/post/createpost', 'POST', postData, token);
// Note: Your original endpoint had a typo "deletpost". Keeping it consistent with your backend.
export const deletePost = (postId, token) => apiCall(`/post/deletpost/${postId}`, 'DELETE', null, token);
export const updatePost = (postId, postData, token) => apiCall(`/post/updatepost/${postId}`, 'PUT', postData, token);

// --- Post Interactions ---
export const toggleLikeOnPost = (postId, token) => apiCall(`/post/toggle-like/${postId}`, 'PATCH', null, token);