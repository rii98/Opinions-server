const express = require("express");
const router = express.Router();
const { validatejwt } = require("../middlewares/auth");
const User = require("../models/usermodel");
router.get("/self", validatejwt, async (req, res) => {
  const user = await User.findById({ _id: req.user.id }).select("-password");
  res.json(user);
});

module.exports = router;
//simple comment for test
