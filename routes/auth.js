const express = require("express");

const router = express.Router();

router.get("/login", (req, res) => {
  if (!req.session.isAuth) {
    res.render("auth/login");
  } else {
    res.redirect("/");
  }
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "faiz" && password === "123") {
    req.session.username = username;
    req.session.password = password;
    req.session.isAuth = true;

    res.redirect("/");
  } else {
    res.render("auth/login");
  }
});

router.get("/logout", (req, res) => {
  console.log(req.session.id);
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
