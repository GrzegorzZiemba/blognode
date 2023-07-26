const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const csrf = require("csurf");

const db = require("./db/mongodb");
const isAuth = require("./middleware/isAuth");

require("dotenv").config();

const app = express();
const csrfProtection = csrf({ cookie: true });

db();

app.set("view engine", "ejs");
app.set("views", "views");

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(csrfProtection);
app.use(isAuth.authenticateToken, (req, res, next) => {
  res.locals.isAuth = req.user;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use(postRoutes);
app.use(userRoutes);

app.get("/subpage", isAuth.authenticateToken, (req, res) => {
  if (req.user) {
    res.render("subpage");
  } else {
    res.redirect("/login");
  }
});

app.listen(3000, () => {
  console.log("Server is running");
});
