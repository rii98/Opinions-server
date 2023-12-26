const express = require("express");
const router = express.Router();

const { handleCreate, handleGetSomePost } = require("../controller/post");

router.post("/create", handleCreate);
router.get("/some", handleGetSomePost);

module.exports = router;
//simple comment for test
