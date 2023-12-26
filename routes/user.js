const express = require("express");
const router = express.Router();
const { validatejwt } = require("../middlewares/auth");

const { getSelf } = require("../controller/user");
const User = require("../models/usermodel");
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
module.exports = router;
//simple comment for test
