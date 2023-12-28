const mongoose = require("mongoose");

const upvoteSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post detail is missing (upvote error)."],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User detail is missing (upvote error)."],
    },
  },
  {
    timestamps: true,
  }
);

const Upvote = mongoose.model("Upvote", upvoteSchema);

module.exports = { Upvote, upvoteSchema };
