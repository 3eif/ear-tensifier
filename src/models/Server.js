const { Schema, model } = require('mongoose');

const ServerSchema = Schema({
    _id: String,
    prefix: { type: String, default: process.env.PREFIX },
    ignoredChannels: { type: Array, default: [] },
    defaults: { volume: { type: Number, default: 100 } },
    nowPlayingMessages: { type: Boolean, default: true },
});

module.exports = model('Server', ServerSchema);