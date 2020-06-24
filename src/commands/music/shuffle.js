const Command = require('../../structures/Command');

module.exports = class Shuffle extends Command {
	constructor(client) {
		super(client, {
			name: 'shuffle',
			description: 'Shuffles the queue.',
			aliases: ['mix'],
			cooldown: 4,
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message) {
		const player = client.music.players.get(message.guild.id);

		player.queue.shuffle();
		return message.channel.send('Shuffled the queue...');
	}
};