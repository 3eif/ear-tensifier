const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    bio: String,
    songsPlayed: Number,
    commandsUsed: Number,
    blacklisted: Boolean,
    isDeveloper: Boolean,
});

module.exports = mongoose.model('NewUser', userSchema);