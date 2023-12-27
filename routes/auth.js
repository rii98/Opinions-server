const express = require("express");
const jwt = require("jsonwebtoken");
const { login, signup } = require("../controller/auth");
const router = express.Router();
router.post("/login", login);
router.post("/signup", signup);
router.get("/validate", (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ verified: false });
  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    return res.json({ verified: true });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ verified: false });
  }
});
module.exports = router;
