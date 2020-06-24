const Command = require('../../structures/Command');

module.exports = class Leave extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			description: 'The bot leaves the voice channel it is currently in.',
			aliases: ['disconnect', 'fuckoff', 'leave', 'dc'],
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
		});
	}
	async run(client, message) {
		const player = client.music.players.get(message.guild.id);

		if(player) {
			player.destroy();
		}
		else {message.member.voice.channel.leave();}

		return message.channel.send(`Left ${client.emojiList.voice}**${message.member.voice.channel.name}**`);
	}
};