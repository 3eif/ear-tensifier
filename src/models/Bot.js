const { Schema, model } = require('mongoose');

const CommandSchema = new Schema({
	_id: String,
	timesUsed: { type: Number, default: 0 },
});

const WebsiteData = new Schema({
	guilds: { type: Number, default: 0 },
	users: { type: Number, default: 0 },
	players: { type: Number, default: 0 },
});

const BotSchema = new Schema({
	_id: String,
	username: String,
	commands: { type: [CommandSchema], default: [] },
	commandsUsed: { type: Number, default: 0 },
	songsPlayed: { type: Number, default: 0 },
	lastPosted: { type: Number, default: undefined },
	websiteData: { type: WebsiteData },
});

module.exports = model('Bot', BotSchema);