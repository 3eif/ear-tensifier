const Command = require('../../structures/Command');

module.exports = class Nightcore extends Command {
	constructor(client) {
		super(client, {
			name: 'nightcore',
			description: 'Turns on nightcore filter',
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
			permission: 'pro',
		});
	}
	async run(client, message, args) {
		if (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off')) {
			client.setFilter(client, message, 'nightcore', false);
		}
		else client.setFilter(client, message, 'nightcore', true);
	}
};