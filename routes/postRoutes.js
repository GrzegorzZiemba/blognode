const express = require("express");
const isAuth = require("../middleware/isAuth");
const Post = require("../db/models/postModel");
const User = require("../db/models/userModel");

const router = express.Router();

router.get("/create-post", isAuth.authenticateToken, async (req, res) => {
  if (req.user) {
    const currentUser = await User.findById({ _id: req.user });
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
    const addPost = new Post({
      ...post,
      date,
    });
    await addPost.save();
    res.redirect("/");
  } catch (e) {
    res.send(400);
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.render("showPosts", {
      posts,
    });
  } catch (e) {
    throw new Error(e);
  }
});

router.post("/post-delete", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.body.postId);
    res.redirect("/");
  } catch (e) {
    throw new Error(e);
  }
});

router.get("/post/:postId", async (req, res) => {
  const postId = req.params.postId;
  await Post.findById(postId)
    .then((post) => {
      res.render("post-detail", {
        post: post,
        pageTitle: post.title,
        path: "/post",
      });
    })

    .catch((e) => {
      throw new Error(e);
    });
});

router.post("/post-update", async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    await post.updateOne({
      title: req.body.title || post.title,
      description: req.body.description || post.description,
    });
    res.redirect("/");
  } catch (e) {
    throw new Error(e);
  }
});

module.exports = router;
