const express = require("express");
const {
  getLoginPage,
  loginUser,
  getSignupPage,
  signupUser,
  logoutUser,
} = require("../controller/authController");

const router = express.Router();

router.get("/login", getLoginPage);

router.post("/login", loginUser);

router.get("/signup", getSignupPage);

router.post("/signup", signupUser);

router.get("/logout", logoutUser);

module.exports = router;
