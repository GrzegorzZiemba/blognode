const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

const db = require("./db/mongodb");
const Post = require("./db/models/postModel");
const User = require("./db/models/userModel");
const csrf = require("csurf");

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

app.get("/subpage", (req, res) => {
  res.render("subpage");
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
      res.send(200);
    }
  } catch (e) {
    res.send(404);
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    console.log(req.body.email);
    const user = await User.loginUser(req.body.email, req.body.password);
    console.log(user + " xxxxx ");
    const token = await user.generateAuthTokens();

    const mail = user.email;
    const id = user._id.toString();
    console.log(token);
    console.log(mail);
    res.status(200).send({ mail, token, id });
  } catch (e) {
    res.status(400).send({ error: "Cannot Login" });
  }
});

app.listen(3000, () => {
  console.log("Whateveer");
});
