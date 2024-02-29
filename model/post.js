const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  details: {
    type: String,
  },
  image: {
    type: String,
    // required: [true, "Please provide the image"],
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  },
  thumbnail: {
    type: String,
  },
  description: {
    type: String,
  },
  duration: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostCat",
  },
  day: {
    type: Number,
    default: 0, // Provide a default value if needed
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  // link: {
  //   type: String,
  // },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
