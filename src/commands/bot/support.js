const Command = require('../../structures/Command');

module.exports = class Support extends Command {
	constructor(client) {
		super(client, {
			name: 'support',
			description: 'Sends the support server for the bot.',
			aliases: ['server'],
			usage: '',
			enabled: true,
			cooldown: 5,
			args: false,
		});
	}
	async run(client, message) {
		return message.channel.send(`Here is my support server: ${client.settings.server}`);
	}
};