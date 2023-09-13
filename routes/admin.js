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

router.use(verifyAuth);

router.get("/", getUsersList);

router.get("/delete/:id", deleteUser);

router.get("/edit/:id", editUser);

router.post("/edit/:id", updateUser);

router.get("/newUser", newUser);

router.post("/newUser", createNewUser);

module.exports = router;
