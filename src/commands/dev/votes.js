const Command = require('../../structures/Command');

const getVotes = require('../../utils/votes/getVotes.js');

module.exports = class Votes extends Command {
	constructor(client) {
		super(client, {
			name: 'vote',
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
		message.channel.send(await getVotes(client));
	}
};