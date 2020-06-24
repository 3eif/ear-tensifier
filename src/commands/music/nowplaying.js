const Command = require('../../structures/Command');

const Discord = require('discord.js');


module.exports = class NowPlaying extends Command {
	constructor(client) {
		super(client, {
			name: 'nowplaying',
			description: 'Displays the song that is currently playing',
			aliases: ['playing', 'np'],
			playing: true,
		});
	}
	async run(client, message) {
		const player = client.music.players.get(message.guild.id);
		const { title, author, duration, requester, uri, identifier } = player.current;

		const parsedCurrentDuration = client.formatDuration(player.position);
		const parsedDuration = client.formatDuration(duration);
		const part = Math.floor((player.position / duration) * client.settings.embedDurationLength);
		const uni = player.playing ? '▶' : '⏸️';

		const thumbnail = `https://img.youtube.com/vi/${identifier}/default.jpg`;
		const user = `<@${!requester.id ? requester : requester.id}>`;

		const embed = new Discord.MessageEmbed()
			.setColor(client.colors.main)
			.setAuthor(player.playing ? 'Now Playing' : 'Paused', 'https://cdn.discordapp.com/emojis/673357192203599904.gif?v=1')
			.setThumbnail(thumbnail)
			.setDescription(`**[${title}](${uri})**`)
			.addField('Author', author, true)
			.addField('Requested By', user, true)
			.addField('Duration', `\`\`\`${parsedCurrentDuration}/${parsedDuration}  ${uni} ${'─'.repeat(part) + '⚪' + '─'.repeat(client.settings.embedDurationLength - part)}\`\`\``);

		return message.channel.send('', embed);
	}
};
