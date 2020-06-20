/* eslint-disable no-unused-vars */
const Command = require('../../structures/Command');

const Discord = require('discord.js');
const paginate = require('../../utils/music/paginate.js');
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

		const { title, requester, length, uri } = player.current;

		const parsedDuration = client.formatDuration(length);
		const parsedQueueDuration = client.formatDuration(getQueueDuration(player));
		let pagesNum = Math.ceil(player.queue.length / 10);
		if(pagesNum === 0) pagesNum = 1;

		let index = 1;
		const queueStr = `${player.queue.slice(0, 10).map(song => `**${index++}** - [${song.title}](${song.uri}) \`[${client.formatDuration(song.length)}]\`| <@${song.requester.id}>`).join('\n')}`;
		const queueEmbed = new Discord.MessageEmbed()
			.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
			.setColor(client.colors.main)
			.setDescription(`**Now Playing** - [${title}](${uri}) \`[${parsedDuration}]\` | <@${requester.id}>.\n\n${queueStr}`)
			.setFooter(`Page 1/${pagesNum} | ${player.queue.length} songs | ${parsedQueueDuration} total duration`);

		if (player.queue.length <= 10) return message.channel.send(queueEmbed);

		if (player.queue.length > 10) {
			if(args[0]) {
				if (isNaN(args[0])) return message.channel.send('Page must be a number.');
				if (args[0] > pagesNum) return message.channel.send(`There are only ${pagesNum} pages available.`);

				let index2 = args[0] * 10 - 10;
				const pageStart = args[0] * 10 - 10;
				const pageEnd = args[0] * 10;

				const queueStr2 = `${player.queue.slice(pageStart, pageEnd).map(song => `**${index2++}** - [${song.title}](${song.uri}) \`[${client.formatDuration(song.length)}]\`| <@${song.requester.id}>`).join('\n')}`;
				const queueEmbed2 = new Discord.MessageEmbed()
					.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
					.setColor(client.colors.main)
					.setDescription(`**Now Playing** - [${title}](${uri}) \`[${parsedDuration}]\` | <@${requester.id}>.\n\n${queueStr2}`)
					.setFooter(`Page ${args[0]}/${pagesNum} | ${player.queue.length} songs | ${parsedQueueDuration} total duration`);
				return message.channel.send(queueEmbed2);
			}
			else {
				const pages = [];
				let n = 1;
				for (let i = 0; i < pagesNum; i++) {
					const str = `${player.queue.slice(i * 10, i * 10 + 10).map(song => `**${n++}** - [${song.title}](${song.uri}) \`[${client.formatDuration(song.length)}]\`| <@${song.requester.id}>`).join('\n')}`;
					const embed = new Discord.MessageEmbed()
						.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
						.setColor(client.colors.main)
						.setDescription(`**Now Playing** - [${title}](${uri}) \`[${parsedDuration}]\` | <@${requester.id}>.\n\n${str}`)
						.setFooter(`Page ${i + 1}/${pagesNum} | ${player.queue.length} songs | ${parsedQueueDuration} total duration`);
					pages.push(embed);
					if(i == pagesNum - 1) paginate(message, pages, ['◀️', '▶️'], 120000, player.queue.length, parsedQueueDuration);
				}
			}
		}
	}
};