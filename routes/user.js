const express = require("express");
const router = express.Router();
const { validatejwt } = require("../middlewares/auth");

const { getSelf } = require("../controller/user");
router.get("/self", validatejwt, getSelf);
module.exports = router;
//simple comment for test
