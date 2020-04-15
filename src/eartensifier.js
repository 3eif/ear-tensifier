const Discord = require('discord.js');
const Sentry = require('@sentry/node');
const DBL = require('dblapi.js');

class Client extends Discord.Client {
	constructor() {
		super();

		this.commands = new Discord.Collection();
		this.aliases = new Discord.Collection();

		this.settings = require('../config/settings.js');
		this.channelList = require('../config/channels.js');
		this.filters = require('../config/filters.js');
		this.colors = require('../config/colors.js');
		this.emojiList = require('../config/emojis.js');

		this.shardMessage = require('./utils/shardMessage.js');
		this.responses = require('./utils/responses.js');
		this.errors = require('./utils/errors.js');

		this.environment = process.env.NODE_ENV;
		this.dbl = new DBL(process.env.TOPGG_TOKEN, this);
	}

	log(msg) {
		console.log(`[${new Date().toLocaleString()}] > ${msg}`);
	}
}

const client = new Client();

Sentry.init({
	dsn: process.env.SENTRY_URL,
	environment: process.env.SENTRY_ENVIRONMENT,
});

['commands', 'events'].forEach(handler => require(`./handlers/${handler}`)(client));

if (client.environment == 'production') client.login(process.env.DISCORD_TOKEN);
else client.login(process.env.DISCORD_TESTING_TOKEN);