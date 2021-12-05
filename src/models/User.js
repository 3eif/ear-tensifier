const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    _id: String,
    bio: { type: String, default: '' },
    songsPlayed: { type: Number, default: 0 },
    commandsUsed: { type: Number, default: 0 },
    blacklisted: { type: Boolean, default: false },
    developer: { type: Boolean, default: false },
});

module.exports = model('User', UserSchema);