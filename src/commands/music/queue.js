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

		const { title, requester, duration, uri } = player.current;

		const parsedDuration = client.formatDuration(duration);
		const parsedQueueDuration = client.formatDuration(getQueueDuration(player));
		let pagesNum = Math.ceil(player.queue.length / 10);
		if(pagesNum === 0) pagesNum = 1;

		const songStrings = [];
		for (let i = 0; i < player.queue.length; i++) {
			const song = player.queue[i];
			songStrings.push(
				`**${i + 1}.** [${song.title}](${song.uri}) \`[${client.formatDuration(song.duration)}]\` • <@${!song.requester.id ? song.requester : song.requester.id}>
				`);
		}

		const user = `<@${!requester.id ? requester : requester.id}>`;
		const pages = [];
		for (let i = 0; i < pagesNum; i++) {
			const str = songStrings.slice(i * 10, i * 10 + 10).join('');
			const embed = new Discord.MessageEmbed()
				.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
				.setColor(client.colors.main)
				.setDescription(`**Now Playing**: [${title}](${uri}) \`[${parsedDuration}]\` • ${user}.\n\n**Up Next**:${str == '' ? '  Nothing' : '\n' + str }`)
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