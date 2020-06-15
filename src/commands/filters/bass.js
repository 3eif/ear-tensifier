const Command = require('../../structures/Command');

const Discord = require('discord.js');

module.exports = class Bass extends Command {
	constructor(client) {
		super(client, {
			name: 'bass',
			description: 'Turns on bass filter',
			cooldown: '10',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
			voteLocked: true,
		});
	}
	async run(client, message, args) {

		const player = client.music.players.get(message.guild.id);
		const delay = ms => new Promise(res => setTimeout(res, ms));

		if (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off')) {
			player.setEQ(Array(13).fill(0).map((n, i) => ({ band: i, gain: 0.15 })));
			const msg = await message.channel.send(`${client.emojiList.loading} Turning off **bass**. This may take a few seconds...`);
			const embed = new Discord.MessageEmbed()
				.setAuthor('Turned off **bass**', message.guild.iconURL())
				.setColor(client.colors.main);
			await delay(5000);
			return msg.edit('', embed);
		}

		player.setEQ(client.filters.bass);

		const msg = await message.channel.send(`${client.emojiList.loading} Turning on **bass**. This may take a few seconds...`);
		const embed = new Discord.MessageEmbed()
		.setAuthor('Turned on **bass**', message.guild.iconURL())
		.setColor(client.colors.main);
		await delay(5000);
		return msg.edit('', embed);
	}
};