const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class Reset extends Command {
	constructor(client) {
		super(client, {
			name: 'reset',
			description: 'Resets the filters to normal.',
			aliases: ['normal'],
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message) {
		const player = client.music.players.get(message.guild.id);
		const delay = ms => new Promise(res => setTimeout(res, ms));

		player.setFilter('filters', client.filters.reset);
		player.setVolume(100);

		const msg = await message.channel.send(`${client.emojiList.loading} Reseting filters to default...`);
		const embed = new Discord.MessageEmbed()
			.setDescription('Filters reset!')
			.setColor(client.colors.main);
		await delay(5000);
		return msg.edit('', embed);
	}
};