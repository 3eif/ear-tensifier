module.exports = {
	name: 'stop',
	description: 'Stops the queue.',
	cooldown: '10',
	async execute(client, message) {
		const player = client.music.players.get(message.guild.id);

		if(!message.member.voice.channel) return client.responses('noVoiceChannel', message);
		if(message.member.voice.channel.id != message.guild.members.cache.get(client.user.id).voice.id) return client.responses('sameVoiceChannel', message);

		if(player) {
			player.queue = [];
			player.stop();
		}
		// eslint-disable-next-line curly
		else message.member.voice.channel.leave();

		return message.channel.send('Stopped the queue.');
	},
};