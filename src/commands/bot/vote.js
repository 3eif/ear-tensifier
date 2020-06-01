const Command = require('../../structures/Command');

module.exports = class Vote extends Command {
	constructor(client) {
		super(client, {
			name: 'vote',
			description: 'Vote link.',
		});
	}
	async run(client, message) {
		return message.channel.send('https://botlist.space/bot/472714545723342848/upvote');
	}
};