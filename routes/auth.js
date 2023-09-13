const express = require("express");
const {
  getLoginPage,
  loginUser,
  getSignupPage,
  signupUser,
  logoutUser,
} = require("../controller/authController");

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  res.setHeader("Pragma", "no-cache");
  next();
});

router.get("/login", getLoginPage);

router.post("/login", loginUser);

router.get("/signup", getSignupPage);

router.post("/signup", signupUser);

router.get("/logout", logoutUser);

module.exports = router;
