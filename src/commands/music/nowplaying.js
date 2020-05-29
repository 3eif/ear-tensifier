const Command = require('../../structures/Command');

const Discord = require('discord.js');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);

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
		const { title, author, duration, requester, uri, identifier } = player.queue[0];

		const parsedCurrentDuration = moment.duration(player.position, 'milliseconds').format('hh:mm:ss', { trim: false });
		const parsedDuration = moment.duration(duration, 'milliseconds').format('hh:mm:ss', { trim: false });
		const part = Math.floor((player.position / duration) * 30);
		const uni = player.playing ? '▶' : '⏸️';

		const thumbnail = `https://img.youtube.com/vi/${identifier}/mqdefault.jpg`;
		const user = `<@${requester.id}>`;

		const embed = new Discord.MessageEmbed()
			.setColor(client.colors.main)
			.setAuthor(player.playing ? 'Now Playing' : 'Paused', 'https://cdn.discordapp.com/emojis/673357192203599904.gif?v=1')
			.setThumbnail(thumbnail)
			.setDescription(`**[${title}](${uri})**`)
			.addField('Author', author, true)
			.addField('Requested by', user, true)
			.addField(`Duration \`[${parsedDuration}]\``, `\`\`\`${uni} ${'─'.repeat(part) + '⚪' + '─'.repeat(30 - part)} ${parsedCurrentDuration}\`\`\``);

		return message.channel.send('', embed);
	}
};
