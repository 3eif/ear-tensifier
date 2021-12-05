const { Schema, model } = require('mongoose');
const Track = require('./Track');

const PlaylistSchema = new Schema({
    name: String,
    tracks: [Track],
    thumbnail: { type: String, default: null },
    creator: String,
    createdTimestamp: Number,
});

module.exports = model('NewPlaylist', PlaylistSchema);