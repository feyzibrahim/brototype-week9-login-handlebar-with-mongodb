const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", hbs);
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout",
    partialsDir: __dirname + "/views/partials",
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/form.html");
});

app.post("/login", (req, res) => {
  let { name, email } = req.body;

  if (name === "Ajwa" && email === "ajwa@gmail.com") {
    res.sendFile(__dirname + "/views/home.html");
  } else {
    res.send("User details not valid");
  }
});

app.use((req, res) => {
  res.sendFile(__dirname + "/views/404.html");
});

app.listen(4000, () => {
  console.log("Server Started");
});
