const mongoose = require('mongoose');

const botSchema = mongoose.Schema({
	clientID: Number,
	clientName: String,
	messagesSent: Number,
	songsPlayed: Number,
});

module.exports = mongoose.model('bot', botSchema);