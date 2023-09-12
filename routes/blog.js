const express = require("express");

const router = express.Router();

// Getting create-post page
router.get("/create-post", (req, res) => {
  res.render("blog/createPost");
});

// Post method for submitting post to db
router.post("/create-post", (req, res) => {
  console.log(req.body);

  res.redirect("/");
});

module.exports = router;
