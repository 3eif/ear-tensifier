const { Utils } = require('erela.js');
const rewindNum = 10;

module.exports = {
	name: 'rewind',
	description: 'Rewinds a song (default 10 seconds).',
	cooldown: '10',
	usage: '<seconds>',
	inVoiceChannel: true,
	sameVoiceChannel: true,
	playing: true,
	async execute(client, message, args) {
		const player = client.music.players.get(message.guild.id);

		if(args[0] && !isNaN(args[0])) {
			if((player.position - args[0] * 1000) > 0) {
				player.seek(player.position - args[0] * 1000);
				return message.channel.send(`Rewinding to ${Utils.formatTime(player.position, true)}`);
			}
			else {return message.channel.send('Cannot rewind beyond 00:00.');}
		}
		else if(args[0] && isNaN(args[0])) {return message.reply(`Invalid argument, must be a number.\nCorrect Usage: \`${client.settings.prefix}forward <seconds>\``);}

		if(!args[0]) {
			if((player.position - rewindNum * 1000) > 0) {
				player.seek(player.position - rewindNum * 1000);
				return message.channel.send(`Rewinding to ${Utils.formatTime(player.position, true)}`);
			}
			else {
				return message.channel.send('Cannot rewind beyond 00:00.');
			}
		}
	},
};