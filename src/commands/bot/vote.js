const Command = require('../../structures/Command');

module.exports = class Vote extends Command {
	constructor(client) {
		super(client, {
			name: 'vote',
			description: 'Vote link.',
		});
	}
	async run(client, message) {
		return message.channel.send('https://discordbotlist.com/bots/ear-tensifier/upvote');
	}
};