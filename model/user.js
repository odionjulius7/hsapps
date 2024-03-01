const mongoose = require("mongoose");
const argon2 = require("argon2");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  userId: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  image: {
    type: String,
  },

  myList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  // password: {
  //   type: String,
  //   select: false,
  // },
  // code: {
  //   type: String,
  //   select: false,
  // },
  // status: {
  //   type: Boolean,
  //   default: false,
  // },
  // googleId: {
  //   type: String,
  // },
});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await argon2.hash(this.password);
//   next();
// });

// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword
// ) {
//   return await argon2.verify(candidatePassword, userPassword);
// };

const User = mongoose.model("User", userSchema);

module.exports = User;
