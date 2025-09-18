const mongoose=require("mongoose");
const { Schema } = mongoose;




const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [120, "Title must not exceed 120 characters"],
      trim: true,
    },
    // In your postSchema
imageURL: {
    type: String,
    default: null, 
    validate: {
        validator: function (v) {
            if (!v) return true; // allow empty
            // Only requires http/https and a domain/path
            return /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(v); 
        },
        message: "Invalid image URL format (must be a valid URL)",
    },
},
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [50, "Content must be at least 50 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // references User model
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User", // This array holds the IDs of users who liked the post
      default: [], // Starts as an empty array
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
