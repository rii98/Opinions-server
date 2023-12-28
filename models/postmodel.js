const mongoose = require("mongoose");
const { upvoteSchema } = require("./upvotesmodel");
const PostSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Post cannot be empty."],
    },
    upvotes: [upvoteSchema],
    // Change type to an array of Upvotes,
    upvotesCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User detail is missing."],
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
