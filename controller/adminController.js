const { getDb } = require("../db/db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const validator = require("validator");

const getUsersList = async (req, res) => {
  const db = getDb();
  const roll = "user"; // You can change this to match your user role criteria.

  // Check if a search query parameter exists in the request.
  const searchQuery = req.query.search;

  if (searchQuery) {
    // If there's a search query, perform a search.
    const count = await db.collection("user").countDocuments({
      roll,
      $or: [
        { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on name
        { email: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on email
      ],
    });
    const users = await db
      .collection("user")
      .find({
        roll,
        $or: [
          { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on name
          { email: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on email
        ],
      })
      .toArray();

    res.render("admin/home", {
      isLoggedIn: true,
      count: count,
      users: users,
    });
  } else {
    // If no search query, return all data.
    const count = await db.collection("user").countDocuments({ roll });
    const users = await db.collection("user").find({ roll }).toArray();

    res.render("admin/home", {
      isLoggedIn: true,
      count: count,
      users: users,
    });
  }
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  const db = getDb();
  db.collection("user")
    .deleteOne({ _id: new ObjectId(id) })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

const editUser = async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const user = await db.collection("user").findOne({ _id: new ObjectId(id) });

  if (user) {
    res.render("admin/edit", { user: user, isLoggedIn: true, err: "" });
  } else {
    res.redirect("/");
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const body = req.body;

  if (body.password !== "") {
    const salt = 10;
    const hash = await bcrypt.hash(body.password, salt);

    body.password = hash;
  } else {
    delete body.password;
  }

  const update = await db.collection("user").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: body,
    }
  );
  console.log(update);
  res.redirect("/");
};

const newUser = (req, res) => {
  res.render("admin/newUser");
};

const createNewUser = async (req, res) => {
  try {
    const { name, email, password, passwordA } = req.body;

    // Form Validation
    if (!name || !email || !password || !passwordA) {
      throw "All fields are required...";
    }

    if (!validator.isEmail(email)) {
      throw "Email is Not Valid...";
    }

    if (password !== passwordA) {
      throw "Password doesn't Match...";
    }

    if (!validator.isStrongPassword(password)) {
      throw "Password is Not Strong";
    }

    const db = getDb();

    // Checking for duplicate email in db
    const exists = await db.collection("user").findOne({ email });

    if (exists) {
      throw "Email Already Used...";
    }

    // Encryption
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);

    // Saving to DB
    db.collection("user")
      .insertOne({
        name: name,
        email: email,
        password: hash,
        date: Date.now(),
        roll: "user",
      })
      .then(() => {
        // Redirecting to home
        res.redirect("/");
      })
      .catch((error) => {
        res.render("admin/newUser", { err: error });
      });
  } catch (error) {
    res.render("admin/newUser", { err: error });
  }
};

module.exports = {
  getUsersList,
  deleteUser,
  editUser,
  updateUser,
  newUser,
  createNewUser,
};
