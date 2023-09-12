const express = require("express");
const hbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// Invoking express
const app = express();

// Session and cookie
app.use(cookieParser());
app.use(
  session({
    secret: "Hello World",
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 3600000,
    },
  })
);

// middleware for reading body data
app.use(express.urlencoded({ extended: true }));

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

// Home page Route
app.get("/", indexRoutes);

// Login & Signup Routes
app.use("/auth", authRoutes);

app.use("/blog", blogRoutes);

app.use((req, res) => {
  res.render("404");
});

app.listen(4000, () => {
  console.log("Server Started");
});
