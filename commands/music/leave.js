module.exports = {
	name: 'leave',
	description: 'The bot leaves the voice channel it is currently in.',
	aliases: ['disconnect', 'fuckoff', 'leave', 'dc'],
	cooldown: '10',
	async execute(client, message) {
		if(message.guild.me.voice.channel == null) return client.responses('botVoiceChannel', message);
		const voiceChannel = message.member.voice.channel;
		const player = client.music.players.get(message.guild.id);

		if(!voiceChannel) return client.responses('noVoiceChannel', message);
		if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

		if(player) {
			player.queue = [];
			player.stop();
		}
		// eslint-disable-next-line curly
		else message.member.voice.channel.leave();

		return message.channel.send(`Left ${client.emojiList.voice}**${voiceChannel.name}**`);
	},
};