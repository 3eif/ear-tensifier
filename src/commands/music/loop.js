const Command = require('../../structures/Command');

module.exports = class Loop extends Command {
	constructor(client) {
		super(client, {
			name: 'loop',
			description: 'Repeats the current queue/song',
			aliases: ['repeat', 'unloop'],
			usage: '<queue/song>',
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message, args) {
		const player = client.music.players.get(message.guild.id);

		if (!args[0] || args[0].toLowerCase() == 'song') {
			if (!player.trackRepeat) {
				player.setTrackRepeat(true);
				return message.channel.send('Song is now being looped');
			}
			else {
				player.setTrackRepeat(false);
				return message.channel.send('Song has been unlooped');
			}
		}
		else if (args[0] == 'queue') {
			if (player.queueRepeat) {
				player.setQueueRepeat(false);
				return message.channel.send('Queue has been unlooped.');
			}
			else {
				player.setQueueRepeat(true);
				return message.channel.send('Queue is being looped.');
			}
		}
	}
};
