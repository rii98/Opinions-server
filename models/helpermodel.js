const mongoose = require("mongoose");

//to track which user have seen which post
const seenPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  seenPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});
const SeenPost = mongoose.model("SeenPost", seenPostSchema);

module.exports = { SeenPost };
