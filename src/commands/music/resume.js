const Command = require('../../structures/Command');

module.exports = class Pause extends Command {
	constructor(client) {
		super(client, {
			name: 'resume',
			description: 'Resumes the song',
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message) {
		const player = client.music.players.get(message.guild.id);

		player.pause(player.playing);
		return message.channel.send(`Song is now **${player.playing ? 'resumed' : 'paused'}.**`);
	}
};