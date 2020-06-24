const Command = require('../../structures/Command');


const rewindNum = 10;

module.exports = class Rewind extends Command {
	constructor(client) {
		super(client, {
			name: 'rewind',
			description: 'Rewinds a song (default 10 seconds).',
			cooldown: '4',
			usage: '<seconds>',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message, args) {
		const player = client.music.players.get(message.guild.id);

		const parsedDuration = client.formatDuration(player.position);
		if(args[0] && !isNaN(args[0])) {
			if((player.position - args[0] * 1000) > 0) {
				player.seek(player.position - args[0] * 1000);
				return message.channel.send(`Rewinding to ${parsedDuration}`);
			}
			else {return message.channel.send('Cannot rewind beyond 00:00.');}
		}
		else if(args[0] && isNaN(args[0])) {return message.reply(`Invalid argument, must be a number.\nCorrect Usage: \`${client.settings.prefix}forward <seconds>\``);}

		if(!args[0]) {
			if((player.position - rewindNum * 1000) > 0) {
				player.seek(player.position - rewindNum * 1000);
				return message.channel.send(`Rewinding to ${parsedDuration}`);
			}
			else {
				return message.channel.send('Cannot rewind beyond 00:00.');
			}
		}
	}
};