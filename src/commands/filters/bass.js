const Command = require('../../structures/Command');

module.exports = class Bass extends Command {
	constructor(client) {
		super(client, {
			name: 'bass',
			description: 'Turns on bass filter',
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message, args) {
		if (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off')) {
			client.setFilter(client, message, 'bass', false);
		}
		else client.setFilter(client, message, 'bass', true);
	}
};