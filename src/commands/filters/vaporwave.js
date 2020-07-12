const Command = require('../../structures/Command');

module.exports = class Vaporwave extends Command {
	constructor(client) {
		super(client, {
			name: 'vaporwave',
			description: 'Turns on vaporwave filter',
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
			permission: 'premium',
		});
	}
	async run(client, message, args) {
		return message.channel.send('This command is currently disabled due to performance issues. Please consider donating to help upgrade our server: https://www.patreon.com/eartensifier');
		if (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off')) {
			client.setFilter(client, message, 'vaporwave', false);
		}
		else client.setFilter(client, message, 'vaporwave', true);
	}
};