const express = require("express");
const router = express.Router();
const { validatejwt } = require("../middlewares/auth");
const {
  handleCreate,
  handleGetSomePost,
  handleUpvotes,
} = require("../controller/post");
const Post = require("../models/postmodel");
router.post("/create", validatejwt, handleCreate);
router.get("/some", validatejwt, handleGetSomePost);
router.get("/popular", validatejwt, async (req, res, next) => {
  try {
    const popular = await Post.find()
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(10)
      .populate({
        path: "user",
        select: "-password -createdAt -updatedAt -__v",
      });
    res.json(popular);
  } catch (error) {
    next(error);
  }
});

router.post("/addupvote", handleUpvotes);

module.exports = router;
//simple comment for test
