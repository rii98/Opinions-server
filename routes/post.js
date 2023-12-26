const express = require("express");
const router = express.Router();
const { validatejwt } = require("../middlewares/auth");

const { handleCreate, handleGetSomePost } = require("../controller/post");

router.post("/create", validatejwt, handleCreate);
router.get("/some", validatejwt, handleGetSomePost);

module.exports = router;
//simple comment for test
