/* eslint-disable no-unused-vars */
const Command = require('../../structures/Command');

const Discord = require('discord.js');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);
const fetch = require('node-fetch');
const columnify = require('columnify');
const Pagination = require('discord-paginationembed');

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

		let index = 1;
		let queueStr = '';
		const { title, author, length, uri } = player.current;

		const parsedDuration = moment.duration(length, 'milliseconds').format('mm:ss', { trim: false });
		const parsedQueueDuration = moment.duration(getQueueDuration(player), 'milliseconds').format('mm:ss', { trim: false });

		const FieldsEmbed = new Pagination.FieldsEmbed()
			.setArray([{ name: 'John Doe' }, { name: 'dsfdsffsd Doe' }])
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setElementsPerPage(1)
			// Initial page on deploy
			.setPage(1)
			.setPageIndicator(true)
			.formatField('Name', i => i.name)
			// Deletes the embed upon awaiting timeout
			// Disable built-in navigation emojis, in this case: 🗑 (Delete Embed)
			// Sets whether function emojis should be deployed after navigation emojis
			.setEmojisFunctionAfterNavigation(false);

		FieldsEmbed.embed
			.setColor(0xFF00AE)
			.setDescription('Test Description');

		await FieldsEmbed.build();

		// if (player.queue.length > 10) {
		// 	const FieldsEmbed = new Pagination.FieldsEmbed()
		// 		.setArray([{ name: 'John Doe' }, { name: 'Jane Doe' }])
		// 		.setAuthorizedUsers([message.author.id])
		// 		.setChannel(message.channel)
		// 		.setElementsPerPage(1)
		// 		// Initial page on deploy
		// 		.setPage(2)
		// 		.setPageIndicator(true)
		// 		.formatField('Name', i => i.name)
		// 		// Deletes the embed upon awaiting timeout
		// 		.setDeleteOnTimeout(true)
		// 		// Disable built-in navigation emojis, in this case: 🗑 (Delete Embed)
		// 		.setDisabledNavigationEmojis(['delete'])
		// 		// Sets whether function emojis should be deployed after navigation emojis
		// 		.setEmojisFunctionAfterNavigation(false);

		// 	FieldsEmbed.embed
		// 		.setColor(0xFF00AE)
		// 		.setDescription('Test Description');

		// 	await FieldsEmbed.build();
		// }
		// else {
		// 	queueStr = `${player.queue.slice(0, 10).map(song => `**${index++}** - [${song.title}](${song.uri}) \`[${moment.duration(song.length, 'milliseconds').format('mm:ss', { trim: false })}]\` by ${song.author}.`).join('\n')}`;
		// 	const queueEmbed = new Discord.MessageEmbed()
		// 		.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
		// 		.setColor(client.colors.main)
		// 		.setDescription(`**Now Playing** - [${title}](${uri}) \`[${parsedDuration}]\` by ${author}.\n\n${queueStr}`)
		// 		.setFooter(`${player.queue.length} songs | ${parsedQueueDuration} total duration`);
		// 	message.channel.send(queueEmbed);
		// }
	}
};