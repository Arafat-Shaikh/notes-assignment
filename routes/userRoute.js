const express = require("express");
const { signupUser, loginUser } = require("../controllers/userController");
const router = express.Router();

router.post("/signup", signupUser).post("/login", loginUser);

exports.router = router;
