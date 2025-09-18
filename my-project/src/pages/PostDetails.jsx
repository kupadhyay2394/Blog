import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPostById, deletePost, toggleLikeOnPost } from "../api"; // Import API functions

export default function PostDetails() {
    const { id } = useParams();
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            if (!token || !id) {
                setLoading(false);
                if (!token) navigate("/login");
                setError("Missing authentication token or post ID.");
                return;
            }

            try {
                const result = await getPostById(id, token); // Use the centralized API function
                const fetchedPost = result.data;
                setPost(fetchedPost);

                const currentUserId = user?.id || user?._id;
                setIsLiked(fetchedPost.likes.includes(currentUserId));
                setLikesCount(fetchedPost.likes.length);

            } catch (err) {
                console.error("Error fetching post:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, token, navigate, user]);

    const handleDelete = async () => {
        const isConfirmed = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
        if (!isConfirmed) return;

        try {
            await deletePost(id, token); // Use the centralized API function
            navigate("/", { state: { message: "Post successfully deleted!" } });
        } catch (err) {
            console.error("Error deleting post:", err);
            setError(err.message);
        }
    };

    const handleToggleLike = async () => {
        if (!token) {
            alert("You must be logged in to like a post!");
            navigate("/login");
            return;
        }

        const originalIsLiked = isLiked;
        const originalLikesCount = likesCount;

        setIsLiked(!isLiked);
        setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));

        try {
            await toggleLikeOnPost(id, token); // Use the centralized API function
        } catch (err) {
            console.error("Error toggling like:", err);
            setIsLiked(originalIsLiked);
            setLikesCount(originalLikesCount);
            setError("Could not update like status: " + err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce"></div>
                    <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
                    <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
                    <p className="text-lg font-medium text-gray-700">Loading post details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        // Only render the detailed post content error if the post object itself is present
        // Otherwise, show a full-page error
        if (!post) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                    <div className="w-full max-w-lg p-8 text-center bg-white border-t-4 border-red-500 rounded-xl shadow-2xl">
                        <svg className="w-10 h-10 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.398 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <p className="mb-3 text-2xl font-bold text-red-700">Something Went Wrong</p>
                        <p className="mb-6 text-gray-600">Failed to load post. {error}</p>
                        <button onClick={() => navigate("/")} className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150">
                            Go Back Home
                        </button>
                    </div>
                </div>
            );
        }
    }


    if (!post) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="w-full max-w-lg p-8 text-center bg-white rounded-xl shadow-2xl">
                    <svg className="w-10 h-10 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="mb-3 text-2xl font-bold text-gray-700">Post Not Found</p>
                    <p className="mb-6 text-gray-500">The post you are looking for does not exist or has been deleted.</p>
                    <button onClick={() => navigate("/")} className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150">
                        Explore Other Posts
                    </button>
                </div>
            </div>
        );
    }

    const isOwner = user && post.user && (user.id === post.user._id || user._id === post.user._id);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {error && ( // Display non-critical errors here (like failed like)
                    <div className="p-4 mb-8 text-sm text-red-700 bg-red-100 rounded-lg">
                        <strong>Error:</strong> {error}
                    </div>
                )}
                <article className="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-xl">
                    {post.imageURL && (
                        <img
                            src={post.imageURL}
                            alt={post.title}
                            className="object-cover w-full h-96"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            loading="lazy"
                        />
                    )}
                    <div className="p-6 md:p-10">
                        {isOwner && (
                            <div className="flex justify-end mb-8 space-x-4">
                                <Link
                                    to={`/UpdateBlog/${id}`}
                                    state={{ postData: post }}
                                    className="inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow-lg transition duration-300 transform hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    Edit Post
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-full shadow-lg transition duration-300 transform hover:-translate-y-0.5 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    Delete Post
                                </button>
                            </div>
                        )}
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-between pt-4 pb-8 border-t border-gray-100">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="text-lg font-bold text-gray-800">
                                        By <span className="text-indigo-600">{post.user.fullName}</span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Published on <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center mt-4 space-x-3 sm:mt-0">
                                <button
                                    onClick={handleToggleLike}
                                    className={`p-3 rounded-full transition duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isLiked ? 'bg-red-100 text-red-600 focus:ring-red-500' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 focus:ring-indigo-500'}`}
                                    aria-label={isLiked ? "Unlike post" : "Like post"}
                                >
                                    <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 10.364l-.318-.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                </button>
                                <span className="text-lg font-bold text-gray-700">
                                    {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
                                </span>
                            </div>
                        </div>
                        <div className="max-w-none prose prose-lg md:prose-xl text-gray-800">
                            <p className="whitespace-pre-line leading-relaxed">
                                {post.content}
                            </p>
                        </div>
                    </div>
                </article>
                <div className="mt-12 text-center">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center px-6 py-3 font-medium text-indigo-600 bg-white border-2 border-indigo-200 rounded-full hover:bg-indigo-50 hover:border-indigo-600 transition duration-300">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}