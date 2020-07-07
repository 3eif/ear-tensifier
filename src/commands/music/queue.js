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

		const { song, id } = player.queue.current;
		// eslint-disable-next-line prefer-const
		let { title, length, uri } = client.decode(song);
		length = Number(length);

		const parsedDuration = client.formatDuration(length);
		const parsedQueueDuration = client.formatDuration(getQueueDuration(player));
		let pagesNum = Math.ceil(player.queue.length / 10);
		if (pagesNum === 0) pagesNum = 1;

		const songStrings = [];
		for (let i = 0; i < player.queue.next.length; i++) {
			const track = client.decode(player.queue.next[i].song);
			songStrings.push(
				`**${i + 1}.** [${track.title}](${track.uri}) \`[${client.formatDuration(track.length)}]\` • <@${player.queue.next[i].id}>
				`);
		}

		const pages = [];
		for (let i = 0; i < pagesNum; i++) {
			const str = songStrings.slice(i * 10, i * 10 + 10).join('');
			const embed = new Discord.MessageEmbed()
				.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
				.setColor(client.colors.main)
				.setDescription(`**Now Playing**: [${title}](${uri}) \`[${parsedDuration}]\` • <@${id}>.\n\n**Up Next**:\n${str}`)
				.setFooter(`Page ${i + 1}/${pagesNum} | ${player.queue.length} song(s) | ${parsedQueueDuration} total duration`);
			pages.push(embed);
		}

		if (!args[0]) {
			if (pages.length == pagesNum && player.queue.length > 10) paginate(client, message, pages, ['◀️', '▶️'], 120000, player.queue.length, parsedQueueDuration);
			else return message.channel.send(pages[0]);
		}
		else {
			if (isNaN(args[0])) return message.channel.send('Page must be a number.');
			if (args[0] > pagesNum) return message.channel.send(`There are only ${pagesNum} pages available.`);
			const pageNum = args[0] == 0 ? 1 : args[0] - 1;
			return message.channel.send(pages[pageNum]);
		}
	}
};