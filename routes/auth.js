const express = require("express");
const User = require("../models/usermodel");
const router = express.Router();
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user.validatePassword(password)) {
      res.json({ user });
    } else {
      res.status(401).json({ message: "Incorrect email or password." });
    }
  } catch (error) {
    res.status(401).json(error);
  }
});
router.post("/signup", async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  try {
    const user = await User.create({ email, password, firstname, lastname });
    res.json({ user });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: "Email is in use." });
    res.status(400).json(error);
  }
});
module.exports = router;
