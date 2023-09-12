const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  if (!req.session.isAuth) {
    res.render("index");
  } else {
    res.render("blog/home");
  }
});

module.exports = router;
