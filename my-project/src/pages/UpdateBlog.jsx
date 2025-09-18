import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; 

function UpdateBlog() {
  // 1. Get the blogId (always reliable) and hooks

  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  
  // Extract postData from the navigation state (only available on initial click)
  const passedPostData = location.state?.postData;
    console.log(`post fata${passedPostData._id}`);
    const blogId= passedPostData._id;
    console.log(`blogId${blogId}`);
    
    
    
  
  console.log(`data ${passedPostData ? 'loaded' : 'missing'}`);
  // FIX: Use blogId from useParams for logging the ID
  console.log(`blogId from URL: ${blogId}`);
  
  
  // State for form data and UI status
  // Initialize state with passed data, if available.
  const [title, setTitle] = useState(passedPostData?.title || '');
  const [content, setContent] = useState(passedPostData?.content || '');
  
  // Loading is set to false immediately since we rely on passed data
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // NOTE: The original useEffect for API fetching has been REMOVED as requested.

  // Use an effect to handle the scenario where the user refreshes or navigates directly
  useEffect(() => {
    // We only need to show an error if the user tries to edit without form data present
    if (!passedPostData && !loading) {
        console.error("Post data is missing. Please navigate from the post details page.");
        setError("Post data is missing. Please return to the post details page and try again.");
        // Optional: navigate('/', { replace: true });
    }
  }, [passedPostData, loading, navigate]);


  // --- 3. Handle form submission (API Call for Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Block submission if data was lost (i.e., form fields are empty after refresh/data loss)
    if (!title || !content) {
        setError("Cannot submit: Title or content is empty.");
        return;
    }

    setSubmitting(true);
    setError(null);

    const updatedPost = { title, content }; // Prepare the data payload

    try {
        
      // Use 'blogId' from useParams() for the update API call
      const res = await fetch(`https://blog-2-tt3h.onrender.com/api/v1/post/updatepost/${blogId}`, {
        method: 'PUT', // Use PUT or PATCH based on your API
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPost),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update blog post.');
      }
      
      // Success: Navigate back to the post detail page
      navigate(`/PostDetails/${blogId}`); 


    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Render Logic ---

  // Check for data loss error first (if the form is empty)
  if (error && !title && !content) {
    return <div className="p-8 text-center text-xl font-semibold text-red-600">Error: {error}</div>;
  }
  
  if (loading) {
    return <div className="p-8 text-center text-xl font-semibold text-gray-500">Initializing form...</div>;
  }


  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Update Post: ID {blogId}</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
        
        {/* Title Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="title"
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting || !title} 
          />
        </div>
        
        {/* Content Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">Content</label>
          <textarea
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 resize-none"
            id="content"
            placeholder="Blog Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={submitting || !content} 
          ></textarea>
        </div>
        
        {/* Submission Button and Error Display */}
        <div className="flex items-center justify-between">
          <button
            className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors ${
                submitting || !title || !content 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            type="submit"
            disabled={submitting || !title || !content} 
          >
            {submitting ? 'Updating...' : 'Save Changes'}
          </button>
          
          {error && submitting && <p className="text-red-500 text-sm font-medium">Error: {error}</p>}
        </div>
      </form>
    </div>
  );
}

export default UpdateBlog;