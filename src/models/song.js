const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
    _id: String,
    title: String,
    id: String,
    author: String,
    duration: Number,
    thumbnail: String,
    platform: String,
    timesPlayed: Number,
    timesAdded: Number,
});

module.exports = mongoose.model('NewSong', songSchema);