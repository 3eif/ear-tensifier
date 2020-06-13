/* eslint-disable no-unused-vars */
const Command = require('../../structures/Command');

const Discord = require('discord.js');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);
const fetch = require('node-fetch');
const columnify = require('columnify');
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
	async run(client, message) {
		const player = client.music.players.get(message.guild.id);

		const { title, author, length, uri } = player.current;

		const parsedDuration = moment.duration(length, 'milliseconds').format('mm:ss', { trim: false });
		const parsedQueueDuration = moment.duration(getQueueDuration(player), 'milliseconds').format('mm:ss', { trim: false });

		if (player.queue.length > 10) {
			const pagesNum = Math.ceil(player.queue.length / 10);
			const pages = [];
			let index = 1;
			for (let i = 0; i < pagesNum; i++) {
				const queueStr = `${player.queue.slice(pagesNum * i, pagesNum * i + 10).map(song => `**${index++}** - [${song.title}](${song.uri}) \`[${moment.duration(song.length, 'milliseconds').format('mm:ss', { trim: false })}]\` by ${song.author}.`).join('\n')}`;
				const queueEmbed = new Discord.MessageEmbed()
					.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
					.setColor(client.colors.main)
					.setDescription(`**Now Playing** - [${title}](${uri}) \`[${parsedDuration}]\` by ${author}.\n\n${queueStr}`)
					.setFooter(`${player.queue.length} songs | ${parsedQueueDuration} total duration`);
				pages.push(queueEmbed);
			}

			paginationEmbed(message, pages, ['⏪', '⏩'], 120000);
		}
		else {
			let index = 1;
			const queueStr = `${player.queue.slice(0, 10).map(song => `**${index++}** - [${song.title}](${song.uri}) \`[${moment.duration(song.length, 'milliseconds').format('mm:ss', { trim: false })}]\` by ${song.author}.`).join('\n')}`;
			const queueEmbed = new Discord.MessageEmbed()
				.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
				.setColor(client.colors.main)
				.setDescription(`**Now Playing** - [${title}](${uri}) \`[${parsedDuration}]\` by ${author}.\n\n${queueStr}`)
				.setFooter(`${player.queue.length} songs | ${parsedQueueDuration} total duration`);
			message.channel.send(queueEmbed);
		}
	}
};