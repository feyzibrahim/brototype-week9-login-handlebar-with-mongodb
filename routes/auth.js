const express = require("express");

const router = express.Router();

// Retrieving login page
router.get("/login", (req, res) => {
  if (!req.session.isAuth) {
    res.render("auth/login", { isLoggedIn: false });
  } else {
    res.redirect("/");
  }
});

// Handling Login Form Submission
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "faiz" && password === "123") {
    // Session Handling
    req.session.username = username;
    req.session.password = password;
    req.session.isAuth = true;

    res.redirect("/");
  } else {
    res.render("auth/login");
  }
});

// Retrieving Signup Page
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// Handling logout and destroying the session
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
