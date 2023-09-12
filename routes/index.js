const express = require("express");

const router = express.Router();
const { blogData } = require("../db/db");

router.get("/", (req, res) => {
  if (!req.session.isAuth) {
    res.render("index", { isLoggedIn: false });
  } else {
    res.render("blog/home", { isLoggedIn: true, blogData: blogData });
  }
});

module.exports = router;
