const { Utils } = require('erela.js');
const fastForwardNum = 10;

module.exports = {
	name: 'forward',
	description: 'Fast forwards a song (default 10 seconds).',
	cooldown: '10',
	usage: '<seconds>',
	aliases: ['ff', 'fastforward'],
	inVoiceChannel: true,
	sameVoiceChannel: true,
	playing: true,
	async execute(client, message, args) {
		const player = client.music.players.get(message.guild.id);

		if(args[0] && !isNaN(args[0])) {
			if((player.position + args[0] * 1000) < player.queue[0].duration) {
				player.seek(player.position + args[0] * 1000);
				return message.channel.send(`Fast-forwarded to ${Utils.formatTime(player.position, true)}`);
			}
			else {return message.channel.send('Cannot forward beyond the song\'s duration.');}
		}
		else if(args[0] && isNaN(args[0])) {return message.reply(`Invalid argument, must be a number.\nCorrect Usage: \`${client.settings.prefix}forward <seconds>\``);}

		if(!args[0]) {
			if((player.position + fastForwardNum * 1000) < player.queue[0].duration) {
				player.seek(player.position + fastForwardNum * 1000);
				return message.channel.send(`Fast-forwarded to ${Utils.formatTime(player.position, true)}`);
			}
			else {
				return message.channel.send('Cannot forward beyond the song\'s duration.');
			}
		}
	},
};