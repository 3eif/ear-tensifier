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
	voted: Boolean,
});

module.exports = mongoose.model('users', userSchema);