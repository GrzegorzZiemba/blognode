const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const post = new Schema({
  title: { type: String },
  description: { type: String },
  date: { type: Date },
  auther: { type: String },
});

const Post = mongoose.model("Post", post);

module.exports = Post;
