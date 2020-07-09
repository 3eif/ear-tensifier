const Command = require('../../structures/Command');

const spawnPlayer = require('../../player/spawnPlayer.js');

module.exports = class Join extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			description: 'Joins the voice channel you are in.',
			aliases: ['summon'],
			botPermissions: ['CONNECT'],
		});
	}
	async run(client, message) {
		const voiceChannel = message.member.voice;
		if (!voiceChannel) return client.responses('noVoiceChannel', message);

		await spawnPlayer(client, message);

		return message.channel.send(`Joined ${client.emojiList.voice}**${message.member.voice.channel.name}**`);
	}
};