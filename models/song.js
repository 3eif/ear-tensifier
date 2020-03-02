const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
  songID: String,
  songName: String,
  songAuthor: String,
  songDuration: Number,
  timesPlayed: Number, 
  timesAdded: Number,
});

module.exports = mongoose.model("songs", songSchema);