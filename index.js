const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

const db = require("./db/mongodb");
const Post = require("./db/models/postModel");
const User = require("./db/models/userModel");
const csrf = require("csurf");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();
const csrfProtection = csrf({ cookie: true });

db();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.get("/", (req, res) => {
  res.render("main");
});

app.get("/subpage", authenticateToken, (req, res) => {
  console.log(req.user);
  if (req.user) {
    res.render("subpage");
  } else {
    res.redirect("/log");
  }
});

app.get("/log", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
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

app.post("/create-account", async (req, res) => {
  console.log(req.body);
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

app.post("/login", async (req, res) => {
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

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  console.log(token);
  if (token == null) {
    req.user = null;
    next();
  } else {
    console.log("verify");
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
    console.log(decodedToken);
    if (decodedToken) {
      req.user = decodedToken._id;
    } else {
      req.user = null;
    }
    next();
    // , (err, user) => {
    //   if (err) {
    //     req.user = null;
    //   } else {
    //     req.user = user;
    //   }

    //   next();
    // });
  }
}

app.listen(3000, () => {
  console.log("Whateveer");
});
