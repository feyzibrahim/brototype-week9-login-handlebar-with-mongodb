const express = require("express");
const { verifyAuth } = require("../middleware/auth");
const { getUsersList } = require("../controller/adminController");

const router = express.Router();

router.use(verifyAuth);

router.get("/", getUsersList);

module.exports = router;
