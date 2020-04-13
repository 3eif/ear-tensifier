const Command = require('../../structures/Command');

module.exports = class Join extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			description: 'Joins the voice channel you are in.',
			aliases: ['summon'],
		});
	}
	async run(client, message) {
		const voiceChannel = message.member.voice;
		if (!voiceChannel) return client.responses('noVoiceChannel', message);

		const permissions = voiceChannel.channel.permissionsFor(client.user);
		if (!permissions.has('CONNECT')) return client.responses('noPermissionConnect', message);

		if (!client.music.players.get(message.guild.id)) {
			client.music.players.spawn({
				guild: message.guild,
				textChannel: message.channel,
				voiceChannel: message.member.voice.channel,
			});
		}
		else {
			message.member.voice.channel.join();
		}

		if (permissions.has('DEAFEN_MEMBERS') || permissions.has('ADMINISTRATOR')) message.guild.members.cache.get(client.user.id).voice.setDeaf(true);

		return message.channel.send(`Joined ${client.emojiList.voice}**${message.member.voice.channel.name}**`);
	}
};