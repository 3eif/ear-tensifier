const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
  songID: String,
  songName: String,
  songAuthor: String,
  timesPlayed: Number, 
  timesAdded: Number,
});

module.exports = mongoose.model("songs", songSchema);