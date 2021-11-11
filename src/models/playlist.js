const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
    name: String,
    songs: Array,
    thumbnail: String,
    creator: String,
    createdTimestamp: Number,
});

module.exports = mongoose.model('NewPlaylist', playlistSchema);