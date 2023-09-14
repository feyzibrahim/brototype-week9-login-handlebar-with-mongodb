const express = require("express");
const { verifyAuth } = require("../middleware/auth");
const {
  getUsersList,
  deleteUser,
  editUser,
  updateUser,
  newUser,
  createNewUser,
} = require("../controller/adminController");

const router = express.Router();

// Middleware for verifying the user is logged in.

router.use(verifyAuth);

// Different routes
router.get("/", getUsersList);

router.get("/delete/:id", deleteUser);

router.get("/edit/:id", editUser);

router.post("/edit/:id", updateUser);

router.get("/newUser", newUser);

router.post("/newUser", createNewUser);

module.exports = router;
