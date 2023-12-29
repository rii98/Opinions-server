const express = require("express");
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
router.post("/create", validatejwt, handleCreate);
router.get("/some", validatejwt, handleGetSomePost);
router.get("/popular", validatejwt, getPopular);

router.post("/isliked", validatejwt, checkIfAlreadyLiked);

router.post("/addupvote", validatejwt, handleUpvotes);

module.exports = router;
//simple comment for test
