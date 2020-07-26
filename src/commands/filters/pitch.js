const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class Pitch extends Command {
	constructor(client) {
		super(client, {
			name: 'pitch',
			description: 'Sets the pitch of the song.',
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			usage: '<pitch>',
			args: true,
			permission: 'pro',
		});
	}
	async run(client, message, args) {
		const player = client.music.players.get(message.guild.id);
		const delay = ms => new Promise(res => setTimeout(res, ms));
		if (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off') {
			player.setFilter('filters', client.filters.reset);
			const msg = await message.channel.send(`${client.emojiList.loading} Reseting **pitch**. This may take a few seconds...`);
			const embed = new Discord.MessageEmbed()
				.setDescription('Reset **pitch**')
				.setColor(client.colors.main);
			await delay(5000);
			return msg.edit('', embed);
		}

		if (isNaN(args[0])) return message.channel.send('Amount must be a real number.');
		if (args[0] < 0) return message.channel.send('Pitch must be greater than 0.');
		if (args[0] > 10) return message.channel.send('Pitch must be less than 10.');

		player.setFilter('filters', {
			timescale: { pitch: args[0] },
		});
		const msg = await message.channel.send(`${client.emojiList.loading} Setting pitch to **${args[0]}**. This may take a few seconds...`);
		const embed = new Discord.MessageEmbed()
			.setDescription(`Pitch set to: **${args[0]}**`)
			.setColor(client.colors.main);
		await delay(5000);
		return msg.edit('', embed);
	}
};