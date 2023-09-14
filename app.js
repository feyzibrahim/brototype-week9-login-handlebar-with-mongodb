// dotenv is required
require("dotenv").config();

const express = require("express");
const hbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { connectToDB } = require("./db/db");

// Invoking express
const app = express();

// Session and cookie
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 3600000,
    },
  })
);

// middleware for reading body data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View Engine configuration
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout",
    partialsDir: __dirname + "/views/partials",
  })
);

// importing routes
const authRoutes = require("./routes/auth");
const indexRoutes = require("./routes/index");
const blogRoutes = require("./routes/blog");
const adminRoutes = require("./routes/admin");

// Home page Route
app.get("/", indexRoutes);

// Login & Signup Routes
app.use("/auth", authRoutes);

// User Home routes
app.use("/blog", blogRoutes);

// Admin Routes
app.use("/admin", adminRoutes);

app.use((req, res) => {
  res.render("404");
});

connectToDB((err) => {
  if (!err) {
    app.listen(process.env.DEV_PORT, () => {
      console.log("Server started");
    });
  } else {
    console.log(err);
  }
});
