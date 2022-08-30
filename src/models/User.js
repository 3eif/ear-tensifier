const { Schema, model } = require('mongoose');
const Track = require('./Track');

const UserSchema = new Schema({
    _id: String,
    bio: { type: String, default: '' },
    songsPlayed: { type: Number, default: 0 },
    commandsUsed: { type: Number, default: 0 },
    blacklisted: { type: Boolean, default: false },
    developer: { type: Boolean, default: false },
    lastPlayedSongs: { type: [Track], default: [] },
});

module.exports = model('User', UserSchema);