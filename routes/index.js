const express = require("express");

const router = express.Router();
const { blogData } = require("../db/db");

// Only route here so no controller function
router.get("/", (req, res) => {
  if (!req.session.isAuth) {
    res.render("index", { isLoggedIn: false });
  } else {
    if (req.session.roll === "admin") {
      res.redirect("/admin");
    } else {
      res.render("blog/home", { isLoggedIn: true, blogData: blogData });
    }
  }
});

module.exports = router;
