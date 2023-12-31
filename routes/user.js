const express = require("express");
const router = express.Router();
const { validatejwt } = require("../middlewares/auth");

const {
  getSelf,
  follow,
  searchUser,
  checkIfFollowing,
} = require("../controller/user");
const User = require("../models/usermodel");
router.get("/search", validatejwt, searchUser);
router.get("/self", validatejwt, getSelf);
router.get("/:id", validatejwt, async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById({ _id: id }).select(
      "-password -createdAt -updatedAt"
    );
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.post("/follow", validatejwt, follow);
router.post("/isfollowing", validatejwt, checkIfFollowing);
router.get("/following/:id", validatejwt, async (req, res) => {
  const { id } = req.params;

  const user = await User.findById({ _id: id }).select("following").populate({
    path: "following",
    select: "-password -createdAt -updatedAt -__v",
  });
  res.json(user.following);
});
router.get("/followers/:id", validatejwt, async (req, res) => {
  const { id } = req.params;

  const user = await User.findById({ _id: id })
    .select("followers -_id")
    .populate({
      path: "followers",
      select: "-password -createdAt -updatedAt -__v",
    });
  res.json(user.followers);
});
module.exports = router;
//simple comment for test
