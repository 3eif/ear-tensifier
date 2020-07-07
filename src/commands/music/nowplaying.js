const Command = require('../../structures/Command');

const Discord = require('discord.js');
const { decode } = require("@lavalink/encoding");

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
		const { song, id } = player.queue.current;

		let { title, author, length, uri, identifier } = decode(song);
		length = Number(length);

		const parsedCurrentDuration = client.formatDuration(player.position);
		const parsedDuration = client.formatDuration(length);
		const part = Math.floor((player.position / length) * Number(client.settings.embedDurationLength));
		const uni = player.playing ? '▶' : '⏸️';

		const thumbnail = `https://img.youtube.com/vi/${identifier}/default.jpg`;
		const user = `<@${id}>`;

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
