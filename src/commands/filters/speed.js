const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class Speed extends Command {
	constructor(client) {
		super(client, {
			name: 'speed',
			description: 'Sets the speed of the song.',
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
            usage: '<speed>',
			args: true,
			permission: 'pro',
		});
	}
	async run(client, message, args) {
		const player = client.music.players.get(message.guild.id);
		const delay = ms => new Promise(res => setTimeout(res, ms));
		if (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off') {
			player.setFilter('filters', client.filters.reset);
			const msg = await message.channel.send(`${client.emojiList.loading} Reseting **speed**. This may take a few seconds...`);
			const embed = new Discord.MessageEmbed()
				.setDescription('Reset **speed**')
				.setColor(client.colors.main);
			await delay(5000);
			return msg.edit('', embed);
		}

		if (isNaN(args[0])) return message.channel.send('Amount must be a real number.');
		if (args[0] < 0) return message.channel.send('Speed must be greater than 0.');
		if (args[0] > 10) return message.channel.send('Speed must be less than 10.');

		player.setFilter('filters', {
			timescale: { speed: args[0] },
		});
		const msg = await message.channel.send(`${client.emojiList.loading} Setting speed to **${args[0]}x**. This may take a few seconds...`);
		const embed = new Discord.MessageEmbed()
			.setDescription(`Speed set to: **${args[0]}x**`)
			.setColor(client.colors.main);
		await delay(5000);
		return msg.edit('', embed);
	}
};