const { Utils } = require('erela.js');

module.exports = {
	name: 'seek',
	description: 'Skips to a timestamp in the song.',
	cooldown: '10',
	args: true,
	usage: '<seconds>',
	aliases: ['skipto'],
	async execute(client, message, args) {
		const voiceChannel = message.member.voice;
		const player = client.music.players.get(message.guild.id);

		if(isNaN(args[0])) return message.reply(`Invalid number. Please provide a number in seconds.\nCorrect Usage: \`${client.settings.prefix}seek <seconds>\``);
		if(!voiceChannel) return client.responses('noVoiceChannel', message);
		if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

		if(!player) return client.responses('noSongsPlaying', message);
		if(args[0] * 1000 >= player.queue[0].duration || args[0] < 0) return message.channel.send('Cannot seek beyond length of song.');

		player.seek(args[0] * 1000);
		return message.channel.send(`Seeked to ${Utils.formatTime(player.position, true)}`);
	},
};