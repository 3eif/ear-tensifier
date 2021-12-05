const { Schema, model } = require('mongoose');

const CommandSchema = new Schema({
	_id: String,
	timesUsed: { type: Number, default: 0 },
});

const BotSchema = new Schema({
	_id: String,
	username: String,
	commands: { type: [CommandSchema], default: [] },
	commandsUsed: { type: Number, default: 0 },
	songsPlayed: { type: Number, default: 0 },
	lastPosted: { type: Number, default: undefined },
});

module.exports = model('Bot', BotSchema);