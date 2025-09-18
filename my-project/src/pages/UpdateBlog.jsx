import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { updatePost, getPostById } from "../api"; // Import API functions

function UpdateBlog() {
    const { id: blogId } = useParams(); // Get blogId from URL parameters
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    // State for form data and UI status
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true); // Start loading until data is fetched
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Effect to fetch post data if not passed via location state (e.g., on page refresh)
    useEffect(() => {
        const passedPostData = location.state?.postData;

        if (passedPostData) {
            setTitle(passedPostData.title);
            setContent(passedPostData.content);
            setLoading(false);
        } else {
            // Data not passed, so fetch from API
            console.log("No post data passed in state, fetching from API...");
            const fetchPost = async () => {
                try {
                    const result = await getPostById(blogId, token);
                    setTitle(result.data.title);
                    setContent(result.data.content);
                } catch (err) {
                    console.error("Failed to fetch post for editing:", err);
                    setError("Could not load post data. Please try again.");
                } finally {
                    setLoading(false);
                }
            };
            fetchPost();
        }
    }, [blogId, token, location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            setError("Title and content cannot be empty.");
            return;
        }

        setSubmitting(true);
        setError(null);

        const updatedPost = { title, content };

        try {
            await updatePost(blogId, updatedPost, token); // Use the centralized API function
            navigate(`/PostDetails/${blogId}`);
        } catch (err) {
            console.error("Update error:", err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-xl font-semibold text-gray-500">Loading editor...</div>;
    }

    if (error && !title && !content) {
        return <div className="p-8 text-center text-xl font-semibold text-red-600">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Update Post</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
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
                        disabled={submitting}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">Content</label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 resize-y"
                        id="content"
                        placeholder="Blog Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        disabled={submitting}
                    ></textarea>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors ${submitting || !title || !content ? 'bg-blue-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                        type="submit"
                        disabled={submitting || !title || !content}
                    >
                        {submitting ? 'Updating...' : 'Save Changes'}
                    </button>
                    {error && <p className="text-red-500 text-sm font-medium">Error: {error}</p>}
                </div>
            </form>
        </div>
    );
}

export default UpdateBlog;