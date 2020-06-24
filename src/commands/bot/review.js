const Command = require('../../structures/Command');

module.exports = class Review extends Command {
	constructor(client) {
		super(client, {
			name: 'review',
			description: 'Review link.',
		});
	}
	async run(client, message) {
		return message.channel.send('https://bots.ondiscord.xyz/bots/472714545723342848/review');
	}
};