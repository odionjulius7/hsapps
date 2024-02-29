const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "Please provide the featured video of the blog"],
  },
  views: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
