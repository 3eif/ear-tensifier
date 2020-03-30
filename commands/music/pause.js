module.exports = {
	name: 'pause',
	description: 'Pauses the song',
	cooldown: '5',
	aliases: ['resume'],
	inVoiceChannel: true,
	sameVoiceChannel: true,
	playing: true,
	async execute(client, message) {
		const player = client.music.players.get(message.guild.id);

		player.pause(player.playing);
		return message.channel.send(`Song is now **${player.playing ? 'resumed' : 'paused'}.**`);
	},
};