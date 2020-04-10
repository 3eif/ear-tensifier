const Command = require('../../structures/Command');

const { Utils } = require('erela.js');

module.exports = class Seek extends Command {
	constructor(client) {
		super(client, {
			name: 'seek',
			description: 'Skips to a timestamp in the song.',
			cooldown: '10',
			args: true,
			usage: '<seconds>',
			aliases: ['skipto'],
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message, args) {
		if(isNaN(args[0])) return message.reply(`Invalid number. Please provide a number in seconds.\nCorrect Usage: \`${client.settings.prefix}seek <seconds>\``);

		const player = client.music.players.get(message.guild.id);
		if(args[0] * 1000 >= player.queue[0].duration || args[0] < 0) return message.channel.send('Cannot seek beyond length of song.');
		player.seek(args[0] * 1000);

		return message.channel.send(`Seeked to ${Utils.formatTime(player.position, true)}`);
	}
};