const { getDb } = require("../db/db");

const getUsersList = async (req, res) => {
  const db = getDb();
  const count = await db.collection("user").countDocuments({ roll: "user" });
  const users = [];
  db.collection("user")
    .find({ roll: "user" })
    .forEach((user) => users.push(user))
    .then(() => {
      res.render("admin/home", {
        isLoggedIn: true,
        count: count,
        users: users,
      });
    })
    .catch((error) => {
      res.render("auth/login", { err: error });
    });
};

module.exports = { getUsersList };
