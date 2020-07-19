const Discord = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class Bassboost extends Command {
	constructor(client) {
		super(client, {
			name: 'bassboost',
			description: 'Bassboosts a song',
			aliases: ['bb'],
			cooldown: '4',
			usage: '<amount (-10 - 10)>',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message, args) {
		const player = client.music.players.get(message.guild.id);
		const delay = ms => new Promise(res => setTimeout(res, ms));

		if (!args[0]) {
			player.setEQ(...Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.65 })));
			const msg = await message.channel.send(`${client.emojiList.loading} Turning on **bassboost**. This may take a few seconds...`);
			const embed = new Discord.MessageEmbed()
				.setDescription('Turned on **bassboost**')
				.setColor(client.colors.main);
			await delay(5000);
			return msg.edit('', embed);
		}

		if (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off') {
			player.setFilter('filters', client.filters.reset);
			const msg = await message.channel.send(`${client.emojiList.loading} Turning off **bassboost**. This may take a few seconds...`);
			const embed = new Discord.MessageEmbed()
				.setDescription('Turned off **bassboost**')
				.setColor(client.colors.main);
			await delay(5000);
			return msg.edit('', embed);
		}

		if (isNaN(args[0])) return message.channel.send('Amount must be a real number.');

		if (args[0] > 10 || args[0] < -10) {
			player.setEQ(...Array(6).fill(0).map((n, i) => ({ band: i, gain: args[0] / 10 })));
		}
		else player.setEQ(...Array(6).fill(0).map((n, i) => ({ band: i, gain: args[0] / 10 })));

		const msg = await message.channel.send(`${client.emojiList.loading} Setting bassboost to **${args[0]}dB**. This may take a few seconds...`);
		const embed = new Discord.MessageEmbed()
			.setDescription(`Bassboost set to: **${args[0]}**`)
			.setColor(client.colors.main);
		await delay(5000);
		return msg.edit('', embed);
	}
};
