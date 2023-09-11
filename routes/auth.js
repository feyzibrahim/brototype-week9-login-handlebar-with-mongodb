const express = require("express");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "faiz" && password === "123") {
    res.render("home");
  } else {
    res.render("auth/login");
  }
});

module.exports = router;
