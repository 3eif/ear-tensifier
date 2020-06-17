const premium = require('../../utils/misc/premium.js');
const Discord = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Bassboost extends Command {
	constructor(client) {
		super(client, {
			name: 'bassboost',
			description: 'Bassboosts a song',
			aliases: ['bb'],
			cooldown: '10',
			usage: '<amount (-10 - 10)>',
			voteLocked: true,
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message, args) {
		const player = client.music.players.get(message.guild.id);
		const delay = ms => new Promise(res => setTimeout(res, ms));

		if (!args[0]) {
			player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.65 })));
			const msg = await message.channel.send(`${client.emojiList.loading} Turning on **bassboost**. This may take a few seconds...`);
			const embed = new Discord.MessageEmbed()
				.setDescription('Turned on **bassboost**')
				.setColor(client.colors.main);
			await delay(5000);
			return msg.edit('', embed);
		}

		if (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off') {
			player.setEQ(Array(13).fill(0).map((n, i) => ({ band: i, gain: 0.15 })));
			const msg = await message.channel.send(`${client.emojiList.loading} Turning off **bassboost**. This may take a few seconds...`);
			const embed = new Discord.MessageEmbed()
				.setDescription('Turned off **bassboost**')
				.setColor(client.colors.main);
			await delay(5000);
			return msg.edit('', embed);
		}

		if (isNaN(args[0])) return message.channel.send('Amount must be a real number.');

		if (args[0] > 10 || args[0] < -10) {
			if (await premium(message.author.id, 'Premium') == false) {
				return message.channel.send('Only **Premium** users can set the bassboost higher. Click here to get premium: https://www.patreon.com/join/eartensifier');
			}
			else { player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: args[0] / 10 }))); }
		}
		else player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: args[0] / 10 })));

		const msg = await message.channel.send(`${client.emojiList.loading} Setting bassboost to **${args[0]}dB**. This may take a few seconds...`);
		const embed = new Discord.MessageEmbed()
			.setDescription(`Bassboost set to: **${args[0]}**`)
			.setColor(client.colors.main);
		await delay(5000);
		return msg.edit('', embed);
	}
};
