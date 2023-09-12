const express = require("express");
const { verifyAuth } = require("../middleware/auth");
const router = express.Router();

router.use(verifyAuth);

// Getting create-post page
router.get("/create-post", (req, res) => {
  res.render("blog/createPost", { isLoggedIn: req.session.isAuth });
});

// Post method for submitting post to db
router.post("/create-post", (req, res) => {
  console.log(req.body);

  res.redirect("/");
});

module.exports = router;
