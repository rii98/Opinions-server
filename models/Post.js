const mongoose = require("mongoose");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema(
    {
      text: {
        type: String,
        required: [true, "Post cannot be empty."],
      },
      upvotes: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  )
);
module.exports = Post;
