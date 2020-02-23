const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  authorID: String,
  authorName: String,
  bio: String,
  songsPlayed: Number, 
  commandsUsed: Number,
  blocked: Boolean,
  supporter: Boolean,
  supporterPlus: Boolean,
  supporterPlusPlus: Boolean,
  supporterInfinite: Boolean,
  developer: Boolean,
});

module.exports = mongoose.model("users", userSchema);