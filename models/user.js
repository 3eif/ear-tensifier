const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	authorID: String,
	authorName: String,
	bio: String,
	songsPlayed: Number,
	commandsUsed: Number,
	blocked: Boolean,
	premium: Boolean,
	pro: Boolean,
	developer: Boolean,
	favorites: Array,
});

module.exports = mongoose.model('users', userSchema);