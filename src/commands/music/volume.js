const Command = require('../../structures/Command');

const Discord = require('discord.js');

module.exports = class Volume extends Command {
	constructor(client) {
		super(client, {
			name: 'volume',
			description: 'Sets the volume of the song',
			cooldown: '10',
			usage: '<volume #>',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message, args) {
		const player = client.manager.players.get(message.guild.id);

		if (!args[0]) return message.channel.send(`Current volume is set to: **${player.volume}**`);

		if (args[0].toLowerCase() == 'reset') {
			player.setVolume(Number(client.settings.normal));
			return message.channel.send('Volume has been reset back to normal.');
		}

		if (isNaN(args[0])) return message.channel.send('Invalid number.');

		let volume = Number(args[0]);
		if(volume > 1000) volume = 1000;
		player.setVolume(volume);

		const embed = new Discord.MessageEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL())
			.setDescription(`Volume set to: **${args[0]}**`)
			.setFooter('Default volume: 100')
			.setColor(client.colors.main);
		return message.channel.send(embed);
	}
};