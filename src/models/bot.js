const mongoose = require('mongoose');

const botSchema = mongoose.Schema({
	clientID: Number,
	clientName: String,
	commandsUsed: Number,
	songsPlayed: Number,
	lastPosted: Number,
});

module.exports = mongoose.model('bot', botSchema);