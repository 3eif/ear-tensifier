module.exports = {
	name: 'stop',
	description: 'Stops the queue.',
	cooldown: '10',
	inVoiceChannel: true,
	sameVoiceChannel: true,
	playing: true,
	async execute(client, message) {
		const player = client.music.players.get(message.guild.id);

		if(player) {
			player.queue = [];
			player.stop();
		}
		// eslint-disable-next-line curly
		else message.member.voice.channel.leave();

		return message.channel.send('Stopped the queue.');
	},
};