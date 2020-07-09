const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	authorID: String,
	bio: String,
	songsPlayed: Number,
	commandsUsed: Number,
	blocked: Boolean,
	premium: Boolean,
	pro: Boolean,
	developer: Boolean,
	moderator: Boolean,
	voted: Boolean,
	votedTimes: Number,
	votedConst: Boolean,
	lastVoted: String,
});

module.exports = mongoose.model('users', userSchema);