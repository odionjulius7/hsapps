const mongoose = require("mongoose");

const postCatSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  // link: {
  //   type: String,
  // },
});

const Post = mongoose.model("PostCat", postCatSchema);

module.exports = PostCat;
