const Command = require('../../structures/Command');

const premium = require('../../utils/premium/premium.js');
const Discord = require('discord.js');

module.exports = class Pop extends Command {
	constructor(client) {
		super(client, {
			name: 'pop',
			description: 'Turns on pop filter',
			cooldown: '10',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message, args) {
		if (await premium(message.author.id, 'Premium') == false) return client.responses('noPremium', message);

		const player = client.music.players.get(message.guild.id);
		const delay = ms => new Promise(res => setTimeout(res, ms));

		if (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off')) {
			player.setEQ(Array(13).fill(0).map((n, i) => ({ band: i, gain: 0 })));
			const msg = await message.channel.send(`${client.emojiList.loading} Turning off **pop**. This may take a few seconds...`);
			const embed = new Discord.MessageEmbed()
				.setAuthor(message.guild.name, message.guild.iconURL())
				.setDescription('Pop filter off')
				.setColor(client.colors.main);
			await delay(5000);
			return msg.edit('', embed);
		}

		player.setEQ(client.filters.pop);

		const msg = await message.channel.send(`${client.emojiList.loading} Turning on **pop**. This may take a few seconds...`);
		const embed = new Discord.MessageEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL())
			.setDescription('Pop filter on')
			.setFooter('Reset filter: ear reset')
			.setColor(client.colors.main);
		await delay(5000);
		return msg.edit('', embed);
	}
};
