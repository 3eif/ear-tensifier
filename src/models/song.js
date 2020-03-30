const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
	songID: String,
	type: String,
	songName: String,
	songAuthor: String,
	songDuration: Number,
	timesPlayed: Number,
	timesAdded: Number,
	songThumbnail: String,
});

module.exports = mongoose.model('songs', songSchema);