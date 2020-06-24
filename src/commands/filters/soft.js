const Command = require('../../structures/Command');

module.exports = class Soft extends Command {
	constructor(client) {
		super(client, {
			name: 'soft',
			description: 'Turns on soft filter',
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			voteLocked: true,
		});
	}
	async run(client, message, args) {
		if (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off')) {
			client.setFilter(client, message, 'soft', false);
		}
		else client.setFilter(client, message, 'soft', true);
	}
};