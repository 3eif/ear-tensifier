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
	favorites: Array,
	autoplay: Array,
	voted: Boolean,
	timesVoted: Number,
	votedConst: Boolean,
	lastVoted: String,
});

module.exports = mongoose.model('users', userSchema);