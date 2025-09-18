// src/hooks/usePost.js

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// highlight-next-line
import * as apiService from '../api.js'; // UPDATE THIS IMPORT

export default function usePost(postId) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setLoading(false);
        setError("No post ID provided.");
        return;
      }
      setLoading(true);
      setError(null);
      
      try {
        // highlight-next-line
        const response = await apiService.getPostById(postId); // Use the real service
        setPost(response);
      } catch (err) {
        console.error("Fetch post error:", err);
        setError(err.message || "Could not find the requested post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const toggleLike = useCallback(async () => {
    // ... (rest of the function is identical)
    
    // API Call: Sync with the server
    try {
      // highlight-next-line
      await apiService.togglePostLike(postId, token); // Use the real service
    } catch (err) {
      console.error("Toggle like error:", err);
      setPost(originalPost); 
      alert("There was an error updating your like. Please try again.");
    }
  }, [post, user, postId, token]);

  const deletePost = useCallback(async () => {
    if (!window.confirm("Are you sure you want to permanently delete this post?")) {
      return;
    }

    try {
      // highlight-next-line
      await apiService.deletePost(postId, token); // Use the real service
      alert("Post deleted successfully.");
      navigate('/');
    } catch (err) {
      console.error("Delete post error:", err);
      setError(err.message || "Failed to delete the post.");
    }
  }, [postId, token, navigate]);

  return { post, loading, error, toggleLike, deletePost };
}