const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  authorID: String,
  userName: String,
  bio: String,
  songsPlayed: Number, 
  commandsUsed: Number,
  blocked: Boolean,
  supporter: Boolean,
  mod: Boolean,
  developer: Boolean,
});

module.exports = mongoose.model("users", userSchema);