const express = require("express");
const hbs = require("express-handlebars");

// Invoking express
const app = express();

// importing routes
const authRoutes = require("./routes/auth");

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

// Home page rendering
app.get("/", (req, res) => {
  res.render("index", { title: "Something" });
});

// Login & Signup Routes
app.use("/auth", authRoutes);

app.use((req, res) => {
  res.render("404");
});

app.listen(4000, () => {
  console.log("Server Started");
});
