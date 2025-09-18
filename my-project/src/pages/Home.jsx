import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllPosts } from "../api"; // Import the API function

export default function Home() {
    const { token, user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [topPosts, setTopPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const result = await getAllPosts(token); // Use the centralized API function
                const allPosts = result.data;
                setPosts(allPosts);

                const sortedPosts = [...allPosts].sort(
                    (a, b) => b.likes.length - a.likes.length
                );
                setTopPosts(sortedPosts.slice(0, 5));

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [token]);

    const bannerSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        dotsClass: "slick-dots slick-thumb",
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <h2 className="text-2xl font-semibold text-indigo-700 p-6 border rounded-lg shadow-md">
                    Please log in to view posts
                </h2>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl text-indigo-500">Loading posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl text-red-500">Error fetching posts: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {topPosts.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Top Posts 🔥</h2>
                    <Slider {...bannerSettings}>
                        {topPosts.map(post => (
                            <div key={post._id} className="px-2">
                                <Link to={`/PostDetails/${post._id}`} className="block relative h-80 rounded-2xl overflow-hidden group shadow-lg">
                                    <img
                                        src={post.imageURL || 'https://via.placeholder.com/800x400?text=Blog+Post'}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6 text-white">
                                        <h3 className="text-2xl lg:text-3xl font-bold leading-tight mb-2 group-hover:text-indigo-300 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-gray-200">
                                            {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </Slider>
                </div>
            )}

            <div className="flex justify-between items-center mb-10 border-b pb-4 border-gray-200">
                <h1 className="text-4xl font-extrabold text-gray-900">
                    Recent Blog Posts
                </h1>
                <Link
                    to="/CreatePost"
                    className="bg-indigo-600 text-white font-medium py-2 px-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
                >
                    Create Post
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {posts.length > 0 ? (
                    posts.map((post) => {
                        const currentUserId = user?._id || user?.id;
                        const hasUserLiked = post.likes.includes(currentUserId);
                        return (
                            <Link key={post._id} to={`/PostDetails/${post._id}`} className="block group">
                                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
                                    {post.imageURL ? (
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={post.imageURL}
                                                alt={`Cover image for ${post.title}`}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-48 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
                                            No Image Available
                                        </div>
                                    )}
                                    <div className="p-5 flex-grow">
                                        <h2 className="text-xl font-extrabold text-gray-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 text-sm line-clamp-3">
                                            {post.content}
                                        </p>
                                    </div>
                                    <div className="p-5 pt-3 flex justify-between items-center border-t border-gray-100">
                                        <div className="flex items-center space-x-1 text-gray-500">
                                            <svg
                                                className={`w-5 h-5 transition-colors ${hasUserLiked ? "text-red-500" : "text-gray-400"}`}
                                                fill={hasUserLiked ? "currentColor" : "none"}
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={hasUserLiked ? "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" : "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364l-.318.318-.318-.318a4.5 4.5 0 00-6.364 0z"} />
                                            </svg>
                                            <span className="font-semibold text-sm text-gray-700">
                                                {post.likes.length}{" "}
                                                {post.likes.length === 1 ? "Like" : "Likes"}
                                            </span>
                                        </div>
                                        <span className="text-indigo-600 font-bold text-sm hover:text-indigo-700 transition-colors">
                                            Read Full Post &rarr;
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="col-span-full">
                        <p className="text-center text-lg text-gray-500 mt-10 p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                            No posts available. Start by creating a new one!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}