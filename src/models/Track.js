const { Schema } = require('mongoose');

const TrackSchema = Schema({
    _id: String,
    title: String,
    url: String,
    author: String,
    duration: Number,
    thumbnail: String,
    platform: String,
    playable: Boolean,
});

module.exports = TrackSchema;