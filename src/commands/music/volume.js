const Discord = require('discord.js');

module.exports = {
	name: 'volume',
	description: 'Sets the volume of the song',
	args: true,
	cooldown: '10',
	usage: '<volume #>',
	inVoiceChannel: true,
	sameVoiceChannel: true,
	playing: true,
	async execute(client, message, args) {
		if(!args[0]) return message.channel.send(`Current volume is set to: **${player.volume}**`);

		const player = client.music.players.get(message.guild.id);

		if(args[0].toLowerCase() == 'reset') {
			player.setVolume(Number(client.settings.normal));
			return message.channel.send('Volume has been reset back to normal.');
		}

		if(isNaN(args[0])) return message.channel.send('Invalid number.');
		player.setVolume(Number(args[0]));

		const embed = new Discord.MessageEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL())
			.setDescription(`Volume set to: **${args[0]}**`)
			.setFooter('Default volume: 100')
			.setColor(client.colors.main);
		return message.channel.send(embed);
	},
};