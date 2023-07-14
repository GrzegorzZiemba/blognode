const express = require("express");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", (req, res) => {
  res.render("main");
});

app.listen(3000, () => {
  console.log("Whatever");
});
