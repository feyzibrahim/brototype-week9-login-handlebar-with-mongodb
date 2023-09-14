const { getDb } = require("../db/db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const validator = require("validator");

// Controller function for getting all the users list
const getUsersList = async (req, res) => {
  const db = getDb();
  const roll = "user";

  // getting search query from request
  const searchQuery = req.query.search;

  // If there's a search query, perform a search.
  if (searchQuery) {
    const count = await db.collection("user").countDocuments({
      roll,
      $or: [
        { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive
        { email: { $regex: searchQuery, $options: "i" } }, // Case-insensitive
      ],
    });
    const users = await db
      .collection("user")
      .find({
        roll,
        $or: [
          { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive
          { email: { $regex: searchQuery, $options: "i" } }, // Case-insensitive
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

// Controller function for deleting a user
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

// Controller function for editing one user
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

// Controller function for saving the changes into db of a user
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

// Create use page route
const newUser = (req, res) => {
  res.render("admin/newUser");
};

// User creation and saving to db route
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
