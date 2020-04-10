const Command = require('../../structures/Command');

module.exports = class Donate extends Command {
	constructor(client) {
		super(client, {
			name: 'donate',
			description: 'Sends a link to Ear Tensifier\'s patreon page.',
			aliases: ['patreon'],
		});
	}
	async run(client, message) {
		return message.channel.send('Donate: https://www.patreon.com/eartensifier');
	}
};