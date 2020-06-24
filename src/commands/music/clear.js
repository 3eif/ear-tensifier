const Command = require('../../structures/Command');

module.exports = class Clear extends Command {
	constructor(client) {
		super(client, {
			name: 'clear',
			description: 'Clears the queue.',
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message) {
		const player = client.music.players.get(message.guild.id);

		player.queue.length = [];
		return message.channel.send('Cleared the queue.');
	}
};