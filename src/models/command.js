const mongoose = require('mongoose');

const commandSchema = mongoose.Schema({
    commandName: String,
    timesUsed: Number,
});

module.exports = mongoose.model('Command', commandSchema);