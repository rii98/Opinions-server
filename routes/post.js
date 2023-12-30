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
const { isValid } = require("zod");
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
    const posts = await Post.find({ user: id }).populate({
      path: "user",
      select: "-password -createdAt -updatedAt -__v",
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

router.post("/feed", getFeed);

router.post("/addseen", async (req, res) => {
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
  if (!validate.success) return res.status(400).json(validate.error);

  if (await SeenPost.findOne({ user: userId })) {
    const checkIfAlreadySeen = await SeenPost.findOne({
      user: userId,
      seenPosts: postId,
    });
    if (checkIfAlreadySeen) {
      return res.json(checkIfAlreadySeen);
    }
    const seenPost = await SeenPost.findOneAndUpdate(
      { user: userId },
      { $push: { seenPosts: postId } },
      {
        new: true,
      }
    );
    res.json(seenPost);
  } else {
    const seenPost = await SeenPost.create({
      user: userId,
      seenPosts: [postId],
    });
    res.json(seenPost);
  }
});

// router.post("/hi", async (req, res) => {
//   const { fol } = req.body;
//   const sp = await SeenPost.findOne({ user: fol }).select("seenPosts");
//   const seenPosts = sp.seenPosts; //array only return
//   res.json(seenPosts);
// });
module.exports = router;
//simple comment for test
