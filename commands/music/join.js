module.exports = {
	name: 'join',
	description: 'Joins the voice channel you are in.',
	aliases: ['summon'],
	async execute(client, message) {
		const voiceChannel = message.member.voice.channel;
		if(!voiceChannel) return client.responses('noVoiceChannel', message);

		const permissions = voiceChannel.permissionsFor(client.user);
		if(!permissions.has('CONNECT')) return client.responses('noPermissionConnect', message);

		voiceChannel.join();
		// eslint-disable-next-line no-unused-vars
		const player = client.music.players.spawn({
			guild: message.guild,
			textChannel: message.channel,
			voiceChannel: voiceChannel,
		});
		return message.channel.send(`Joined ${client.emojiList.voice}**${voiceChannel.name}**`);
	},
};