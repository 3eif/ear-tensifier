module.exports = {
	name: 'clear',
	description: 'Clears the queue.',
	cooldown: '10',
	inVoiceChannel: true,
	sameVoiceChannel: true,
	playing: true,
	async execute(client, message) {
		const player = client.music.players.get(message.guild.id);

		player.queue.length = 1;
		return message.channel.send('Cleared the queue.');
	},
};