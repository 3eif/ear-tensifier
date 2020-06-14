/* eslint-disable no-unused-vars */
const Command = require('../../structures/Command');

const Discord = require('discord.js');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);

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
			const pages = [];
			let n = 1;
			for (let i = 0; i < pagesNum; i++) {
				const str = `${player.queue.slice(pagesNum * i, pagesNum * i + 10).map(song => `**${n++}** - [${song.title}](${song.uri}) \`[${moment.duration(song.length, 'milliseconds').format('mm:ss', { trim: false })}]\` by ${song.author}.`).join('\n')}`;
				const embed = new Discord.MessageEmbed()
					.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
					.setColor(client.colors.main)
					.setDescription(`**Now Playing** - [${title}](${uri}) \`[${parsedDuration}]\` by ${author}.\n\n${str}`)
					.setFooter(`${player.queue.length} songs | ${parsedQueueDuration} total duration`);
				pages.push(embed);
			}

			if (!args[0]) paginationEmbed(message, pages, ['⏪', '⏩'], 120000);
			else {
				if(isNaN(args[0])) return message.channel.send('Page must be a number.');
				if(args[0] > pagesNum) return message.channel.send(`There are only ${pagesNum} pages available.`);

				let index2 = args[0] * 10 - 10;
				const pageStart = args[0] * 10 - 10;
				const pageEnd = args[0] * 10;

				const queueStr2 = `${player.queue.slice(pageStart, pageEnd).map(song => `**${index2++}** - [${song.title}](${song.uri}) \`[${moment.duration(song.length, 'milliseconds').format('mm:ss', { trim: false })}]\` by ${song.author}.`).join('\n')}`;
				const queueEmbed2 = new Discord.MessageEmbed()
					.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
					.setColor(client.colors.main)
					.setDescription(`**Now Playing** - [${title}](${uri}) \`[${parsedDuration}]\` by ${author}.\n\n${queueStr2}`)
					.setFooter(`Page ${args[0]}/${pagesNum} | ${player.queue.length - 1} songs | ${parsedQueueDuration} total duration`);
				paginationEmbed(message, pages, ['◀️', '▶️'], 120000);
			}
		}

		const paginationEmbed = async (msg, pages, emojiList, timeout) => {
			if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
			if (!pages) throw new Error('Pages are not given.');
			if (emojiList.length !== 2) throw new Error('Need two emojis.');
			let page = 0;
			const curPage = await msg.channel.send(pages[page]);
			for (const emoji of emojiList) await curPage.react(emoji);
			const reactionCollector = curPage.createReactionCollector(
				(reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot,
				{ time: timeout },
			);
			reactionCollector.on('collect', reaction => {
				reaction.users.remove(msg.author);
				switch (reaction.emoji.name) {
					case emojiList[0]:
						page = page > 0 ? --page : pages.length - 1;
						break;
					case emojiList[1]:
						page = page + 1 < pages.length ? ++page : 0;
						break;
					default:
						break;
				}
			});
			reactionCollector.on('end', () => curPage.reactions.removeAll());
			return curPage;
		};
	}
};