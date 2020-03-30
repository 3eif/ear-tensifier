module.exports = {
	name: 'skip',
	description: 'Skips the current song',
	aliases: ['s'],
	inVoiceChannel: true,
	sameVoiceChannel: true,
	playing: true,
	async execute(client, message) {
		const player = client.music.players.get(message.guild.id);

		if(player) player.stop();
		return message.channel.send('Skipped...');
	},
};