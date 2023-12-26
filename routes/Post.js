const express = require("express");
const router = express.Router();

const { handleCreate } = require("../controller/post.JS");
const { handleGetSomePost } = require("../controller/post.JS");
router.post("/create", handleCreate);
router.get("/some", handleGetSomePost);

module.exports = router;
