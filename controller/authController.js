const validator = require("validator");
const bcrypt = require("bcrypt");
const { getDb } = require("../db/db");

// Retrieving login page
const getLoginPage = (req, res) => {
  if (!req.session.isAuth) {
    res.render("auth/login", { isLoggedIn: false, err: "" });
  } else {
    res.redirect("/");
  }
};

// Handling Login Form Submission
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw "All fields are required...";
    }

    const db = getDb();
    const user = await db.collection("user").findOne({ email: username });

    if (!user) {
      throw "User is not registered";
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw "Wrong password";
    }

    req.session.username = user.email;
    req.session.isAuth = true;
    req.session.roll = user.roll;

    res.redirect("/");
  } catch (error) {
    res.render("auth/login", { err: error });
  }
};

// Retrieving Signup Page
const getSignupPage = (req, res) => {
  if (!req.session.isAuth) {
    res.render("auth/signup", { err: "", isLoggedIn: false });
  } else {
    res.redirect("/");
  }
};

const signupUser = async (req, res) => {
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
        // Setting session for route
        req.session.username = email;
        req.session.isAuth = true;
        req.session.roll = "user";

        // Redirecting to home
        res.redirect("/");
      })
      .catch((error) => {
        res.render("auth/signup", { err: error });
      });
  } catch (error) {
    res.render("auth/signup", { err: error });
  }
};

// Handling logout and destroying the session
const logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

module.exports = {
  getLoginPage,
  loginUser,
  getSignupPage,
  signupUser,
  logoutUser,
};
