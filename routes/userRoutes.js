const express = require("express");
const router = express.Router();
const User = require("../db/models/userModel");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/create-account", (req, res) => {
  res.render("signup");
});

router.post("/create-account", async (req, res) => {
  try {
    const user = req.body;
    const userExists = await User.find({ email: user.email });
    if (userExists.length === 0) {
      const account = new User({
        name: user.name,
        email: user.email,
        password: user.password,
      });
      await account.generateAuthTokens();
      await account.save();
      res.redirect("/");
    }
  } catch (e) {
    res.send(404);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.loginUser(req.body.email, req.body.password);
    console.log(user + " xxxxx ");
    const token = await user.generateAuthTokens();
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  } catch (e) {
    res.status(400).send({ error: "Cannot Login" });
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
