const Command = require('../../structures/Command');

module.exports = class Pop extends Command {
	constructor(client) {
		super(client, {
			name: 'pop',
			description: 'Turns on pop filter',
			cooldown: '10',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
			voteLocked: true,
		});
	}
	async run(client, message, args) {
		if (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off')) {
			client.setFilter(client, message, 'pop', false);
		}
		else client.setFilter(client, message, 'pop', true);
	}
};
