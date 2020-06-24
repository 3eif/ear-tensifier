const Command = require('../../structures/Command');

module.exports = class Trablebass extends Command {
	constructor(client) {
		super(client, {
			name: 'treblebass',
			description: 'Turns on treblebass filter',
			aliases: ['tb'],
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
			voteLocked: true,
		});
	}
	async run(client, message, args) {
		if (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off')) {
			client.setFilter(client, message, 'treblebass', false);
		}
		else client.setFilter(client, message, 'treblebass', true);
	}
};