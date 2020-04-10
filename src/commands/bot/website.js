const Command = require('../../structures/Command');

module.exports = class Website extends Command {
	constructor(client) {
		super(client, {
			name: 'website',
			description: 'Website of the bot',
			usage: '',
			enabled: true,
			aliases: [],
			cooldown: 5,
			args: false,
		});
	}
	async run(client, message) {
		message.channel.send('https://eartensifier.net/');
	}
};