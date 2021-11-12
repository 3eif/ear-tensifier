const { Schema, model } = require('mongoose');

const SongSchema = Schema({
    _id: String,
    title: String,
    id: String,
    author: String,
    duration: Number,
    thumbnail: String,
    platform: String,
    timesPlayed: { type: Number, default: 0 },
});

module.exports = model('NewSong', SongSchema);