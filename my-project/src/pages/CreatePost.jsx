import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiSend, FiLoader, FiAlertTriangle } from "react-icons/fi"; // Added FiAlertTriangle

// --- Shared Components/Utilities ---

// Component for a styled separator line
const Separator = () => (
    // Slightly more visible separator
    <div className="my-10 border-t border-gray-100"></div>
);

// Custom Input Field Component for reusability and clean form structure
const InputField = ({ label, id, name, type = "text", value, onChange, placeholder, required = false, rows = 1 }) => {
    const isTextArea = type === "textarea";

    // UPDATED: Common classes for input/textarea styling - cleaner shadow and focus ring
    const commonClasses = "w-full p-4 border border-gray-200 bg-white rounded-xl shadow-sm transition duration-200 ease-in-out placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500";

    const inputElement = isTextArea ? (
        <textarea
            id={id}
            name={name}
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`${commonClasses} resize-y`} // resize-y for vertical resizing
        />
    ) : (
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={commonClasses}
        />
    );

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-3">
                {label}
            </label>
            {inputElement}
        </div>
    );
};

// --- Main Component ---

export default function CreatePost() {
    const { token } = useAuth();
    const navigate = useNavigate();

    // Consolidated state for form data
    const [postData, setPostData] = useState({
        title: "",
        content: "",
        imageURL: ""
    });

    // Consolidated state for submission process
    const [submissionStatus, setSubmissionStatus] = useState({
        isSubmitting: false,
        error: null
    });

    // Destructure for cleaner access
    const { title, content, imageURL } = postData;
    const { isSubmitting, error: submissionError } = submissionStatus;

    // Handler for input changes (works for all fields)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData(prevData => ({ ...prevData, [name]: value }));
    };

    // Handler for form submission (unchanged logic)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus({ isSubmitting: true, error: null });

        try {
            const res = await fetch("http://localhost:8000/api/v1/post/createpost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to create post. Please check your network or token.");
            }

            navigate("/");

        } catch (err) {
            console.error("Error creating post:", err);
            setSubmissionStatus(prev => ({ ...prev, error: err.message }));

        } finally {
            setSubmissionStatus(prev => ({ ...prev, isSubmitting: false }));
        }
    };

    return (
        // UPDATED: Tighter max-width for "article" feel
        <div className="flex justify-center py-16 px-4 bg-gray-50 min-h-screen">
            <div className="w-full max-w-3xl bg-white p-8 lg:p-12 rounded-3xl shadow-2xl border border-gray-100">

                {/* --- Header Section --- */}
                <header className="mb-10">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Create New Blog Post
                    </h2>
                    {/* UPDATED: Subtler visual break */}
                    <div className="w-20 h-1 bg-indigo-500 rounded-full mb-4"></div>
                    <p className="text-gray-500 text-lg">
                        Draft your masterpiece and share it with the community.
                    </p>
                </header>

                {/* --- Error Message --- */}
                {submissionError && (
                    // UPDATED: Clearer error icon and style
                    <div className="p-4 mb-8 flex items-start space-x-3 text-base font-medium text-red-700 bg-red-50 border border-red-300 rounded-xl">
                        <FiAlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <span className="font-extrabold block">Submission Failed</span>
                            <p className="text-sm text-red-600 mt-1">{submissionError}</p>
                        </div>
                    </div>
                )}

                {/* --- Form Section --- */}
                <form onSubmit={handleSubmit} className="space-y-10"> {/* Increased spacing */}

                    {/* Title Input */}
                    <InputField
                        label="Post Title"
                        id="title"
                        name="title"
                        value={title}
                        onChange={handleChange}
                        placeholder="A compelling title for your blog..."
                        required
                    />

                    {/* Content Textarea */}
                    <InputField
                        label="Content"
                        id="content"
                        name="content"
                        type="textarea"
                        rows={15} // Increased rows for a better writing area
                        value={content}
                        onChange={handleChange}
                        placeholder="Start writing your amazing story here..."
                        required
                    />

                    {/* Image URL Input and Preview */}
                    <div>
                        <InputField
                            label="Image URL (Optional Featured Image)"
                            id="imageURL"
                            name="imageURL"
                            type="url"
                            value={imageURL}
                            onChange={handleChange}
                            placeholder="e.g., https://unsplash.com/images/blog-cover.jpg"
                        />

                        {/* Image Preview */}
                        {imageURL && (
                            // UPDATED: Cleaner, less noisy preview box style
                            <div className="mt-8 p-6 bg-gray-50 border-2 border-indigo-200/50 rounded-xl">
                                <p className="text-sm font-bold text-gray-600 mb-4 flex items-center">
                                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    Image Preview
                                </p>
                                <img
                                    src={imageURL}
                                    alt="Post Featured Image Preview"
                                    className="max-h-80 w-full object-cover rounded-lg shadow-lg"
                                    onError={(e) => {
                                        // UPDATED: Better error display
                                        e.target.style.display = 'none';
                                        e.target.parentNode.innerHTML += '<div class="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 font-medium">⚠️ Invalid Image URL. Preview failed to load.</div>';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                            w-full flex items-center justify-center space-x-3 text-white px-6 py-4 rounded-xl font-extrabold text-xl tracking-wider shadow-xl transition duration-300 ease-in-out transform
                            ${isSubmitting
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 hover:shadow-2xl hover:scale-[1.005]'
                            }
                        `}
                    >
                        {isSubmitting ? (
                            <>
                                <FiLoader className="animate-spin h-6 w-6" />
                                <span>Publishing Post...</span>
                            </>
                        ) : (
                            <>
                                <FiSend className="h-6 w-6 -rotate-12" /> {/* Subtle rotation */}
                                <span>Publish Post</span>
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}