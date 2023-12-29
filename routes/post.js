const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { validatejwt } = require("../middlewares/auth");
const {
  handleCreate,
  handleGetSomePost,
  handleUpvotes,
  checkIfAlreadyLiked,
  getPopular,
} = require("../controller/post");
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

module.exports = router;
//simple comment for test
