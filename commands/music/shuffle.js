module.exports = {
	name: 'shuffle',
	description: 'Shuffles the queue.',
	aliases: ['mix'],
	cooldown: 10,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	playing: true,
	async execute(client, message) {
		const player = client.music.players.get(message.guild.id);

		player.queue.shuffle();
		return message.channel.send('Shuffled the queue...');
	},
};