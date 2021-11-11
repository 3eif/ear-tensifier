const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
    prefix: String,
    ignoredChannels: Array,
    defaultVolume: Number,
    nowPlayingMessages: Boolean,
});

module.exports = mongoose.model('NewServer', serverSchema);