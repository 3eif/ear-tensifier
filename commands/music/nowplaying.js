const Discord = require('discord.js');
const { Utils } = require('erela.js');

module.exports = {
	name: 'nowplaying',
	description: 'Displays the song that is currently playing',
	aliases: ['playing', 'np'],
	async execute(client, message) {
		const player = client.music.players.get(message.guild.id);
		if (!player) return message.channel.send('No songs playing.');

		const { title, author, duration, requester, uri } = player.queue[0];
		if (player.position < 5000) {
			const embed = new Discord.MessageEmbed()
				.setColor(client.colors.main)
				.setTitle(player.playing ? 'Now Playing' : 'Paused')
				.setThumbnail(player.queue[0].displayThumbnail('default'))
				.setDescription(`[${title}](${uri})`)
				.addField('Duration', Utils.formatTime(duration, true), true)
				.addField('Requested by', requester, true);
			return message.channel.send(embed);

		}
		else {
			let amount = `${Utils.formatTime(player.position, true)}`;
			if(amount < 60) amount = `00:${amount}`;
			const part = Math.floor((player.position / duration) * 10);
			const embed = new Discord.MessageEmbed()
				.setColor(client.colors.main)
				.setTitle(player.playing ? 'Now Playing' : 'Paused')
				.setThumbnail(player.queue[0].displayThumbnail('default'))
				.setDescription(`[${title}](${uri})\n\n${amount}   ${'▬'.repeat(part) + '⚪' + '▬'.repeat(10 - part)}   ${Utils.formatTime(duration, true)}`)
				.addField('Author', author, true)
				.addField('Requested by', requester, true);
			return message.channel.send('', embed);
		}
	},
};
