const Post = require("../model/post.model.js");
const User = require("../model/user.model.js");
const asyncHandler = require("../utils/AsyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");

// Create a Post
// Assuming these are imported correctly
// const asyncHandler = require('../utils/asyncHandler'); 
// const ApiError = require('../utils/ApiError');
// const ApiResponse = require('../utils/ApiResponse');
// const Post = require('../models/Post.model'); // Adjust path as necessary

const createPost = asyncHandler(async (req, res) => {
  const { title, imageURL, content } = req.body;
  
  // *** IMPROVED LOGGING TO SEE EXACT INPUT DATA ***
  console.log("--- Incoming Create Post Data ---");
  console.log("Title:", title);
  console.log("Content Length:", content ? content.length : 'N/A');
  console.log("ImageURL Value:", imageURL); // Explicitly check the imageURL input
  console.log("---------------------------------");
  
  // Assuming user ID is correctly attached by auth middleware
  const userId = req.user.id; 

  if (!title || !content) {
    // Note: imageURL is optional based on schema validation
    throw new ApiError(400, "Title and content are required");
  }

  // Optional: Frontend validation fallback for title length before Mongoose hits
  if (title.length > 120) {
      throw new ApiError(400, "Title must not exceed 120 characters");
  }


  const post = await Post.create({
    title,
    imageURL, // Will be passed as null or a string
    content,
    user: userId,
  });

  // *** IMPROVED LOGGING TO SEE THE SAVED DOCUMENT ***
  // Use JSON.stringify for cleaner object output in console
  console.log(`--- Saved Post Document (Raw) ---`);
  console.log(JSON.stringify(post, null, 2)); 
  console.log("---------------------------------");


  const createdPost = await Post.findById(post._id).populate(
    "user",
    "username email fullName"
  );
  console.log(createdPost);
  

  // Return the populated document
  return res
    .status(201)
    .json(new ApiResponse(201, createdPost, "Post created successfully"));
});

// module.exports = { createPost, /* ... other controllers */ };
// Get all posts
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("user", "username email fullName");
  
  return res.status(200).json(new ApiResponse(200, posts, "All posts fetched"));
});

// Get a single post by ID
const getPostById = asyncHandler(async (req, res) => {
  


  
  // ✅ The fix is here: change 'req.param.id' to 'req.params.id'


  const post = await Post.findById(req.params.id).populate("user", "username email fullName");
  

  
  
  

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res.status(200).json(new ApiResponse(200, post, "Post fetched"));
});
// Update a post
const updatePost = asyncHandler(async (req, res) => {
  const { title, imageURL, content } = req.params;

  
  
  const post = await Post.findById(req.params.id);
  
 
  

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Optional: Check if current user is the owner
    console.log(`posrt userid: ${post.user}`);
    console.log(`requserid: ${req.user.id}`);

    
    
  if (post.user.toString() !== req.user.id.toString()) {
    throw new ApiError(403, "You are not authorized to update this post");
  }

  post.title = title || post.title;
  post.imageURL = imageURL || post.imageURL;
  post.content = content || post.content;

  await post.save();

  const updatedPost = await Post.findById(post._id).populate(
    "user",
    "username email fullName"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {


  
  
  const post = await Post.findById(req.params.id);
  
  
  

  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  //console.log(`Post is: ${post}`);
  console.log(`the post user: ${post.user}`);
  
  console.log(`the userid: ${req.user.id}`);
  console.log(post.user==req.user.id);
  
  
  

  // Optional: Check if current user is the owner
  // Corrected code with proper comparison
if (post.user.toString() !== req.user.id.toString()) {
  throw new ApiError(403, "You are not authorized to delete this post");
}

  await post.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

// Post Controller (toggleLike)

const toggleLike = asyncHandler(async (req, res) => {
  console.log(`toglelike`);
  
  // Get the ID of the post from the URL parameters
  const postId = req.params.id; 
  // Get the ID of the currently authenticated user
  const userId = req.user.id; 

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Convert userId to a string for array operations
  const userIdString = userId.toString();

  // Check if the user ID is already in the likes array
  const isLiked = post.likes.includes(userIdString);

  if (isLiked) {
    // UNLIKE: If the user has already liked the post, pull (remove) their ID
    post.likes.pull(userIdString);
    await post.save();
    
    return res
      .status(200)
      .json(new ApiResponse(200, { isLiked: false, likesCount: post.likes.length }, "Post unliked successfully"));
  } else {
    // LIKE: If the user has not liked the post, push (add) their ID
    post.likes.push(userIdString);
    await post.save();

    return res
      .status(200)
      .json(new ApiResponse(200, { isLiked: true, likesCount: post.likes.length }, "Post liked successfully"));
  }
});

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike
};
