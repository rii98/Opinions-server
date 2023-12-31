const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { validatejwt } = require("../middlewares/auth");
const { z } = require("zod");
const {
  handleCreate,
  handleGetSomePost,
  handleUpvotes,
  checkIfAlreadyLiked,
  getPopular,
  getFeed,
} = require("../controller/post");

const { SeenPost } = require("../models/helpermodel");
const Post = require("../models/postmodel");
const User = require("../models/usermodel");

router.post("/create", validatejwt, handleCreate);
router.get("/some", validatejwt, handleGetSomePost);
router.get("/popular", validatejwt, getPopular);

router.post("/isliked", validatejwt, checkIfAlreadyLiked);

router.post("/addupvote", validatejwt, handleUpvotes);

router.get("/:id", validatejwt, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid user id." });
  try {
    const posts = await Post.find({ user: id })
      .populate({
        path: "user",
        select: "-password -createdAt -updatedAt -__v",
      })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

router.post("/feed", validatejwt, getFeed);

router.post("/addseen", validatejwt, async (req, res) => {
  try {
    const { userId, postId } = req.body;
    const schema = z.object({
      userId: z
        .string()
        .refine((value) => mongoose.Types.ObjectId.isValid(value), {
          message: "Invalid id (zod error)",
        }),
      postId: z
        .string()
        .refine((value) => mongoose.Types.ObjectId.isValid(value), {
          message: "Invalid id (zod error)",
        }),
    });

    const validate = schema.safeParse(req.body);
    if (!validate.success) {
      return res.status(400).json({ error: "Invalid request data" });
    }
    const seenPost = await SeenPost.findOneAndUpdate(
      { user: userId },
      { $addToSet: { seenPosts: postId } },
      { new: true, upsert: true }
    );
    res.json({ result: seenPost });
  } catch (error) {
    console.error("Error in /addseen route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:postid/upvotes", validatejwt, async (req, res) => {
  const { postid } = req.params;
  const upvotes = await Post.findById({ _id: postid }).select("-_id upvotes");
  const userIds = upvotes.upvotes.map((upvote) => upvote.user);
  const users = await User.find({ _id: { $in: userIds } }).select(
    "email firstname lastname"
  );

  res.json(users);
});

module.exports = router;
