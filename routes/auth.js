const express = require("express");
const { login, signup, authValidate } = require("../controller/auth");
const router = express.Router();
router.post("/login", login);
router.post("/signup", signup);
router.get("/validate", authValidate);
module.exports = router;
