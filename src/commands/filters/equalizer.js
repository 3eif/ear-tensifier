const Command = require('../../structures/Command');

const Discord = require('discord.js');

module.exports = class Equalizer extends Command {
	constructor(client) {
		super(client, {
			name: 'equalizer',
			description: 'Sets the equalizer of the current playing song.',
			aliases: ['eq'],
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
			permission: 'pro',
		});
	}
	async run(client, message, args) {

		const player = client.music.players.get(message.guild.id);

		if (!args[0]) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Custom Equalizer')
				.setColor(client.colors.main)
				.setDescription('There are 14 bands that can be set from -10 to 10. Not all bands have to be filled out.')
				.addField('Example Usage', `${client.settings.prefix} equalizer 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n${client.settings.prefix} equalizer 2 3 0 8 0 5 0 -5 0 0`)
				.addField('Reset Equalizer', `You can reset the equalizer by doing:\n${client.settings.prefix}reset`)
				.addField('Help', `If you need more help, please join the [support server](${client.settings.server})`)
				.setFooter('Premium Command');
			return message.channel.send(embed);
		}
		else if (args[0] == 'off' || args[0] == 'reset') {
			player.setFilter('filters', client.filters.reset);
		}

		const bands = args.join(' ').split(/[ ]+/);
		let bandsStr = '';
		for (let i = 0; i < bands.length; i++) {
			if (i > 13) break;
			if (isNaN(bands[i])) return message.channel.send(`Band #${i + 1} is not a valid number. Please type \`ear eq\` for info on the equalizer command.`);
			if (bands[i] > 10) return message.channel.send(`Band #${i + 1} must be less than 10. Please type \`ear eq\` for info on the equalizer command.`);
		}

		for (let i = 0; i < bands.length; i++) {
			if (i > 13) break;
			player.setEQ(...[{ band: i, gain: (bands[i]) / 10 }]);
			bandsStr += `${bands[i]} `;
		}

		const delay = ms => new Promise(res => setTimeout(res, ms));
		const msg = await message.channel.send(`${client.emojiList.loading} Setting equalizer to \`${bandsStr}\`. This may take a few seconds...`);
		const embed = new Discord.MessageEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL())
			.setDescription(`Equalizer set to: \`${bandsStr}\``)
			.setFooter('To reset the equalizer type: ear reset')
			.setColor(client.colors.main);
		await delay(5000);
		return msg.edit('', embed);
	}
};