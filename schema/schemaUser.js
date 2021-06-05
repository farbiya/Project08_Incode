const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

var userSchema = mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  hash_password: {
    type: string,
  },
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hash_password);
};

module.exports = mongoose.model("User", userSchema);
