const { Schema, model } = require('mongoose');
const { prefix } = require('../../config.json');

const ServerSchema = Schema({
    _id: String,
    prefix: { type: String, default: prefix },
    ignoredChannels: { type: Array, default: [] },
    defaults: { volume: { type: Number, default: 100 } },
    nowPlayingMessages: { type: Boolean, default: true },
});

module.exports = model('Server', ServerSchema);