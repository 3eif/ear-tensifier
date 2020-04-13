const Discord = require('discord.js');
const DBL = require('dblapi.js');
const { post, discordToken } = require('./tokens.json');

class Client extends Discord.Client {
	constructor() {
		super();

		this.commands = new Discord.Collection();
		this.aliases = new Discord.Collection();

		this.settings = require('./settings.js');
		this.responses = require('./utils/responses.js');
		this.filters = require('./resources/filters.json');
		this.colors = require('./resources/colors.json');
		this.emojiList = require('./resources/emojis.json');
		this.errors = require('./utils/errors.js');

		this.dbl = new DBL(post['topGG']['token'], { webhookPort: post['topGG']['port'], webhookAuth: post['topGG']['password'] });
	}

	log(msg) {
		console.log(`[${new Date().toLocaleString()}] > ${msg}`);
	}
}

const client = new Client();

['commands', 'events'].forEach(handler => require(`./utils/handlers/${handler}`)(client));

client.login(discordToken);