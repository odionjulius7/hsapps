const mongoose = require("mongoose");

const myListSchema = new mongoose.Schema({
  content_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const MyList = mongoose.model("MyList", myListSchema);

module.exports = MyList;
