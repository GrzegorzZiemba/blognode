const express = require("express");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/subpage", (req, res) => {
  res.render("subpage");
});

app.listen(3000, () => {
  console.log("Whatever");
});
