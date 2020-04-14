const Command = require('../../structures/Command');

module.exports = class Votes extends Command {
	constructor(client) {
		super(client, {
			name: 'votes',
			description: 'Shows # of votes',
			usage: '',
			enabled: true,
			aliases: [],
			cooldown: 5,
			permission: 'dev',
			args: false,
		});
	}
	async run(client, message) {
		client.dbl.getVotes().then(votes => {
			return message.channel.send(`Total votes: ${votes.length}`);
		});
	}
};