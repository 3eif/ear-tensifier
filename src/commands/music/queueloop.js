module.exports = {
	name: 'queueloop',
	description: 'Loops the queue',
	cooldown: '10',
	aliases: ['loopqueue', 'repeatqueue', 'queuerepeat'],
	inVoiceChannel: true,
	sameVoiceChannel: true,
	playing: true,
	async execute(client, message) {
		const player = client.music.players.get(message.guild.id);

		if(player.queueRepeat === true) {
			player.setQueueRepeat(false);
			return message.channel.send('Queue has been unlooped.');
		}
		else {
			player.setQueueRepeat(true);
			return message.channel.send('Queue is being looped.');
		}
	},
};