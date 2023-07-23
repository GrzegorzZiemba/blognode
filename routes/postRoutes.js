const express = require("express");
const isAuth = require("../middleware/isAuth");
const Post = require("../db/models/postModel");
const User = require("../db/models/userModel");

const router = express.Router();

router.get("/create-post", isAuth.authenticateToken, async (req, res) => {
  if (req.user) {
    const currentUser = await User.findById({ _id: req.user });
    console.log(currentUser);
    res.render("createPost", {
      user: currentUser.name,
      id: currentUser._id,
    });
  } else {
    res.redirect("/");
  }
});

router.post("/create-post", async (req, res) => {
  try {
    const date = new Date();
    const post = req.body;
    console.log(post.author);
    console.log(post.description);
    console.log(post.title);
    console.log(date);
    const addPost = new Post({
      // title: post.title,
      // description: post.description,
      // author: post.author,
      ...post,
      date,
    });
    await addPost.save();
    res.redirect("/");
  } catch (e) {
    res.send(400);
  }
});

router.get("/", isAuth.authenticateToken, async (req, res) => {
  try {
    let current = "";
    if (req.user) {
      const currentUser = await User.findById({ _id: req.user });
      current = currentUser._id;
    }
    console.log(current + "-----");

    const posts = await Post.find();
    console.log(posts);
    res.render("showPosts", {
      posts,
      user: current,
    });
  } catch (e) {
    console.log("somethinggowrong");
  }
});

router.post("/post-delete", async (req, res) => {
  try {
    const result = await Post.findByIdAndDelete(req.body.postId);
    console.log("Deleted course: ", result);
    console.log("DEleted");
    res.redirect("/");
  } catch (e) {
    console.log("err");
  }
});

module.exports = router;
