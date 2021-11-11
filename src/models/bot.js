const mongoose = require('mongoose');

const botSchema = mongoose.Schema({
	_id: String,
	username: String,
	commandsUsed: Number,
	songsPlayed: Number,
	lastPosted: Number,
});

module.exports = mongoose.model('NewBot', botSchema);