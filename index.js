const express = require("express");
const path = require("path");

const db = require("./db/mongodb");
const Post = require("./db/models/postModel");

const app = express();

db();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/subpage", (req, res) => {
  res.render("subpage");
});

app.post("/create-post", async (req, res) => {
  const post = req.body;
  console.log(post);
  const addPost = new Post({
    ...post,
  });
  await addPost.save();
  res.send(200);
});

app.listen(3000, () => {
  console.log("Whateveer");
});
