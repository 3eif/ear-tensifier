module.exports = {
	name: 'leave',
	description: 'The bot leaves the voice channel it is currently in.',
	aliases: ['disconnect', 'fuckoff', 'leave', 'dc'],
	cooldown: '10',
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(client, message) {
		const player = client.music.players.get(message.guild.id);

		message.member.voice.channel.leave();
		if(player) {
			// player.stop();
			// player.queue = [];
		}

		return message.channel.send(`Left ${client.emojiList.voice}**${message.member.voice.channel.name}**`);
	},
};
