/* eslint-disable no-unused-vars */
const Command = require('../../structures/Command');

const Discord = require('discord.js');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);
const paginationEmbed = require('discord.js-pagination');

const getQueueDuration = require('../../utils/music/getQueueDuration.js');

module.exports = class Queue extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			description: 'Displays the queue.',
			aliases: ['q'],
			playing: true,
		});
	}
	async run(client, message, args) {
		const player = client.music.players.get(message.guild.id);

		const { title, author, length, uri } = player.current;

		const parsedDuration = moment.duration(length, 'milliseconds').format('mm:ss', { trim: false });
		const parsedQueueDuration = moment.duration(getQueueDuration(player), 'milliseconds').format('mm:ss', { trim: false });
		const pagesNum = Math.ceil(player.queue.length / 10);

		let index = 1;
		const queueStr = `${player.queue.slice(0, 10).map(song => `**${index++}** - [${song.title}](${song.uri}) \`[${moment.duration(song.length, 'milliseconds').format('mm:ss', { trim: false })}]\` by ${song.author}.`).join('\n')}`;
		const queueEmbed = new Discord.MessageEmbed()
			.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
			.setColor(client.colors.main)
			.setDescription(`**Now Playing** - [${title}](${uri}) \`[${parsedDuration}]\` by ${author}.\n\n${queueStr}`)
			.setFooter(`Page 1/${pagesNum} | ${player.queue.length - 1} songs | ${parsedQueueDuration} total duration`);

		if (player.queue.length <= 10 || args[0] == 1) message.channel.send(queueEmbed);

		if (player.queue.length > 10) {
			if (!args[0]) message.channel.send(queueEmbed);
			else {
				if(isNaN(args[0])) return message.channel.send('Page must be a number.');
				if(args[0] > pagesNum) return message.channel.send(`There are only ${pagesNum} pages available.`);

				let index2 = args[0] * 10 - 10;
				const pageStart = args[0] * 10 - 10;
				const pageEnd = args[0] * 10;

				client.log(pageStart);
				client.log(pageEnd);
				const queueStr2 = `${player.queue.slice(pageStart, pageEnd).map(song => `**${index2++}** - [${song.title}](${song.uri}) \`[${moment.duration(song.length, 'milliseconds').format('mm:ss', { trim: false })}]\` by ${song.author}.`).join('\n')}`;
				const queueEmbed2 = new Discord.MessageEmbed()
					.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
					.setColor(client.colors.main)
					.setDescription(`**Now Playing** - [${title}](${uri}) \`[${parsedDuration}]\` by ${author}.\n\n${queueStr2}`)
					.setFooter(`Page ${args[0]}/${pagesNum} | ${player.queue.length - 1} songs | ${parsedQueueDuration} total duration`);
					message.channel.send(queueEmbed2);
			}
		}
	}
};